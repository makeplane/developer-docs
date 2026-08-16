/**
 * Single source of truth for the Plane versions quoted in the self-hosting docs.
 *
 * Bump these when a new release ships. Every install page references them through
 * `%%TOKEN%%` placeholders (see `planeVersionTokens` below and the markdown-it rule in
 * `config.mts`), so a change here updates all pages at once — including code blocks.
 *
 * - `commercial`  → Plane Commercial Edition and Airgapped Edition (same codebase/version series)
 * - `community`   → Plane Community Edition (github.com/makeplane/plane releases)
 * - `helmEnterprise` / `helmCe` → Helm chart versions for `plane-enterprise` and `plane-ce`
 */
export const planeVersions = {
  commercial: "v3.1.0",
  community: "v1.4.1",
  helmEnterprise: "3.2.0",
  helmCe: "1.6.2",
} as const;

/** Placeholder → value. Placeholders can be used in prose, inline code and fenced code blocks. */
export const planeVersionTokens: Record<string, string> = {
  "%%COMMERCIAL_VERSION%%": planeVersions.commercial,
  "%%CE_VERSION%%": planeVersions.community,
  "%%HELM_EE_VERSION%%": planeVersions.helmEnterprise,
  "%%HELM_CE_VERSION%%": planeVersions.helmCe,
};

export function replacePlaneVersionTokens(input: string): string {
  if (typeof input !== "string" || !input.includes("%%")) return input;
  let out = input;
  for (const [token, value] of Object.entries(planeVersionTokens)) {
    out = out.split(token).join(value);
    // Markdown post-processors (e.g. the llms.txt generator) may escape underscores.
    out = out.split(token.replace(/_/g, "\\_")).join(value);
  }
  return out;
}
