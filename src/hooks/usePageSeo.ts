import { useEffect } from "react";

interface PageSeoOptions {
  title: string;
  description: string;
}

const DEFAULT_TITLE = "Telas do Sul";
const DEFAULT_DESCRIPTION =
  "Fornecedora de telas, arames, gradis e acessórios para cercamento no Rio Grande do Sul.";

export function usePageSeo({ title, description }: PageSeoOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? DEFAULT_DESCRIPTION;

    document.title = title;
    if (meta) {
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;
      if (meta) {
        meta.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}
