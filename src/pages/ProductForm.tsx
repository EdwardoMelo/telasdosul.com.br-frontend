import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  SelectChangeEvent,
  IconButton,
  Snackbar,
} from "@mui/material";
import { ArrowBack, Close } from "@mui/icons-material";
import { Produto } from "../models/Produto";
import { Categoria } from "../models/Categoria";
import { Subcategoria, SubcategoriaDTO } from "../models/SubCategoria";
import { VariacaoProduto, VariacaoProdutoDTO } from "@/models/VariacaoProduto";
import VariacaoProdutoList from "@/components/ui/VariacaoProdutoList";
import FirebaseService from "@/services/firebaseService";

const ProductForm = () => {
  const navigate = useNavigate();

  const {id} = useParams();

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    marca: "",
    imagem: "",
    estoque: "",
    categoria_id: "",
    subcategoria_id: "",
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<SubcategoriaDTO[]>([]);
  const [variacoes, setVariacoes] = useState<VariacaoProdutoDTO[]>([]);
  const [editng, setEditing] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [alertColor, setAlertColor] = useState<"success" | "error" | "info">(
    "info"
  );
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const showFeedBack = (msg: string, color: "success" | "error" | "info") => {
    setMessage(msg);
    setAlertColor(color);
    setSnackbarOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

   const handleCloseSnackbar = (
      _event?: React.SyntheticEvent | Event,
      reason?: string
    ) => {
      if (reason === "clickaway") {
        return;
      }
      setSnackbarOpen(false);
    };

  //handleChangeCategoria
  const handleChangeCategoria = (e: SelectChangeEvent<string>) => {
    const newCategoria: Categoria = categorias.find(
      (cat) => cat.id === parseInt(e.target.value)
    );
    setFormData((prev) => ({ ...prev, categoria_id: e.target.value }));
    setSubcategorias(newCategoria.subcategorias || []);
  };

  const handleChangeSubcategoria = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, subcategoria_id: e.target.value }));
  }
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLoading(true);
    try{ 
      if (formData.imagem && formData.imagem !== "") {
        await FirebaseService.delete(formData.imagem);
      }
      const fileUrl = await FirebaseService.upload(file, file.name);
      setFormData((prev) => ({ ...prev, imagem: fileUrl }));
      if (fileUrl) {
        setImagePreview(fileUrl);
        showFeedBack("Imagem do produto alterada com sucesso!", "success");
        setLoading(false);
      }
    }catch(e) {
      showFeedBack('error', 'success');
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
     setLoading(true)
     try{ 
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      console.log("file: ", file)
      if (!file) {
        console.log("sem arquivo")
        return;
      }
      if (formData.imagem && formData.imagem !== "") {
        await FirebaseService.delete(formData.imagem);
      }
      const fileUrl = await FirebaseService.upload(file, file.name);
      setFormData((prev) => ({ ...prev, imagem: fileUrl }));
      if (fileUrl) {
        setLoading(false);
        setImagePreview(fileUrl);
        showFeedBack('Imagem do produto alterada com sucesso!', 'success')
      }
     }catch(e: any) { 
        setLoading(false)
        showFeedBack(`${e.message}`, 'error');
     }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      if (formData.imagem && formData.imagem !== "") {
        const fileUrl = await FirebaseService.getFile(formData.imagem);
        if(fileUrl){ 
          await FirebaseService.delete(fileUrl);
        }
      }
      setFormData((prev) => ({ ...prev, imagem: "" }));
      setImagePreview("");
      showFeedBack('Imagem do produto removida com sucesso', 'success');
    } catch (e: any) {
      showFeedBack(`Erro ao remover imagem: ${error}`, "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const produto = new Produto({
        id: 0,
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        marca: formData.marca,
        imagem: formData.imagem,
        estoque: parseInt(formData.estoque),
        categoria_id: parseInt(formData.categoria_id),
        subcategoria_id: parseInt(formData.subcategoria_id),
      });
      if(editng){ 
        produto.id = parseInt(id);
        const updatedProduto = await produto.update();
        navigate(`/produtos/${updatedProduto.id}`);
        return;
      }
      const createdProduto = await produto.create();
      if(variacoes.length) {
       await VariacaoProduto.createManyByProductId(
        createdProduto.id,
        variacoes
       );
      }
      navigate(`/produtos/${createdProduto.id}`);
    } catch (err) {
      console.error("Erro ao criar produto:", err);
      setError(
        "Erro ao criar o produto. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    } 
  };

  const handleGoBack = () => {
     navigate("/produtos");
  };

    
  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriasData = await Categoria.getAll();
        setCategorias(categoriasData);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
        setError("Erro ao carregar categorias e subcategorias.");
      }
    };
    fetchInitialData();
  }, []);

    useEffect(() => {
      const fetchProduto = async () => {
        try {
          setLoading(true);
          if (id) {
            setEditing(true);
            const produtoData = await Produto.getById(parseInt(id));
            setFormData({
              nome: produtoData.nome,
              descricao: produtoData.descricao,
              preco: String(produtoData.preco),
              marca: produtoData.marca,
              imagem: produtoData.imagem,
              estoque: String(produtoData.estoque),
              categoria_id: String(produtoData.categoria_id),
              subcategoria_id: String(produtoData.subcategoria_id),
            });
            setVariacoes(produtoData.variacoes);
            const categoriasData = await Categoria.getAll();

            const initialCategoria = categoriasData.find(
              (categoria) => categoria.id === produtoData.categoria_id
            );
            console.log('intialCategoria: ', initialCategoria)
            setSubcategorias(initialCategoria.subcategorias || []);
            return;
          }
          setEditing(false);
        } catch (err) {
          console.error("Erro ao carregar produto:", err);
          setError(
            "Erro ao carregar as informações do produto. Por favor, tente novamente."
          );
        } finally {
          setLoading(false);
        }
      };
  
      fetchProduto();
    }, [id]);

  if (loading) {
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
        Voltar para produtos
      </Button>

      {!id && (
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Cadastrar Novo Produto
        </Typography>
      )}
      {id && (
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Editar Produto
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 2 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome do Produto"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Preço"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              type="number"
              InputProps={{ inputProps: { step: "0.01" } }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estoque"
              name="estoque"
              value={formData.estoque}
              onChange={handleChange}
              type="number"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Categoria</InputLabel>
              <Select
                name="categoria_id"
                value={formData.categoria_id}
                //onChange
                onChange={(e) => handleChangeCategoria(e)}
                label="Categoria"
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Subcategoria</InputLabel>
              <Select
                name="subcategoria_id"
                value={formData.subcategoria_id}
                onChange={handleChangeSubcategoria}
                label="Subcategoria"
              >
                {subcategorias.map((subcategoria) => (
                  <MenuItem key={subcategoria.id} value={subcategoria.id}>
                    {subcategoria.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <VariacaoProdutoList
              variacoes={variacoes}
              setVariacoes={setVariacoes}
              produto_id={Number(id)}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: "2px dashed primary.main",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: "#fff8f0",
                minHeight: 180,
                position: "relative",
                transition: "border-color 0.2s",
                "&:hover": { borderColor: "primary.main" },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {loading ? (
                <CircularProgress sx={{color: 'primary.main'}}/>
              ) : (
                <Box>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  {imagePreview || formData.imagem ? (
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      <img
                        src={imagePreview || formData.imagem}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 140,
                          borderRadius: 8,
                          objectFit: "contain",
                          margin: "0 auto",
                        }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: -5,
                          right: -5,
                          backgroundColor: "white",
                          boxShadow: "0px 0px 5px",
                          border: "none",
                          "&:hover ": {
                            backgroundColor: "lightgray",
                          },
                        }}
                        onClick={handleRemoveImage}
                      >
                        <Close sx={{ color: "red" }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography color="text.secondary" sx={{ mt: 5 }}>
                      Arraste uma imagem aqui ou clique para selecionar
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            {!id && (
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
                Cadastrar Produto
              </Button>
            )}

            {id && (
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
                Salvar
              </Button>
            )}
          </Grid>
        </Grid>
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
                variant="filled"
              >
                {message}
              </Alert>
            </Snackbar>
    </Container>
  );
};

export default ProductForm;
