import React, { useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { formatCategoryLabel } from "@/utils";
import { FONT_BODY, FONT_DISPLAY } from "@/theme/typography";
import {
  hasExpandableContent,
  INTRO_PREVIEW_CHARS,
  parseProductDescription,
  truncateAtWord,
} from "@/utils/productDescription";

interface ProductDescriptionProps {
  description: string;
}

const bodySx = {
  fontFamily: FONT_BODY,
  fontSize: { xs: 13, md: 14 },
  lineHeight: 1.65,
  color: "text.secondary",
  whiteSpace: "pre-line" as const,
};

const formatSectionTitle = (title: string): string => {
  return title
    .split("/")
    .map((part) => formatCategoryLabel(part.trim()))
    .join(" / ");
};

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  const [expanded, setExpanded] = useState(false);

  const parsed = useMemo(
    () => parseProductDescription(description),
    [description]
  );

  const canExpand = hasExpandableContent(parsed);
  const introPreview = truncateAtWord(parsed.intro, INTRO_PREVIEW_CHARS);

  if (!parsed.intro && parsed.sections.length === 0) {
    return (
      <Typography sx={bodySx}>
        Sem descrição disponível para este produto.
      </Typography>
    );
  }

  return (
    <Box>
      {parsed.intro && (
        <Typography component="div" sx={{ ...bodySx, mb: parsed.sections.length ? 2 : 0 }}>
          {expanded ? parsed.intro : introPreview}
        </Typography>
      )}

      {expanded &&
        parsed.sections.map((section) => (
          <Box key={section.title} sx={{ mb: 2 }}>
            {section.title && (
              <Typography
                component="h2"
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "none",
                  color: "text.primary",
                  mb: 0.75,
                }}
              >
                {formatSectionTitle(section.title)}
              </Typography>
            )}
            {section.body && (
              <Typography component="div" sx={bodySx}>
                {section.body}
              </Typography>
            )}
          </Box>
        ))}

      {canExpand && (
        <Button
          size="small"
          onClick={() => setExpanded((v) => !v)}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            mt: 0.5,
            px: 0,
            minWidth: 0,
            fontFamily: FONT_DISPLAY,
            fontWeight: 600,
            fontSize: 13,
            textTransform: "none",
            color: "primary.main",
            "&:hover": {
              bgcolor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          {expanded ? "Ver menos" : "Ver mais…"}
        </Button>
      )}
    </Box>
  );
};

export default ProductDescription;
