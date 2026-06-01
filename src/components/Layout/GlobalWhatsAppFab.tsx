import { Box, IconButton } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { contactInfo, openWhatsappWithConversion } from "@/utils";
import { isProductFormRoute } from "@/utils/routes";

const GlobalWhatsAppFab = () => {
  const { pathname } = useLocation();

  if (isProductFormRoute(pathname)) {
    return null;
  }

  return (
    <Box
      sx={{
        height: 60,
        width: "100%",
        zIndex: 40,
        position: "fixed",
        bottom: 10,
        left: 0,
        backgroundColor: "transparent",
        display: "flex",
        gap: 2,
        paddingX: 10,
        justifyContent: "end",
        pointerEvents: "none",
        "& .MuiIconButton-root": { pointerEvents: "auto" },
      }}
    >
      <IconButton
        sx={{
          backgroundColor: "white",
          height: 60,
          width: 60,
          color: "white",
          boxShadow: "0 0 10px 4px #39ff14",
          "&:hover": { boxShadow: "0 0 24px 8px #39ff14" },
        }}
        onClick={() =>
          openWhatsappWithConversion(
            `https://api.whatsapp.com/send?phone=${contactInfo.phone}&text=Oi, vim pelo site,gostaria de saber mais sobre os produtos e serviços da Telas do Sul!`
          )
        }
        aria-label="WhatsApp"
      >
        <WhatsApp sx={{ color: "green" }} />
      </IconButton>
    </Box>
  );
};

export default GlobalWhatsAppFab;
