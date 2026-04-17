import { execSync } from "node:child_process";

const RELEASE_TAG_PATTERN = /^v\d+\.\d+\.\d+(?:[-+].+)?$/;

export function resolveWebVersion(gitRoot: string) {
  const explicitVersion = process.env.PPANEL_WEB_VERSION?.trim();
  if (explicitVersion) {
    return explicitVersion;
  }

  const githubTag = process.env.GITHUB_REF_TYPE === "tag"
    ? process.env.GITHUB_REF_NAME?.trim()
    : undefined;
  if (githubTag?.match(RELEASE_TAG_PATTERN)) {
    return githubTag;
  }

  try {
    const localTag = execSync("git tag --points-at HEAD --list 'v[0-9]*'", {
      cwd: gitRoot,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
      .at(-1);

    if (localTag?.match(RELEASE_TAG_PATTERN)) {
      return localTag;
    }
  } catch {
    // Fall through to commit-based versioning when tags are unavailable.
  }

  const gitSha = process.env.GITHUB_SHA?.trim();
  if (gitSha) {
    return `sha-${gitSha.slice(0, 7)}`;
  }

  try {
    const localGitSha = execSync("git rev-parse --short HEAD", {
      cwd: gitRoot,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    if (localGitSha) {
      return `sha-${localGitSha}`;
    }
  } catch {
    // Fall through to the default when git metadata is unavailable.
  }

  return "1.0.0";
}
