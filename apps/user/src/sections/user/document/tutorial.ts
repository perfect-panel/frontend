import yaml from "js-yaml";
import { CDN_URL } from "@/config";

// Tutorial content lives in perfect-panel/ppanel-tutorial. To enable, set
// VITE_CDN_URL to a jsDelivr-compatible mirror (e.g. https://cdn.jsdmirror.com)
// or your own self-hosted base. When VITE_CDN_URL is empty, all tutorial
// fetches return empty results and no network call is made.
const BASE_URL = CDN_URL ? `${CDN_URL}/gh/perfect-panel/ppanel-tutorial` : "";

async function getVersionPath() {
  return `${BASE_URL}@latest`;
}

export async function getTutorial(path: string): Promise<{
  config?: Record<string, unknown>;
  content: string;
}> {
  if (!BASE_URL) {
    return { config: {}, content: "" };
  }
  const versionPath = await getVersionPath();
  try {
    const url = `${versionPath}/${path}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const match = text.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
    let data: Record<string, unknown> = {};
    let content = text;

    if (match) {
      try {
        data = (yaml.load(match[1] || "") as Record<string, unknown>) || {};
        content = match[2] || "";
      } catch (e) {
        console.error("Error parsing YAML frontmatter:", e);
      }
    }

    const markdown = addPrefixToImageUrls(content, getUrlPrefix(url));
    return {
      config: data,
      content: markdown,
    };
  } catch (error) {
    console.error("Error fetching the markdown file:", error);
    throw error;
  }
}

type TutorialItem = {
  title: string;
  path: string;
  subItems?: TutorialItem[];
};

const processIcon = (item: TutorialItem) => {
  if (
    "icon" in item &&
    typeof item.icon === "string" &&
    !item.icon.startsWith("http")
  ) {
    item.icon = `${BASE_URL}/${item.icon}`;
  }
};

export async function getTutorialList() {
  if (!BASE_URL) {
    return new Map<string, TutorialItem[]>();
  }
  const { config, content } = await getTutorial("SUMMARY.md");
  const navigation = config as Record<string, TutorialItem[]> | undefined;

  if (!navigation) {
    return parseTutorialToMap(content);
  }

  Object.values(navigation)
    .flat()
    .forEach((item) => {
      item.subItems?.forEach(processIcon);
    });

  return new Map(Object.entries(navigation));
}

function parseTutorialToMap(markdown: string): Map<string, TutorialItem[]> {
  const map = new Map<string, TutorialItem[]>();
  let currentSection = "";
  const lines = markdown.split("\n");

  for (const line of lines) {
    if (line.startsWith("## ")) {
      currentSection = line.replace("## ", "").trim();
      map.set(currentSection, []);
    } else if (line.startsWith("* ")) {
      const [, text, link] = line.match(/\* \[(.*?)\]\((.*?)\)/) || [];
      if (text && link) {
        if (!map.has(currentSection)) {
          map.set(currentSection, []);
        }
        map.get(currentSection)!.push({ title: text, path: link });
      }
    } else if (line.startsWith("  * ")) {
      const [, text, link] = line.match(/\* \[(.*?)\]\((.*?)\)/) || [];
      if (text && link) {
        const lastItem = map.get(currentSection)?.slice(-1)[0];
        if (lastItem) {
          if (!lastItem.subItems) {
            lastItem.subItems = [];
          }
          lastItem.subItems.push({ title: text, path: link });
        }
      }
    }
  }

  return map;
}
function getUrlPrefix(url: string): string {
  return url.replace(/\/[^/]+\.md$/, "/");
}
function addPrefixToImageUrls(markdown: string, prefix: string): string {
  return markdown.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    (_match, imgAlt, imgUrl) =>
      `![${imgAlt}](${imgUrl.startsWith("http") ? imgUrl : `${prefix}${imgUrl}`})`
  );
}
