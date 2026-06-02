import { useState } from "react";
import { sendContactForm } from "@/utils";

export type ContactFormData = {
  numero: string;
  email: string;
  mensagem: string;
};

const emptyForm: ContactFormData = {
  numero: "",
  email: "",
  mensagem: "",
};

export function useContactForm() {
  const [form, setForm] = useState<ContactFormData>(emptyForm);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertColor, setAlertColor] = useState<"success" | "error" | "info">(
    "info"
  );
  const [loading, setLoading] = useState(false);

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const showFeedBack = (msg: string, color: "success" | "error" | "info") => {
    setMessage(msg);
    setAlertColor(color);
    setSnackbarOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await sendContactForm(form);
      if (data.message === "Mensagem recebida com sucesso!") {
        showFeedBack("Mensagem enviada com sucesso!", "success");
        setForm(emptyForm);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível enviar.";
      showFeedBack(msg, "error");
      setForm(emptyForm);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    snackbarOpen,
    message,
    alertColor,
    handleChange,
    handleCloseSnackbar,
    handleSubmit,
  };
}
