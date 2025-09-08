import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Categoria } from "../models/Categoria"; // Assuming Categoria model is in this path
import { Subcategoria, SubcategoriaDTO } from "@/models/SubCategoria";
import SubcategoriaList from "@/components/ui/SubCategoriaList";
import FirebaseService from "@/services/firebaseService";
import CloseIcon from "@mui/icons-material/Close";

const CategoriaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    nome: "",
    imagem: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [subcategorias, setSubcategorias] = useState<SubcategoriaDTO[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [alertColor, setAlertColor] = useState<"success" | "error" | "info">(
    "info"
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showFeedBack = (msg: string, color: "success" | "error" | "info") => {
    setMessage(msg);
    setAlertColor(color);
    setSnackbarOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLoading(true);
    try {
      if (formData.imagem && formData.imagem !== "") {
        await FirebaseService.delete(formData.imagem);
      }
      const fileUrl = await FirebaseService.upload(file, file.name);
      console.log("fileUrl: ", fileUrl);
      setFormData((prev) => ({ ...prev, imagem: fileUrl }));
      if (fileUrl) {
        setImagePreview(fileUrl);
        showFeedBack("Imagem da categoria alterada com sucesso!", "success");
      }
    } catch (e) {
      showFeedBack("Erro ao fazer upload da imagem", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      if (formData.imagem && formData.imagem !== "") {
        await FirebaseService.delete(formData.imagem);
      }
      setFormData((prev) => ({ ...prev, imagem: "" }));
      setImagePreview("");
      showFeedBack("Imagem removida com sucesso", "success");
    } catch (e) {
      showFeedBack("Erro ao remover imagem", "error");
    }
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const onSubcategoriasChange = (updatedSubcategorias: SubcategoriaDTO[]) => {
    setSubcategorias(updatedSubcategorias);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.nome.trim()) {
      setError("O nome da categoria é obrigatório.");
      setLoading(false);
      return;
    }
    try {
      const categoria = new Categoria({
        id: editing ? parseInt(id!) : 0,
        nome: formData.nome,
        subcategorias: [], // Subcategorias are not managed in this form directly
        imagem: formData.imagem,
      });
      console.log("categoria: ", categoria);

      if (editing) {
        await categoria.update(); //subcategorias will be crete directily rfrom the SubCategoriaList
        navigate(-1);
        return;
      }
      const cretedCategoria = await categoria.create();
      if (subcategorias.length) {
        await Subcategoria.createManyByCategoryId(
          cretedCategoria.id,
          subcategorias
        );
      }
      navigate(-1);
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      setError(
        `Erro ao ${
          editing ? "atualizar" : "criar"
        } a categoria. Verifique os dados e tente novamente.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/admin/categorias"); // Adjust if your back navigation is different
  };

  useEffect(() => {
    const fetchCategoria = async () => {
      if (id) {
        setEditing(true);
        setLoading(true);
        try {
          const categoriaData = await Categoria.getById(parseInt(id));
          setFormData({
            nome: categoriaData.nome,
            imagem: categoriaData.imagem,
          });
          if (categoriaData.imagem && categoriaData.imagem !== "") {
            setImagePreview(categoriaData.imagem);
          }
          setSubcategorias(categoriaData.subcategorias);
        } catch (err) {
          console.error("Erro ao carregar categoria:", err);
          setError(
            "Erro ao carregar as informações da categoria. Por favor, tente novamente."
          );
        } finally {
          setLoading(false);
        }
      } else {
        setEditing(false);
        setFormData({ nome: "", imagem: "" }); // Reset for new category
      }
    };

    fetchCategoria();
  }, [id]);

  if (loading && editing) {
    // Only show full page loader when fetching existing data
    return (
      <Container
        sx={{
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "primary.main" }} />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6, minHeight: "80vh", marginTop: "10vh" }}>
      <Button
        variant="text"
        startIcon={<ArrowBack />}
        onClick={handleGoBack}
        sx={{ mb: 3 }}
      >
        Voltar para categorias
      </Button>

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        {editing ? "Editar Categoria" : "Cadastrar Nova Categoria"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome da Categoria"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading && !editing} // Disable input while submitting new
            />
          </Grid>
          <Grid item xs={12}>
            <SubcategoriaList
              categoria_id={editing ? parseInt(id!) : 0}
              subcategoriasFromParent={subcategorias}
              onSubcategoriasChange={onSubcategoriasChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageChange}
                disabled={loading}
              />
              <Box
                sx={{
                  width: "100%",
                  height: 120,
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  mb: 1,
                  padding: 2,
                  position: "relative",
                  backgroundColor: "gray",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview && (
                  <img
                    src={imagePreview || formData.imagem}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      height: "100%",
                      top: 0,
                      left: 0,
                      borderRadius: 8,
                      objectFit: "contain",
                      margin: "0 auto",
                    }}
                  />
                )}
                {!imagePreview && (
                  <Typography color="white" variant="caption">
                    Clique para adicionar imagem
                  </Typography>
                )}
                {imagePreview && (
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      bgcolor: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.main" },
                color: "white",
                textTransform: "uppercase",
                py: 1.5,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : editing ? (
                "Salvar Alterações"
              ) : (
                "Cadastrar Categoria"
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CategoriaForm;