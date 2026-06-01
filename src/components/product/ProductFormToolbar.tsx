import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Stack, Typography, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import logo from "@/assets/logo.png";
import { FONT_DISPLAY } from "@/theme/typography";

interface ProductFormToolbarProps {
  title: string;
  onBack: () => void;
  submitLabel: string;
  saving?: boolean;
  formId?: string;
}

const ProductFormToolbar = ({
  title,
  onBack,
  submitLabel,
  saving = false,
  formId = "product-form",
}: ProductFormToolbarProps) => (
  <Box
    component="header"
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 1100,
      bgcolor: "background.paper",
      borderBottom: 1,
      borderColor: "divider",
      boxShadow: "0 1px 0 rgba(0, 32, 74, 0.06)",
    }}
  >
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        maxWidth: 1280,
        mx: "auto",
        px: { xs: 1.5, sm: 2 },
        py: 0.75,
        gap: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Telas do Sul"
            sx={{ height: 28, width: "auto" }}
          />
        </Box>

        <Button
          size="small"
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={onBack}
          sx={{
            minWidth: 0,
            px: 1,
            fontSize: 13,
            color: "text.secondary",
            textTransform: "none",
            flexShrink: 0,
          }}
        >
          Voltar
        </Button>

        <Typography
          component="h1"
          noWrap
          sx={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: { xs: 16, sm: 18 },
            color: "primary.main",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
      </Stack>

      <Button
        type="submit"
        form={formId}
        variant="contained"
        size="small"
        disabled={saving}
        sx={{
          flexShrink: 0,
          bgcolor: "primary.main",
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          textTransform: "none",
          px: 2,
          py: 0.6,
          fontSize: 13,
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        {saving ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          submitLabel
        )}
      </Button>
    </Stack>
  </Box>
);

export default ProductFormToolbar;
