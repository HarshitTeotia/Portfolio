/** Raw anchors and images need the prefix; next/link adds it automatically. */
export function assetPath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
