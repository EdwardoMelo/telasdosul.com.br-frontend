export interface DescriptionSection {
  title: string;
  body: string;
}

export interface ParsedProductDescription {
  intro: string;
  sections: DescriptionSection[];
}

const SECTION_HEADER =
  /^(BENEF[ÍI]CIOS|APLICA[ÇC][ÕO]ES|VANTAGENS|ESPECIFICA[ÇC][ÕO]ES|CARACTER[ÍI]STICAS)/i;

const isSectionHeader = (line: string): boolean => {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (SECTION_HEADER.test(trimmed)) return true;
  return (
    trimmed.length <= 80 &&
    trimmed === trimmed.toUpperCase() &&
    /[A-ZÁÉÍÓÚÃÕÇ]/.test(trimmed)
  );
};

export function parseProductDescription(text: string): ParsedProductDescription {
  const normalized = text?.trim() ?? "";
  if (!normalized) {
    return { intro: "", sections: [] };
  }

  const lines = normalized.split(/\r?\n/);
  const introLines: string[] = [];
  const sections: DescriptionSection[] = [];
  let current: DescriptionSection | null = null;

  for (const line of lines) {
    if (isSectionHeader(line)) {
      if (current?.body.trim() || current?.title) {
        sections.push({
          title: current.title,
          body: current.body.trim(),
        });
      }
      current = { title: line.trim(), body: "" };
      continue;
    }

    if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      introLines.push(line);
    }
  }

  if (current && (current.body.trim() || current.title)) {
    sections.push({ title: current.title, body: current.body.trim() });
  }

  return {
    intro: introLines.join("\n").trim(),
    sections,
  };
}

export function truncateAtWord(text: string, maxChars: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;

  const slice = trimmed.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > maxChars * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trim()}…`;
}

export function hasExpandableContent(parsed: ParsedProductDescription): boolean {
  const introNeedsTruncate = parsed.intro.length > INTRO_PREVIEW_CHARS;
  const hasSections = parsed.sections.some((s) => s.body.trim().length > 0);
  return introNeedsTruncate || hasSections;
}

export const INTRO_PREVIEW_CHARS = 280;
