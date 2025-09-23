import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import { Categoria } from "@/models/Categoria";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


interface props{ 
  visible : boolean
}


const CategoryNavbar = ({visible} : props) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    Categoria.getAll()
      .then(setCategorias)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          display: visible ? "flex" : "none",
          transition: "all 0.3 ease-in-out",
          justifyContent: "center",
          py: 3,
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        masHeight: 30,
        padding: 2,
        display: visible ? "flex" : "none",
        transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
        justifyContent: { 
          xs: 'start',
          sm :'center'
        },
        overflowX: 'auto',
        alignItems: "center",
        bgcolor: 'primary.main'
      }}
    >
       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        style={{display: 'flex'}}
      >
        {categorias.map((categoria) => (
        <Box
          onClick={() => navigate(`/produtos?categoria=${categoria.id}`)}
          key={categoria.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 120,
            px: 2,
            cursor: "pointer",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.08)", color: "primary.main" },
          }}
        >
          {/* Futuro campo de imagem da categoria */}
          {categoria.imagem && (
            <Box sx={{ mb: 1 }}>
              <img
                src={categoria.imagem}
                alt={categoria.nome}
                style={{ width: 30, height: 30 }}
              />
            </Box>
          )}

          <Typography
            align="center"
            sx={{
              color: "white",
              fontWeight: 500,
              fontSize: "normal",
              fonWeight: 'bold',
              fontFamily: "Poppins",
              textTransform: 'capitalize'
            }}
          >
            {categoria.nome.toLowerCase()}
          </Typography>
        </Box>
      ))}
      </motion.div> 
    </Box>
  );
};

export default CategoryNavbar;
