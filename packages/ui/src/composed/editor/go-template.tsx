"use client";

import type { Monaco } from "@monaco-editor/react";
import {
  MonacoEditor,
  type MonacoEditorProps,
} from "@workspace/ui/composed/editor/monaco-editor";
import type * as monaco from "monaco-editor";
import DraculaTheme from "monaco-themes/themes/Dracula.json" with {
  type: "json",
};
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

type SchemaType = "string" | "number" | "boolean" | "object" | "array" | "null";

interface SchemaProperty {
  type: SchemaType;
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
  description?: string;
}

export interface GoTemplateEditorProps
  extends Omit<MonacoEditorProps, "language"> {
  schema?: Record<string, SchemaProperty> | Record<string, unknown>;
  enableSprig?: boolean;
}

interface CompletionItem {
  label: string;
  kind: number;
  insertText: string;
  documentation: string;
  sortText: string;
}

const SORT_PREFIXES = {
  RANGE_VAR: "aa_var_",
  NESTED: "a_nested_",
  CURRENT: "a_current_",
  VAR_FIELD: "b_var_",
  ROOT_FIELD: "c_field_",
  RANGE_OP: "d_range_",
  WITH_OP: "d_with_",
  ROOT_IN_RANGE: "y_root_",
  KEYWORD: "z_keyword_",
  SPRIG: "zz_sprig_",
} as const;

const COMPLETION_KINDS = {
  VARIABLE: 6,
  PROPERTY: 10,
  FUNCTION: 3,
  KEYWORD: 14,
} as const;

const MATCH_SCORES = {
  EXACT: 1000,
  DOT_FIELD: 1000,
  PREFIX_BASE: 800,
  DOT_VARIABLE: 500,
  INCLUDE_BASE: 500,
  FUZZY_BASE: 100,
  OTHER: 100,
} as const;

const REGEX_PATTERNS = {
  RANGE_ASSIGNMENT: /(?:\$\w+\s*,\s*)?(\$\w+)\s*:=\s*(\.\w+(?:\.\w+)*)/,
  FIELD_PATH: /^(\.\w+(?:\.\w+)*)$/,
  NESTED_DOT: /(\.\w+(?:\.\w+)*)\./,
  NESTED_VAR: /(\$\w+\.\w+(?:\.\w+)*)\.$/,
  VAR_DOT: /(\$\w+)\.$/,
  NESTED_GENERAL: /([\w.]+)\.$/,
  WORD_WITH_SPACES: /(\s*)(\S*)$/,
  LEADING_SPACES: /^(\s+)/,
  DOT_VAR_CLEAN: /^[.$]/,
} as const;

const COMPLETION_SNIPPETS = {
  IF_BLOCK: {
    label: "if...end",
    kind: 15,
    insertText: "if ${1:condition}\n\t$0\nend",
    insertTextRules: 4,
    documentation: "Create an if block",
    sortText: `${SORT_PREFIXES.KEYWORD}if_block`,
  },
  RANGE_BLOCK: {
    label: "range...end",
    kind: 15,
    insertText: "range ${1:.items}\n\t$0\nend",
    insertTextRules: 4,
    documentation: "Create a range loop block",
    sortText: `${SORT_PREFIXES.KEYWORD}range_block`,
  },
  WITH_BLOCK: {
    label: "with...end",
    kind: 15,
    insertText: "with ${1:.field}\n\t$0\nend",
    insertTextRules: 4,
    documentation: "Create a with block",
    sortText: `${SORT_PREFIXES.KEYWORD}with_block`,
  },
} as const;

