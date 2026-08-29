import { describe, expect, it } from "vitest";
import { getTimezoneOffset } from "./timezone-switch";

describe("timezone offset display", () => {
  const winter = new Date("2026-01-15T12:00:00Z");
  const summer = new Date("2026-07-15T12:00:00Z");

  it("does not apply the browser timezone to UTC offsets", () => {
    expect(getTimezoneOffset("UTC", winter)).toBe("UTC+00:00");
    expect(getTimezoneOffset("Asia/Singapore", winter)).toBe("UTC+08:00");
  });

  it("preserves fractional-hour timezone offsets", () => {
    expect(getTimezoneOffset("Asia/Kolkata", winter)).toBe("UTC+05:30");
  });

  it("uses the offset active on the selected date", () => {
    expect(getTimezoneOffset("America/New_York", winter)).toBe("UTC-05:00");
    expect(getTimezoneOffset("America/New_York", summer)).toBe("UTC-04:00");
  });

  it("falls back safely for invalid timezone identifiers", () => {
    expect(getTimezoneOffset("Invalid/Timezone", winter)).toBe("UTC+00:00");
  });
});
