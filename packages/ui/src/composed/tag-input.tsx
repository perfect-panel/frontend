import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  separator?: string;
  className?: string;
  options?: string[];
}

export function TagInput({
  value = [],
  onChange,
  placeholder,
  separator = ",",
  className,
  options = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>(value);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTags(value.map((tag) => tag.trim()).filter((tag) => tag));
  }, [value]);

  function normalizeInput(input: string) {
    return input.replace(/，/g, ",");
  }

  function addTag(tagValue?: string) {
    let tagsToAdd: string[] = [];
    let shouldKeepOpen = false;

    if (tagValue) {
      if (!tags.includes(tagValue)) {
        tagsToAdd = [tagValue];
        shouldKeepOpen = true;
      }
    } else if (inputValue.trim()) {
      const normalizedInput = normalizeInput(inputValue);
      tagsToAdd = normalizedInput
        .split(separator)
        .map((tag) => tag.trim())
        .filter((tag) => tag && !tags.includes(tag));
    }

    if (tagsToAdd.length > 0) {
      const updatedTags = [...tags, ...tagsToAdd];
      updateTags(updatedTags);
    }
    setInputValue("");

    if (shouldKeepOpen && options.length > 0) {
      setTimeout(() => {
        setOpen(true);
      }, 10);
    } else {
      setOpen(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (
      event.key === "Enter" ||
      event.key === separator ||
      event.key === "，"
    ) {
      event.preventDefault();
      addTag();
    } else if (event.key === "Backspace" && inputValue === "") {
      event.preventDefault();
      handleRemoveTag(tags.length - 1);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  function handleInputFocus() {
    if (options.length > 0) {
      setOpen(true);
    }
  }

  function handleInputBlur() {
    if (inputValue.trim()) addTag();
    setOpen(false);
  }

  function handleRemoveTag(index: number) {
    const newTags = tags.filter((_, i) => i !== index);
    updateTags(newTags);
  }

  function updateTags(newTags: string[]) {
    setTags(newTags);
    onChange?.(newTags);
  }

  const availableOptions = options
    .filter((option) => !tags.includes(option))
    .filter(
      (option) =>
        inputValue.trim() === "" ||
        option.toLowerCase().includes(inputValue.toLowerCase())
    );

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex min-h-9 w-full cursor-text flex-wrap items-center gap-2 rounded-md border border-input bg-transparent p-2 shadow-sm transition-colors focus-within:ring-0 focus-within:ring-primary"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, index) => (
          <Badge
            className="flex items-center gap-1 border-primary bg-primary/10 px-1"
            key={tag}
            onClick={(e) => e.stopPropagation()}
            variant="outline"
          >
            {tag}
            <button
              className="ml-1 inline-flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveTag(index);
              }}
              onMouseDown={(e) => e.preventDefault()}
              type="button"
            >
              <X className="size-4 cursor-pointer rounded-sm hover:text-destructive" />
            </button>
          </Badge>
        ))}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Input
            className="!ring-0 h-full min-w-0 flex-1 border-none bg-transparent p-0 shadow-none"
            onBlur={handleInputBlur}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            ref={inputRef}
            value={inputValue}
          />

          {open && availableOptions.length > 0 && (
            <div className="absolute top-full left-0 z-50 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
              {availableOptions.map((option) => (
                <div
                  className="relative flex cursor-pointer select-none items-center px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                  key={option}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTag(option);
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 10);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TagInput;