const calculateMatchScore = (label: string, searchText: string): number => {
  if (!searchText) return 0;

  if (searchText === ".") {
    if (label.startsWith(".")) return MATCH_SCORES.DOT_FIELD;
    if (label.startsWith("$")) return MATCH_SCORES.DOT_VARIABLE;
    return MATCH_SCORES.OTHER;
  }

  const labelLower = label.toLowerCase();
  const searchLower = searchText.toLowerCase();
  const cleanLabel = labelLower.replace(REGEX_PATTERNS.DOT_VAR_CLEAN, "");
  const cleanSearch = searchLower.replace(REGEX_PATTERNS.DOT_VAR_CLEAN, "");

  if (cleanLabel === cleanSearch || labelLower === searchLower) {
    return MATCH_SCORES.EXACT;
  }

  if (
    cleanLabel.startsWith(cleanSearch) ||
    labelLower.startsWith(searchLower)
  ) {
    const matchLength = Math.max(cleanSearch.length, searchLower.length);
    const totalLength = Math.max(cleanLabel.length, labelLower.length);
    return MATCH_SCORES.PREFIX_BASE + (matchLength / totalLength) * 100;
  }

  let includeIndex = cleanLabel.indexOf(cleanSearch);
  if (includeIndex === -1) {
    includeIndex = labelLower.indexOf(searchLower);
  }

  if (includeIndex !== -1) {
    const totalLength = Math.max(cleanLabel.length, labelLower.length);
    const positionScore = ((totalLength - includeIndex) / totalLength) * 50;
    const matchLength = Math.max(cleanSearch.length, searchLower.length);
    const lengthScore = (matchLength / totalLength) * 100;
    return MATCH_SCORES.INCLUDE_BASE + positionScore + lengthScore;
  }

  let fuzzyScore = 0;
  let searchIndex = 0;
  const targetText = cleanSearch ? cleanLabel : labelLower;
  const searchQuery = cleanSearch || searchLower;

  for (
    let i = 0;
    i < targetText.length && searchIndex < searchQuery.length;
    i++
  ) {
    if (targetText[i] === searchQuery[searchIndex]) {
      fuzzyScore += 10;
      searchIndex++;
    }
  }

  return searchIndex === searchQuery.length
    ? MATCH_SCORES.FUZZY_BASE + fuzzyScore
    : 0;
};

const generateDynamicSortText = (
  item: CompletionItem,
  searchText: string,
  baseCategory: string
): string => {
  const matchScore = calculateMatchScore(item.label, searchText);
  const scorePrefix = (10_000 - matchScore).toString().padStart(5, "0");
  return `${scorePrefix}_${baseCategory}_${item.label}`;
};

const GO_TEMPLATE_KEYWORDS = [
  "if",
  "else",
  "end",
  "with",
  "range",
  "template",
  "define",
  "block",
  "include",
  "not",
  "and",
  "or",
  "eq",
  "ne",
  "lt",
  "le",
  "gt",
  "ge",
  "len",
  "index",
  "slice",
  "printf",
  "print",
  "println",
];

const SPRIG_FUNCTIONS = [
  "trim",
  "trimAll",
  "trimSuffix",
  "trimPrefix",
  "upper",
  "lower",
  "title",
  "untitle",
  "repeat",
  "substr",
  "nospace",
  "trunc",
  "abbrev",
  "abbrevboth",
  "initials",
  "randAlphaNum",
  "randAlpha",
  "randNumeric",
  "randAscii",
  "wrap",
  "wrapWith",
  "contains",
  "hasPrefix",
  "hasSuffix",
  "quote",
  "squote",
  "cat",
  "indent",
  "nindent",
  "replace",
  "plural",
  "snakecase",
  "camelcase",
  "kebabcase",
  "swapcase",
  "shuffle",

  "splitList",
  "split",
  "join",
  "sortAlpha",

  "add",
  "add1",
  "sub",
  "div",
  "mod",
  "mul",
  "max",
  "min",
  "floor",
  "ceil",
  "round",
  "randInt",

  "until",
  "untilStep",
  "seq",

  "addf",
  "add1f",
  "subf",
  "divf",
  "mulf",
  "maxf",
  "minf",

  "now",
  "ago",
  "date",
  "dateInZone",
  "duration",
  "durationRound",
  "unixEpoch",
  "dateModify",
  "mustDateModify",
  "htmlDate",
  "htmlDateInZone",
  "toDate",
  "mustToDate",

  "default",
  "empty",
  "coalesce",
  "fromJson",
  "toJson",
  "toPrettyJson",
  "toRawJson",
  "ternary",

  "b64enc",
  "b64dec",
  "base32enc",
  "base32dec",

  "list",
  "first",
  "rest",
  "last",
  "initial",
  "append",
  "prepend",
  "concat",
  "reverse",
  "uniq",
  "without",
  "has",
  "compact",
  "slice",

  "get",
  "set",
  "dict",
  "hasKey",
  "pluck",
  "dig",
  "deepCopy",
  "keys",
  "pick",
  "omit",
  "merge",
  "mergeOverwrite",
  "values",

  "atoi",
  "int",
  "int64",
  "float64",
  "toDecimal",
  "toString",
  "toStrings",

  "regexMatch",
  "mustRegexMatch",
  "regexFindAll",
  "mustRegexFindAll",
  "regexFind",
  "mustRegexFind",
  "regexReplaceAll",
  "mustRegexReplaceAll",
  "regexReplaceAllLiteral",
  "mustRegexReplaceAllLiteral",
  "regexSplit",
  "mustRegexSplit",
  "regexQuoteMeta",

  "sha1sum",
  "sha256sum",
  "adler32sum",
  "htpasswd",
  "derivePassword",
  "buildCustomCert",
  "genCA",
  "genCAWithKey",
  "genSelfSignedCert",
  "genSelfSignedCertWithKey",
  "genSignedCert",
  "genSignedCertWithKey",
  "encryptAES",
  "decryptAES",
  "genPrivateKey",
  "genPublicKey",

  "base",
  "dir",
  "ext",
  "clean",
  "isAbs",
  "osBase",
  "osDir",
  "osExt",
  "osClean",
  "osIsAbs",

  "fail",

  "uuidv4",

  "env",
  "expandenv",

  "semver",
  "semverCompare",

  "typeOf",
  "typeIs",
  "typeIsLike",
  "kindOf",
  "kindIs",
  "deepEqual",

  "getHostByName",

  "urlParse",
  "urlJoin",
  "urlquery",
];

