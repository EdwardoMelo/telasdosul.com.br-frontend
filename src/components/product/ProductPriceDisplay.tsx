import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { LinhaPrecoDTO } from "@/models/LinhaPreco";
import { TipoPrecoProduto } from "@/models/LinhaPreco";
import { formatCategoryLabel, formatProductPrice } from "@/utils";
import { FONT_BODY, FONT_DISPLAY } from "@/theme/typography";

interface ProductPriceDisplayProps {
  tipoPreco: TipoPrecoProduto;
  preco?: number | null;
  linhasPreco?: LinhaPrecoDTO[];
  metrica?: string | null;
  onLinhaChange?: (linha: LinhaPrecoDTO | null) => void;
}

const ProductPriceDisplay = ({
  tipoPreco,
  preco,
  linhasPreco = [],
  metrica,
  onLinhaChange,
}: ProductPriceDisplayProps) => {
  const linhasAtivas = useMemo(
    () =>
      [...linhasPreco]
        .filter((l) => l.ativo !== false)
        .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.valor - b.valor),
    [linhasPreco]
  );

  const [selectedId, setSelectedId] = useState<number | null>(
    linhasAtivas[0]?.id ?? null
  );

  useEffect(() => {
    if (linhasAtivas.length === 0) {
      setSelectedId(null);
      return;
    }
    const stillValid = linhasAtivas.some((l) => l.id === selectedId);
    if (!stillValid) {
      setSelectedId(linhasAtivas[0].id);
    }
  }, [linhasAtivas, selectedId]);

  const selectedLinha = linhasAtivas.find((l) => l.id === selectedId) ?? null;

  useEffect(() => {
    onLinhaChange?.(selectedLinha);
  }, [selectedLinha, onLinhaChange]);

  const precoFixoFormatado = formatProductPrice(Number(preco ?? 0));

  if (tipoPreco === "POR_METRICA" && linhasAtivas.length > 0) {
    const precoSelecionado = formatProductPrice(selectedLinha?.preco ?? 0);
    const metricaLabel = metrica
      ? formatCategoryLabel(metrica)
      : "Opção";

    return (
      <Box>
        <Typography
          component="p"
          sx={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            lineHeight: 1.2,
            color: "primary.main",
            letterSpacing: "-0.02em",
          }}
        >
          {precoSelecionado ?? "Preço sob consulta"}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontFamily: FONT_BODY, fontSize: 11, display: "block", mt: 0.5 }}
        >
          Preço para a {metricaLabel.toLowerCase()} selecionada
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.5 }}>
          {linhasAtivas.map((linha) => {
            const isSelected = linha.id === selectedId;
            const label =
              linha.rotulo_exibicao ??
              `${linha.valor}${linha.rotulo ? "" : ""}`;

            return (
              <Chip
                key={linha.id}
                label={label}
                onClick={() => setSelectedId(linha.id)}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  ...(isSelected
                    ? {
                        bgcolor: "primary.main",
                        color: "#fff",
                        borderColor: "primary.main",
                        boxShadow: "0 2px 8px rgba(0, 32, 74, 0.25)",
                      }
                    : {
                        borderColor: "divider",
                        color: "text.secondary",
                        "&:hover": {
                          borderColor: "primary.light",
                          bgcolor: "rgba(0, 32, 74, 0.04)",
                        },
                      }),
                }}
              />
            );
          })}
        </Stack>
      </Box>
    );
  }

  if (precoFixoFormatado) {
    return (
      <Box>
        <Typography
          component="p"
          sx={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            lineHeight: 1.2,
            color: "primary.main",
            letterSpacing: "-0.02em",
          }}
        >
          {precoFixoFormatado}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontFamily: FONT_BODY, fontSize: 11 }}
        >
          Preço de referência · sujeito a orçamento
        </Typography>
      </Box>
    );
  }

  return (
    <Typography
      variant="body2"
      sx={{
        fontFamily: FONT_BODY,
        fontWeight: 500,
        color: "text.secondary",
        fontSize: 14,
      }}
    >
      Preço sob consulta
    </Typography>
  );
};

export default ProductPriceDisplay;
