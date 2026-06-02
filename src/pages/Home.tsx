import React from "react";
import { Box } from "@mui/material";
import Products from "./Products";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import HomeContactSection from "@/components/home/HomeContactSection";
import { usePageSeo } from "@/hooks/usePageSeo";

const HOME_SEO = {
  title: "Telas do Sul | Telas, Arames e Gradis — Fornecedora RS",
  description:
    "Fornecedora de telas soldadas, arames farpados, gradis e acessórios para cercamento no Rio Grande do Sul. Orçamento rápido e atendimento especializado.",
};

const Home = () => {
  usePageSeo(HOME_SEO);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <HeroSection />
      <Box sx={{ width: "100%" }}>
        <Products />
      </Box>
      <AboutSection />
      <HomeContactSection />
    </Box>
  );
};

export default Home;
