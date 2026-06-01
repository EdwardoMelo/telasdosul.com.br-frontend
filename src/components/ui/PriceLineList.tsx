import React from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LinhaPrecoInput } from "@/models/LinhaPreco";
import { FONT_BODY } from "@/theme/typography";

export interface LinhaPrecoFormRow {
  valor: string;
  preco: string;
  rotulo: string;
}

interface PriceLineListProps {
  linhas: LinhaPrecoFormRow[];
  onChange: (linhas: LinhaPrecoFormRow[]) => void;
  unidadeMetrica?: string;
  metricaLabel?: string;
}

const emptyRow = (): LinhaPrecoFormRow => ({
  valor: "",
  preco: "",
  rotulo: "",
});

export function linhaFormToInput(
  row: LinhaPrecoFormRow,
  index: number
): LinhaPrecoInput {
  return {
    valor: parseFloat(row.valor),
    preco: parseFloat(row.preco),
    rotulo: row.rotulo.trim() || null,
    ordem: index,
    ativo: true,
  };
}

export function linhasFromDto(
  linhas: { valor: number; preco: number; rotulo?: string | null }[]
): LinhaPrecoFormRow[] {
  return linhas.map((l) => ({
    valor: String(l.valor),
    preco: String(l.preco),
    rotulo: l.rotulo ?? "",
  }));
}

const PriceLineList = ({
  linhas,
  onChange,
  unidadeMetrica = "m",
  metricaLabel = "métrica",
}: PriceLineListProps) => {
  const updateRow = (index: number, field: keyof LinhaPrecoFormRow, value: string) => {
    const next = [...linhas];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const removeRow = (index: number) => {
    onChange(linhas.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...linhas, emptyRow()]);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5 }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontFamily: FONT_BODY, fontWeight: 600 }}>
            Linhas de preço
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: FONT_BODY }}>
            Valor da {metricaLabel} ({unidadeMetrica}) e preço correspondente
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addRow}
          sx={{ textTransform: "none" }}
        >
          Adicionar
        </Button>
      </Stack>

      {linhas.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontFamily: FONT_BODY }}>
          Nenhuma linha cadastrada. Adicione ao menos uma combinação valor/preço.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {linhas.map((linha, index) => (
            <Stack
              key={index}
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ sm: "flex-start" }}
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "grey.50",
              }}
            >
              <TextField
                size="small"
                label={`Valor (${unidadeMetrica})`}
                type="number"
                value={linha.valor}
                onChange={(e) => updateRow(index, "valor", e.target.value)}
                inputProps={{ step: "0.01", min: 0 }}
                sx={{ flex: 1, minWidth: 100 }}
              />
              <TextField
                size="small"
                label="Preço (R$)"
                type="number"
                value={linha.preco}
                onChange={(e) => updateRow(index, "preco", e.target.value)}
                inputProps={{ step: "0.01", min: 0 }}
                sx={{ flex: 1, minWidth: 100 }}
              />
              <TextField
                size="small"
                label="Rótulo (opcional)"
                value={linha.rotulo}
                onChange={(e) => updateRow(index, "rotulo", e.target.value)}
                placeholder="Ex: 10m altura"
                sx={{ flex: 1.5, minWidth: 140 }}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => removeRow(index)}
                aria-label="Remover linha"
                sx={{ mt: { sm: 0.5 } }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default PriceLineList;
