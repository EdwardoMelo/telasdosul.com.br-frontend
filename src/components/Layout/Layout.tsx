import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box, CssBaseline } from "@mui/material";
import { useNav } from "@/contexts/navContext";
import { useLocation } from "react-router-dom";
import { isProductFormRoute } from "@/utils/routes";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { navbarHeight, setNavbarHeight } = useNav();
  const location = useLocation();
  const formFocusMode = isProductFormRoute(location.pathname);

  useEffect(() => {
    if (formFocusMode) {
      setNavbarHeight(0);
    }
  }, [formFocusMode, setNavbarHeight]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      {!formFocusMode && <Navbar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginTop: formFocusMode ? 0 : `calc(${navbarHeight}px)`,
          bgcolor: formFocusMode ? "#f4f6f8" : "background.default",
        }}
      >
        {children}
      </Box>
      {!formFocusMode && <Footer />}
    </Box>
  );
};

export default Layout;