export function GoTemplateEditor({
  schema,
  enableSprig = true,
  ...props
}: GoTemplateEditorProps) {
  const { t } = useTranslation("components");
  const providersRef = useRef<{
    completionProvider?: monaco.IDisposable;
    semanticTokensProvider?: monaco.IDisposable;
  }>({});

  const cleanup = () => {
    if (providersRef.current.completionProvider) {
      providersRef.current.completionProvider.dispose();
    }
    if (providersRef.current.semanticTokensProvider) {
      providersRef.current.semanticTokensProvider.dispose();
    }
    providersRef.current = {};
  };

  useEffect(() => cleanup, []);

  const generateSmartCompletions = (
    schema:
      | Record<string, SchemaProperty>
      | Record<string, unknown>
      | undefined,
    activeRangeField?: string | null,
    rangeVariable?: string | null
  ): CompletionItem[] => {
    if (!schema) return [];

    const isSchemaProperty = (obj: unknown): obj is SchemaProperty =>
      obj !== null && typeof obj === "object" && "type" in obj;

    if (activeRangeField) {
      const rangeCompletions = getRangeCompletions(
        schema,
        activeRangeField,
        rangeVariable || null,
        isSchemaProperty
      );

      const hasAlias = rangeVariable !== null;

      if (hasAlias) {
        const rootCompletions = getRootCompletions(
          schema,
          isSchemaProperty,
          true
        );
        return [...rangeCompletions, ...rootCompletions];
      }
      return rangeCompletions;
    }

    return getRootCompletions(schema, isSchemaProperty);
  };

  const getRootCompletions = (
    schema: Record<string, unknown>,
    isSchemaProperty: (obj: unknown) => obj is SchemaProperty,
    isInRangeContext = false
  ): CompletionItem[] => {
    const items: CompletionItem[] = [];
    const sortPrefix = isInRangeContext
      ? SORT_PREFIXES.ROOT_IN_RANGE
      : SORT_PREFIXES.ROOT_FIELD;

    Object.keys(schema).forEach((key) => {
      const value = schema[key];

      if (isSchemaProperty(value)) {
        const prop = value as SchemaProperty;
        addFieldCompletions(items, key, prop, "", false, sortPrefix);
      } else {
        items.push({
          label: `.${key}`,
          kind: COMPLETION_KINDS.PROPERTY,
          insertText: `.${key}`,
          documentation: `${isInRangeContext ? "(root) " : ""}Field: ${key}`,
          sortText: `${sortPrefix}${key}`,
        });
      }
    });

    return items;
  };

  const getRangeCompletions = (
    schema: Record<string, unknown>,
    rangeField: string,
    rangeVariable: string | null,
    isSchemaProperty: (obj: unknown) => obj is SchemaProperty
  ): CompletionItem[] => {
    const items: CompletionItem[] = [];
    if (rangeVariable) {
      items.push({
        label: rangeVariable,
        kind: COMPLETION_KINDS.VARIABLE,
        insertText: rangeVariable,
        documentation: `Range variable for current item in ${rangeField}`,
        sortText: `${SORT_PREFIXES.RANGE_VAR}${rangeVariable}`,
      });
    }

    const fieldPath = rangeField.startsWith(".")
      ? rangeField.slice(1)
      : rangeField;
    const pathParts = fieldPath.split(".");

    let currentSchema: Record<string, unknown> | SchemaProperty | null = schema;
    for (const part of pathParts) {
      if (
        currentSchema &&
        typeof currentSchema === "object" &&
        !isSchemaProperty(currentSchema)
      ) {
        const schemaObj = currentSchema as Record<string, unknown>;
        if (schemaObj[part]) {
          currentSchema = schemaObj[part] as
            | Record<string, unknown>
            | SchemaProperty;
          if (
            isSchemaProperty(currentSchema) &&
            currentSchema.type === "object" &&
            currentSchema.properties
          ) {
            currentSchema = currentSchema.properties;
          }
        } else {
          return items;
        }
      } else {
        return items;
      }
    }

    if (
      isSchemaProperty(currentSchema) &&
      currentSchema.type === "array" &&
      currentSchema.items
    ) {
      const itemSchema = currentSchema.items;
      if (itemSchema.type === "object" && itemSchema.properties) {
        Object.keys(itemSchema.properties).forEach((key) => {
          const prop = itemSchema.properties![key];

          if (isSchemaProperty(prop)) {
            if (!rangeVariable) {
              addFieldCompletions(items, key, prop, "", true);
            }
          } else if (!rangeVariable) {
            items.push({
              label: `.${key}`,
              kind: COMPLETION_KINDS.PROPERTY,
              insertText: `.${key}`,
              documentation: `Field in current item: ${key}`,
              sortText: `${SORT_PREFIXES.CURRENT}${key}`,
            });
          }

          if (rangeVariable) {
            if (isSchemaProperty(prop)) {
              items.push({
                label: `${rangeVariable}.${key}`,
                kind: COMPLETION_KINDS.PROPERTY,
                insertText: `${rangeVariable}.${key}`,
                documentation: `${prop.description || key} (${prop.type}) via range variable`,
                sortText: `${SORT_PREFIXES.VAR_FIELD}${rangeVariable}_${key}`,
              });
            } else {
              items.push({
                label: `${rangeVariable}.${key}`,
                kind: COMPLETION_KINDS.PROPERTY,
                insertText: `${rangeVariable}.${key}`,
                documentation: `Field ${key} via range variable ${rangeVariable}`,
                sortText: `${SORT_PREFIXES.VAR_FIELD}${rangeVariable}_${key}`,
              });
            }
          }
        });
      }
    }

    return items;
  };

  const addFieldCompletions = (
    items: CompletionItem[],
    key: string,
    prop: SchemaProperty,
    prefix: string,
    isRangeContext = false,
    customSortPrefix?: string
  ) => {
    const fieldPath = prefix ? `${prefix}.${key}` : `.${key}`;
    const contextPrefix = isRangeContext ? "(current item) " : "";
    const sortPrefix =
      customSortPrefix ||
      (isRangeContext ? SORT_PREFIXES.CURRENT : SORT_PREFIXES.ROOT_FIELD);

    items.push({
      label: fieldPath,
      kind: COMPLETION_KINDS.PROPERTY,
      insertText: fieldPath,
      documentation: `${contextPrefix}${prop.description || key} (${prop.type})`,
      sortText: `${sortPrefix}${fieldPath}`,
    });

    if (prop.type === "array" && !isRangeContext) {
      items.push({
        label: `range ${fieldPath}`,
        kind: COMPLETION_KINDS.KEYWORD,
        insertText: `range ${fieldPath}`,
        documentation: `Loop through ${fieldPath} array`,
        sortText: `${SORT_PREFIXES.RANGE_OP}${fieldPath}`,
      });
    }

    if (prop.type === "object" && !isRangeContext) {
      items.push({
        label: `with ${fieldPath}`,
        kind: COMPLETION_KINDS.KEYWORD,
        insertText: `with ${fieldPath}`,
        documentation: `Set context to ${fieldPath} object`,
        sortText: `${SORT_PREFIXES.WITH_OP}${fieldPath}`,
      });
    }
  };

  const getNestedFieldCompletions = (
    schema:
      | Record<string, SchemaProperty>
      | Record<string, unknown>
      | undefined,
    fieldPath: string,
    isSchemaProperty: (obj: unknown) => obj is SchemaProperty
  ): CompletionItem[] => {
    if (!schema) return [];

    const items: CompletionItem[] = [];
    let cleanPath = fieldPath;

    if (cleanPath.startsWith("$")) {
      cleanPath = cleanPath.replace(/^\$\w+\./, "");
    } else if (cleanPath.startsWith(".")) {
      cleanPath = cleanPath.slice(1);
    }

    if (!cleanPath || cleanPath === "") {
      Object.keys(schema).forEach((key) => {
        const value = schema[key];
        if (isSchemaProperty(value)) {
          items.push({
            label: key,
            kind: 10,
            insertText: key,
            documentation: `${value.description || key} (${value.type})`,
            sortText: `a_nested_${key}`,
          });
        } else {
          items.push({
            label: key,
            kind: 10,
            insertText: key,
            documentation: `Field: ${key}`,
            sortText: `a_nested_${key}`,
          });
        }
      });
      return items;
    }

    const pathParts = cleanPath
      .split(".")
      .filter((part) => part && part.length > 0);

    let currentSchema: Record<string, unknown> | SchemaProperty | null = schema;

    for (const part of pathParts) {
      if (
        currentSchema &&
        typeof currentSchema === "object" &&
        !isSchemaProperty(currentSchema)
      ) {
        const schemaObj = currentSchema as Record<string, unknown>;
        if (schemaObj[part]) {
          currentSchema = schemaObj[part] as
            | Record<string, unknown>
            | SchemaProperty;
        } else {
          return items;
        }
      } else if (isSchemaProperty(currentSchema)) {
        if (currentSchema.type === "object" && currentSchema.properties) {
          const prop = currentSchema.properties[part] as
            | SchemaProperty
            | Record<string, unknown>
            | undefined;
          if (prop) {
            currentSchema = prop;
          } else {
            return items;
          }
        } else {
          return items;
        }
      } else {
        return items;
      }
    }

    if (
      isSchemaProperty(currentSchema) &&
      currentSchema.type === "object" &&
      currentSchema.properties
    ) {
      Object.keys(currentSchema.properties).forEach((key) => {
        const prop = currentSchema.properties![key];
        if (isSchemaProperty(prop)) {
          items.push({
            label: key,
            kind: COMPLETION_KINDS.PROPERTY,
            insertText: key,
            documentation: `${prop.description || key} (${prop.type})`,
            sortText: `${SORT_PREFIXES.NESTED}${key}`,
          });
        } else {
          items.push({
            label: key,
            kind: COMPLETION_KINDS.PROPERTY,
            insertText: key,
            documentation: `Field: ${key}`,
            sortText: `${SORT_PREFIXES.NESTED}${key}`,
          });
        }
      });
    } else if (
      isSchemaProperty(currentSchema) &&
      currentSchema.type === "array" &&
      currentSchema.items &&
      currentSchema.items.type === "object" &&
      currentSchema.items.properties
    ) {
      Object.keys(currentSchema.items.properties).forEach((key) => {
        const prop = currentSchema.items!.properties![key];
        if (isSchemaProperty(prop)) {
          items.push({
            label: key,
            kind: COMPLETION_KINDS.PROPERTY,
            insertText: key,
            documentation: `${prop.description || key} (${prop.type}) - from array item`,
            sortText: `${SORT_PREFIXES.NESTED}${key}`,
          });
        } else {
          items.push({
            label: key,
            kind: COMPLETION_KINDS.PROPERTY,
            insertText: key,
            documentation: `Field: ${key} - from array item`,
            sortText: `${SORT_PREFIXES.NESTED}${key}`,
          });
        }
      });
    }

    return items;
  };

  const handleBeforeMount = (monaco: Monaco) => {
    cleanup();

    monaco.languages.register({ id: "go-template" });

    monaco.languages.setMonarchTokensProvider("go-template", {
      tokenizer: {
        root: [
          [/\{\{\/\*/, "comment", "@comment"],
          [/\{\{-/, "template-tag", "@template"],
          [/\{\{/, "template-tag", "@template"],
          [/./, "text"],
        ],

        template: [
          [/\/\*/, "comment", "@comment"],
          [/-\}\}/, "template-tag", "@pop"],
          [/\}\}/, "template-tag", "@pop"],
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, "string", "@string"],
          [
            /\b(if|else|end|with|range|template|define|block|include|not|and|or|eq|ne|lt|le|gt|ge|len|index|slice|printf|print|println)\b/,
            "keyword",
          ],
          [/\.[a-zA-Z_][a-zA-Z0-9_]*/, "variable"],
          [/\$[a-zA-Z_][a-zA-Z0-9_]*/, "variable"],
          [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
          [/\d+/, "number"],
          [/[|:]/, "operator"],
          [/[a-zA-Z_][a-zA-Z0-9_]*/, "function"],
          [/\s+/, "white"],
        ],

        comment: [
          [/\*\//, "comment", "@pop"],
          [/./, "comment"],
        ],

        string: [
          [/[^\\"]+/, "string"],
          [/\\./, "string.escape"],
          [/"/, "string", "@pop"],
        ],
      },
    });

    providersRef.current.completionProvider =
      monaco.languages.registerCompletionItemProvider("go-template", {
        triggerCharacters: [".", " "],
        provideCompletionItems: (model: any, position: any) => {
          try {
            const textUntilPosition = model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            });

            const lastOpenBrace = Math.max(
              textUntilPosition.lastIndexOf("{{"),
              textUntilPosition.lastIndexOf("{{-")
            );
            const lastCloseBrace = Math.max(
              textUntilPosition.lastIndexOf("}}"),
              textUntilPosition.lastIndexOf("-}}")
            );
            const insideTemplate =
              lastOpenBrace > lastCloseBrace && lastOpenBrace !== -1;

            if (!insideTemplate) {
              return { suggestions: [] };
            }

            const fullText = model.getValue();
            const currentPosition = model.getOffsetAt(position);
            const textBeforePosition = fullText.substring(0, currentPosition);

            const rangeMatches = [
              ...textBeforePosition.matchAll(
                /\{\{-?\s*range\s+([^}]+)\s*-?\}\}/g
              ),
            ];
            const endMatches = [
              ...textBeforePosition.matchAll(/\{\{-?\s*end\s*-?\}\}/g),
            ];

            let activeRangeField: string | null = null;
            let rangeVariable: string | null = null;
            if (rangeMatches.length > endMatches.length) {
              const lastRange = rangeMatches.at(-1);
              if (lastRange?.[1]) {
                const rangeField = lastRange[1].trim();

                const patterns = [
                  REGEX_PATTERNS.RANGE_ASSIGNMENT,
                  REGEX_PATTERNS.FIELD_PATH,
                ];

                for (const pattern of patterns) {
                  const match = rangeField.match(pattern);
                  if (match) {
                    if (pattern.source.includes(":=")) {
                      rangeVariable = match[1] || null;
                      activeRangeField = match[2] || null;
                    } else {
                      activeRangeField = match[1] || null;
                    }
                    break;
                  }
                }
              }
            }

            const templateFunctions: CompletionItem[] =
              GO_TEMPLATE_KEYWORDS.map((keyword) => ({
                label: keyword,
                kind: COMPLETION_KINDS.KEYWORD,
                insertText: keyword,
                documentation: `Go template keyword: ${keyword}`,
                sortText: `${SORT_PREFIXES.KEYWORD}${keyword}`,
              }));

            const snippetCompletions: CompletionItem[] =
              Object.values(COMPLETION_SNIPPETS);

            const sprigFunctions: CompletionItem[] = enableSprig
              ? SPRIG_FUNCTIONS.map((fn) => ({
                  label: fn,
                  kind: COMPLETION_KINDS.FUNCTION,
                  insertText: fn,
                  documentation: `Sprig function: ${fn}`,
                  sortText: `${SORT_PREFIXES.SPRIG}${fn}`,
                }))
              : [];

            const baseCompletionItems: CompletionItem[] = [
              ...templateFunctions,
              ...snippetCompletions,
              ...sprigFunctions,
            ];
            let allCompletions: CompletionItem[] = [...baseCompletionItems];

            if (schema) {
              const schemaCompletions = generateSmartCompletions(
                schema,
                activeRangeField,
                rangeVariable
              );
              allCompletions = [...allCompletions, ...schemaCompletions];
            }

            const wordStart = textUntilPosition.lastIndexOf(" ") + 1;
            const templateStartNormal = textUntilPosition.lastIndexOf("{{");
            const templateStartTrim = textUntilPosition.lastIndexOf("{{-");
            const templateStart =
              Math.max(templateStartNormal, templateStartTrim) +
              (templateStartTrim > templateStartNormal ? 3 : 2);
            const actualStart = Math.max(wordStart, templateStart);
            const currentWord = textUntilPosition.substring(actualStart);
            const currentWordTrimmed = currentWord.trim();

            let dotMatches = currentWordTrimmed.match(
              REGEX_PATTERNS.NESTED_DOT
            );
            if (!dotMatches) {
              const beforeCursor = textUntilPosition.substring(
                Math.max(templateStart, 0)
              );
              dotMatches =
                beforeCursor.match(REGEX_PATTERNS.NESTED_DOT) ||
                beforeCursor.match(REGEX_PATTERNS.NESTED_VAR) ||
                beforeCursor.match(REGEX_PATTERNS.VAR_DOT) ||
                beforeCursor.match(REGEX_PATTERNS.NESTED_GENERAL);
            }

            const varDotMatch = textUntilPosition.match(REGEX_PATTERNS.VAR_DOT);
            const isVarDot =
              varDotMatch &&
              textUntilPosition.endsWith(".") &&
              schema &&
              activeRangeField &&
              rangeVariable;

            const isNestedField =
              (dotMatches && textUntilPosition.endsWith(".") && schema) ||
              isVarDot;

            const justTypedDot =
              currentWordTrimmed.endsWith(".") ||
              textUntilPosition.endsWith(".");
            const justTypedSpace = textUntilPosition.endsWith(" ");
            let wordForFiltering = currentWordTrimmed;
            if (justTypedDot) {
              wordForFiltering = currentWordTrimmed.slice(0, -1);
            }

            if ((justTypedDot && activeRangeField) || isVarDot) {
              console.log("Go Template Debug:", {
                justTypedDot,
                isVarDot,
                varDotMatch,
                activeRangeField,
                rangeVariable,
                currentWord,
                currentWordTrimmed,
                wordForFiltering,
                textUntilPosition,
                allCompletionsCount: allCompletions.length,
              });
            }

            if (isNestedField && schema) {
              let fieldPath = "";

              if (isVarDot && varDotMatch) {
                const variableName = varDotMatch[1];
                if (variableName === rangeVariable && activeRangeField) {
                  fieldPath = activeRangeField;
                }
              } else if (dotMatches?.[1]) {
                fieldPath = dotMatches[1];
              }

              if (fieldPath) {
                const nestedCompletions = getNestedFieldCompletions(
                  schema,
                  fieldPath,
                  (obj: unknown): obj is SchemaProperty =>
                    obj !== null && typeof obj === "object" && "type" in obj
                );
                allCompletions = [...allCompletions, ...nestedCompletions];
              }
            }

            const isVariableOrFieldItem = (item: CompletionItem): boolean =>
              item.label.startsWith("$") ||
              item.label.startsWith(".") ||
              item.sortText?.startsWith(SORT_PREFIXES.RANGE_VAR) ||
              item.sortText?.startsWith(SORT_PREFIXES.VAR_FIELD) ||
              item.sortText?.startsWith(SORT_PREFIXES.ROOT_FIELD) ||
              item.sortText?.startsWith(SORT_PREFIXES.CURRENT);

            const filteredCompletions = allCompletions.filter((item) => {
              if (isNestedField) {
                return item.sortText?.startsWith(SORT_PREFIXES.NESTED);
              }

              if (justTypedDot && activeRangeField) {
                return (
                  item.label.startsWith(".") ||
                  item.label.startsWith("$") ||
                  item.sortText?.startsWith(SORT_PREFIXES.RANGE_VAR) ||
                  item.sortText?.startsWith(SORT_PREFIXES.VAR_FIELD) ||
                  item.sortText?.startsWith(SORT_PREFIXES.CURRENT) ||
                  item.sortText?.startsWith(SORT_PREFIXES.ROOT_FIELD) ||
                  item.sortText?.startsWith(SORT_PREFIXES.ROOT_IN_RANGE)
                );
              }

              if (justTypedDot) {
                return isVariableOrFieldItem(item);
              }

              if (justTypedSpace) {
                return true;
              }

              if (
                activeRangeField &&
                (item.sortText?.startsWith(SORT_PREFIXES.RANGE_VAR) ||
                  item.sortText?.startsWith(SORT_PREFIXES.VAR_FIELD) ||
                  item.sortText?.startsWith(SORT_PREFIXES.CURRENT))
              ) {
                if (!wordForFiltering) {
                  return true;
                }
                const label = item.label.toLowerCase();
                const word = wordForFiltering.toLowerCase();
                return (
                  label.includes(word) || label.startsWith(word) || word === ""
                );
              }

              if (!wordForFiltering) {
                return true;
              }

              const label = item.label.toLowerCase();
              const word = wordForFiltering.toLowerCase();

              if (word.startsWith("$")) {
                return label.startsWith("$") || label.includes(word);
              }

              return (
                label.includes(word) ||
                label.startsWith(word) ||
                label
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .includes(word.replace(/[^a-zA-Z0-9]/g, ""))
              );
            });

            const createUniqueCompletions = (
              completions: CompletionItem[]
            ): CompletionItem[] => {
              const seen = new Set<string>();
              return completions.filter((item) => {
                const key = `${item.label}:${item.insertText}`;
                if (seen.has(key)) {
                  return false;
                }
                seen.add(key);
                return true;
              });
            };

            const uniqueFilteredCompletions =
              createUniqueCompletions(filteredCompletions);

            const getCategoryFromSortText = (sortText: string): string => {
              if (sortText.startsWith(SORT_PREFIXES.RANGE_VAR)) return "var";
              if (sortText.startsWith(SORT_PREFIXES.NESTED)) return "nested";
              if (sortText.startsWith(SORT_PREFIXES.CURRENT)) return "current";
              if (sortText.startsWith(SORT_PREFIXES.VAR_FIELD))
                return "range_var";
              if (sortText.startsWith(SORT_PREFIXES.ROOT_FIELD)) return "field";
              if (sortText.startsWith(SORT_PREFIXES.RANGE_OP))
                return "range_op";
              if (sortText.startsWith(SORT_PREFIXES.WITH_OP)) return "with_op";
              if (sortText.startsWith(SORT_PREFIXES.ROOT_IN_RANGE))
                return "root";
              if (sortText.startsWith(SORT_PREFIXES.KEYWORD)) return "keyword";
              if (sortText.startsWith(SORT_PREFIXES.SPRIG)) return "sprig";
              return "other";
            };

            const getSearchText = (): string => {
              if (isNestedField) {
                return currentWord.split(".").pop() || "";
              }
              if (justTypedDot) {
                const afterDot = currentWord.replace(/.*\./, "");
                return afterDot === "" && activeRangeField ? "." : afterDot;
              }
              if (justTypedSpace) {
                return "";
              }
              if (wordForFiltering.startsWith(".")) {
                return wordForFiltering.slice(1);
              }
              return wordForFiltering;
            };

            const searchText = getSearchText();

            const dynamicallySortedCompletions = uniqueFilteredCompletions
              .map((item: CompletionItem) => ({
                ...item,
                sortText: generateDynamicSortText(
                  item,
                  searchText,
                  getCategoryFromSortText(item.sortText)
                ),
              }))
              .sort((a: CompletionItem, b: CompletionItem) =>
                a.sortText.localeCompare(b.sortText)
              );

            return {
              suggestions: dynamicallySortedCompletions.map(
                (item: CompletionItem) => {
                  let insertText = item.insertText;
                  let startColumn = actualStart;

                  const templateContent =
                    textUntilPosition.substring(templateStart);

                  if (isNestedField) {
                    startColumn = position.column;
                  } else if (justTypedDot && item.insertText.startsWith(".")) {
                    insertText = item.insertText.slice(1);
                    startColumn = position.column;
                  } else if (justTypedDot) {
                    startColumn = position.column;
                  } else if (justTypedSpace) {
                    insertText = `${item.insertText} `;
                    startColumn = position.column;
                  } else {
                    const wordMatch = templateContent.match(
                      REGEX_PATTERNS.WORD_WITH_SPACES
                    );
                    if (wordMatch) {
                      const [, leadingSpaces, currentWordInTemplate] =
                        wordMatch;
                      if (currentWordInTemplate) {
                        startColumn =
                          templateStart +
                          templateContent.length -
                          currentWordInTemplate.length;
                      } else if (leadingSpaces) {
                        startColumn = position.column;
                      }
                    }
                  }

                  return {
                    ...item,
                    insertText,
                    range: {
                      startLineNumber: position.lineNumber,
                      endLineNumber: position.lineNumber,
                      startColumn,
                      endColumn: position.column,
                    },
                  };
                }
              ),
            };
          } catch (error) {
            console.error("Go template completion error:", error);
            return { suggestions: [] };
          }
        },
      });

    providersRef.current.semanticTokensProvider =
      monaco.languages.registerDocumentSemanticTokensProvider("go-template", {
        getLegend: () => ({
          tokenTypes: ["variable", "function", "keyword", "string", "number"],
          tokenModifiers: [],
        }),
        provideDocumentSemanticTokens: (model: any) => {
          const tokens: number[] = [];
          const text = model.getValue();
          const lines = text.split("\n");

          lines.forEach((line: any, lineIndex: any) => {
            const templateMatches = [...line.matchAll(/\{\{([^}]+)\}\}/g)];
            templateMatches.forEach((match) => {
              if (match.index !== undefined && match[1]) {
                const content = match[1].trim();
                const startCol = match.index + 2;
                const length = content.length;

                if (content.startsWith(".") || content.startsWith("$")) {
                  tokens.push(lineIndex, startCol, length, 0, 0);
                }
              }
            });
          });

          return { data: new Uint32Array(tokens) };
        },
        releaseDocumentSemanticTokens: () => {
          /* no-op */
        },
      });

    monaco.editor.defineTheme("transparentTheme", {
      base: DraculaTheme.base as "vs" | "vs-dark" | "hc-black",
      inherit: DraculaTheme.inherit,
      rules: [
        ...DraculaTheme.rules,
        { token: "template-tag", foreground: "FFB86C", fontStyle: "bold" },
        { token: "template-keyword", foreground: "BD93F9", fontStyle: "bold" },
        { token: "template-string", foreground: "F1FA8C" },
        { token: "template-function", foreground: "50FA7B" },
        { token: "template-variable", foreground: "F8F8F2" },
        { token: "keyword", foreground: "FF79C6" },
      ],
      colors: {
        ...DraculaTheme.colors,
        "editor.background": "#00000000",
      },
    });
  };

  return (
    <MonacoEditor
      description={
        enableSprig
          ? t(
              "editor.goTemplateDescriptionSprig",
              "Go text/template syntax with Sprig functions"
            )
          : t("editor.goTemplateDescription", "Go text/template syntax")
      }
      title={t("editor.goTemplateTitle", "Go Template Editor")}
      {...props}
      beforeMount={handleBeforeMount}
      language="go-template"
      placeholder={t(
        "editor.goTemplatePlaceholder",
        "Enter your Go template here..."
      )}
    />
  );
}
