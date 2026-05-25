import { add } from "date-fns";
import { api } from "./api";


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