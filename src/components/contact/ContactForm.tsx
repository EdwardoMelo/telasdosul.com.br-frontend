import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { FONT_DISPLAY } from "@/theme/typography";
import { useContactForm } from "@/hooks/useContactForm";

const heroFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: 2,
    bgcolor: "rgba(255,255,255,0.07)",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.28)",
    },
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.1)",
      "& fieldset": { borderColor: "rgba(255,255,255,0.45)" },
    },
    "&.Mui-focused": {
      bgcolor: "rgba(255,255,255,0.12)",
      boxShadow: "0 0 0 3px rgba(255, 201, 60, 0.18)",
      "& fieldset": {
        borderColor: "secondary.main",
        borderWidth: 1,
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.72)",
    "&.Mui-focused": { color: "secondary.main" },
  },
  "& .MuiFormHelperText-root": {
    color: "rgba(255,255,255,0.55)",
  },
};

type ContactFormProps = {
  variant?: "page" | "hero";
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  id?: string;
};

const ContactForm = ({
  variant = "page",
  title = "Formulário de Contato",
  subtitle,
  submitLabel = "Enviar Mensagem",
  id = "contact-form",
}: ContactFormProps) => {
  const {
    form,
    loading,
    snackbarOpen,
    message,
    alertColor,
    handleChange,
    handleCloseSnackbar,
    handleSubmit,
  } = useContactForm();

  const isHero = variant === "hero";
  const fieldProps = isHero
    ? { sx: heroFieldSx, size: "small" as const }
    : { margin: "normal" as const };

  const formBody = (
    <Box
      component="form"
      id={id}
      onSubmit={handleSubmit}
      noValidate
    >
      <Typography
        variant={isHero ? "h6" : "h5"}
        sx={{
          mb: subtitle ? 0.5 : 2.5,
          fontWeight: 700,
          fontFamily: FONT_DISPLAY,
          color: isHero ? "#fff" : "text.primary",
          letterSpacing: isHero ? "-0.02em" : undefined,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            mb: 2.5,
            color: isHero ? "rgba(255,255,255,0.78)" : "text.secondary",
            lineHeight: 1.55,
          }}
        >
          {subtitle}
        </Typography>
      )}
      <TextField
        label="Telefone / WhatsApp"
        name="numero"
        value={form.numero}
        onChange={handleChange}
        fullWidth
        required
        type="tel"
        placeholder="(51) 99999-9999"
        {...fieldProps}
      />
      <TextField
        label="E-mail"
        name="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        required
        type="email"
        sx={[
          isHero ? heroFieldSx : undefined,
          { mt: isHero ? 1.5 : undefined },
        ]}
        size={isHero ? "small" : undefined}
        margin={isHero ? undefined : "normal"}
      />
      <TextField
        label="Como podemos ajudar?"
        name="mensagem"
        value={form.mensagem}
        onChange={handleChange}
        fullWidth
        required
        multiline
        minRows={isHero ? 3 : 4}
        placeholder="Descreva o projeto, metragem ou produto de interesse…"
        sx={[
          isHero ? heroFieldSx : undefined,
          { mt: isHero ? 1.5 : undefined },
        ]}
        size={isHero ? "small" : undefined}
        margin={isHero ? undefined : "normal"}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth={isHero}
        disabled={loading}
        endIcon={
          loading ? undefined : (
            <SendOutlinedIcon sx={{ fontSize: 18 }} />
          )
        }
        sx={{
          mt: isHero ? 2.5 : 3,
          py: isHero ? 1.35 : 1,
          borderRadius: 2,
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: isHero ? "0.95rem" : undefined,
          textTransform: "none",
          letterSpacing: "0.02em",
          ...(isHero
            ? {
                background:
                  "linear-gradient(135deg, #005792 0%, #00204a 100%)",
                boxShadow: "0 8px 28px rgba(0, 32, 74, 0.45)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #006daa 0%, #003366 100%)",
                  boxShadow: "0 12px 32px rgba(0, 32, 74, 0.5)",
                },
              }
            : {
                backgroundColor: "primary.light",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                },
              }),
        }}
      >
        {loading ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          submitLabel
        )}
      </Button>
    </Box>
  );

  if (isHero) {
    return (
      <>
        <Box
          sx={{
            p: { xs: 2.5, sm: 3, md: 3.5 },
            borderRadius: { xs: 2.5, md: 3 },
            background:
              "linear-gradient(155deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.08) 100%)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: "1px solid rgba(255,255,255,0.24)",
            boxShadow:
              "0 28px 72px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255,255,255,0.2)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "12%",
              right: "12%",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,201,60,0.7), transparent)",
            },
          }}
        >
          {formBody}
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={alertColor}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      {formBody}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertColor}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactForm;
