type ClassValue = string | number | null | false | undefined;

/** Minimal class-name joiner — avoids pulling in clsx for this small a need. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
