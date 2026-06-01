import { add } from "date-fns";
import { api } from "./api";


import type { PrecoExibicao } from "./models/LinhaPreco";

/** Formata preço em Real (pt-BR). Retorna null se inválido ou ≤ 0 (sob consulta). */
export function formatProductPrice(preco: number): string | null {
  const value = Number(preco);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Formata objeto preco_exibicao da API para exibição em listagens. */
export function formatPrecoExibicao(
  exibicao: PrecoExibicao | null | undefined
): string | null {
  if (!exibicao) return null;

  if (exibicao.tipo === "fixo" && exibicao.valor != null) {
    return formatProductPrice(exibicao.valor);
  }

  if (exibicao.tipo === "faixa") {
    if (exibicao.valor != null) {
      return formatProductPrice(exibicao.valor);
    }
    if (exibicao.min != null && exibicao.max != null) {
      const min = formatProductPrice(exibicao.min);
      const max = formatProductPrice(exibicao.max);
      if (min && max) return `${min} – ${max}`;
    }
  }

  return null;
}

export const METRICAS_PRECO = [
  { value: "altura", label: "Altura" },
  { value: "largura", label: "Largura" },
  { value: "area", label: "Área" },
  { value: "comprimento", label: "Comprimento" },
  { value: "peso", label: "Peso" },
] as const;

export const UNIDADES_METRICA = ["m", "cm", "mm", "m²", "kg"] as const;

/** Ex.: "TELAS SOLDADAS" → "Telas Soldadas" */
export function formatCategoryLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const contactInfo = {
  phone: "+55 51 99596-0844",
  email: "telasdosul@hotmail.com",
  instagram: "/",
  facebook: "/",
  linkedin: "/",
  address: "Av. Dr Pompílio Gomes Sobrinho 22.856",
};


const sendContactForm = async (data) => {
    try {
    const response = await api.post("/contato", data);
    return response.data;
    } catch (error) {
    console.error("Error sending contact form:", error);
    throw error;
    }
}

export  {sendContactForm}

declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => boolean;
    gtag_report_conversion_solicitar?: (url?: string) => boolean;
  }
}

export function openWhatsappWithConversion(url: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag_report_conversion === 'function') {
    // gtag_report_conversion will handle navigation via callback
    window.gtag_report_conversion(url);
  } else {
    window.open(url, '_blank');
  }
}

export function openWhatsappWithConversionSolicitar(url: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag_report_conversion_solicitar === 'function') {
    window.gtag_report_conversion_solicitar(url);
  } else if (typeof window !== 'undefined' && typeof window.gtag_report_conversion === 'function') {
    // fallback to generic conversion if specific is not available
    window.gtag_report_conversion(url);
  } else {
    window.open(url, '_blank');
  }
}