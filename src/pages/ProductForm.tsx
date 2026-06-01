import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  TextField,
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
import { Close } from "@mui/icons-material";
import { Produto } from "../models/Produto";
import { Categoria } from "../models/Categoria";
import { Subcategoria, SubcategoriaDTO } from "../models/SubCategoria";
import { VariacaoProduto, VariacaoProdutoDTO } from "@/models/VariacaoProduto";
import VariacaoProdutoList from "@/components/ui/VariacaoProdutoList";
import PriceLineList, {
  LinhaPrecoFormRow,
  linhaFormToInput,
  linhasFromDto,
} from "@/components/ui/PriceLineList";
import FirebaseService from "@/services/firebaseService";
import { TipoPrecoProduto } from "@/models/LinhaPreco";
import { METRICAS_PRECO, UNIDADES_METRICA } from "@/utils";
import { FONT_BODY } from "@/theme/typography";
import AutoResizeTextarea from "@/components/ui/AutoResizeTextarea";
import ProductFormToolbar from "@/components/product/ProductFormToolbar";

const FORM_MAX_WIDTH = 1280;

const labelProps = {
  sx: { fontWeight: 700, fontSize: 13, color: "text.primary" },
};

const compactField = {
  size: "small" as const,
  InputLabelProps: labelProps,
  sx: {
    "& .MuiInputBase-input": { fontSize: 14, py: 0.75 },
    "& .MuiInputBase-root": { fontSize: 14 },
  },
};

const compactSelect = {
  size: "small" as const,
  sx: {
    fontSize: 14,
    "& .MuiSelect-select": { py: 0.75 },
  },
};

const descriptionFieldSx = {
  "& .MuiInputBase-input": {
    fontSize: 13,
    lineHeight: 1.5,
    py: 0.5,
  },
  "& .MuiInputBase-root": { fontSize: 13, alignItems: "flex-start" },
};

const ProductForm = () => {
  const navigate = useNavigate();

  const {id} = useParams();

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    tipo_preco: "FIXO" as TipoPrecoProduto,
    metrica: "altura",
    unidade_metrica: "m",
    marca: "",
    imagem: "",
    estoque: "",
    categoria_id: "",
    subcategoria_id: "",
  });
  const [linhasPreco, setLinhasPreco] = useState<LinhaPrecoFormRow[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(!!id);
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

  const validatePricing = (): void => {
    if (formData.tipo_preco === "POR_METRICA") {
      if (linhasPreco.length === 0) {
        throw new Error("Adicione ao menos uma linha de preço por métrica.");
      }
      linhasPreco.forEach((linha, i) => {
        if (linha.valor === "" || linha.preco === "") {
          throw new Error(`Preencha valor e preço na linha ${i + 1}.`);
        }
        if (Number(linha.valor) < 0 || Number(linha.preco) < 0) {
          throw new Error(`Valores inválidos na linha ${i + 1}.`);
        }
      });
    } else if (!formData.preco || Number(formData.preco) < 0) {
      throw new Error("Informe um preço fixo válido.");
    }
  };

  const buildProdutoFromForm = (productId = 0): Produto => {
    const isPorMetrica = formData.tipo_preco === "POR_METRICA";
    return new Produto({
      id: productId,
      nome: formData.nome,
      descricao: formData.descricao,
      preco: isPorMetrica ? null : parseFloat(formData.preco),
      tipo_preco: formData.tipo_preco,
      metrica: isPorMetrica ? formData.metrica : null,
      unidade_metrica: isPorMetrica ? formData.unidade_metrica : null,
      marca: formData.marca,
      imagem: formData.imagem,
      estoque: parseInt(formData.estoque, 10) || 0,
      categoria_id: parseInt(formData.categoria_id, 10),
      subcategoria_id: formData.subcategoria_id
        ? parseInt(formData.subcategoria_id, 10)
        : undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      validatePricing();
      const linhasInput = linhasPreco.map(linhaFormToInput);

      if (editng && id) {
        const produto = buildProdutoFromForm(parseInt(id, 10));
        await produto.update();
        if (formData.tipo_preco === "POR_METRICA") {
          await produto.saveLinhasPreco(linhasInput);
        } else {
          await produto.saveLinhasPreco([]);
        }
        navigate(`/produtos/${produto.id}`);
        return;
      }

      const produto = buildProdutoFromForm();
      await produto.create();
      if (formData.tipo_preco === "POR_METRICA" && linhasInput.length > 0) {
        await produto.saveLinhasPreco(linhasInput);
      }
      if (variacoes.length) {
        await VariacaoProduto.createManyByProductId(produto.id, variacoes);
      }
      navigate(`/produtos/${produto.id}`);
    } catch (err: unknown) {
      console.error("Erro ao salvar produto:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao salvar o produto. Verifique os dados e tente novamente.";
      setError(msg);
      showFeedBack(msg, "error");
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
          if (id) setInitialLoading(true);
          if (id) {
            setEditing(true);
            const produtoData = await Produto.getById(parseInt(id));
            setFormData({
              nome: produtoData.nome,
              descricao: produtoData.descricao ?? "",
              preco:
                produtoData.preco != null ? String(produtoData.preco) : "",
              tipo_preco: produtoData.tipo_preco ?? "FIXO",
              metrica: produtoData.metrica ?? "altura",
              unidade_metrica: produtoData.unidade_metrica ?? "m",
              marca: produtoData.marca ?? "",
              imagem: produtoData.imagem ?? "",
              estoque: String(produtoData.estoque),
              categoria_id: String(produtoData.categoria_id),
              subcategoria_id: produtoData.subcategoria_id
                ? String(produtoData.subcategoria_id)
                : "",
            });
            setLinhasPreco(
              produtoData.linhas_preco?.length
                ? linhasFromDto(produtoData.linhas_preco)
                : []
            );
            setVariacoes(produtoData.variacoes ?? []);
            if (produtoData.imagem) {
              setImagePreview(produtoData.imagem);
            }
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
          setInitialLoading(false);
        }
      };
  
      fetchProduto();
    }, [id]);

  if (initialLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
          mt: 2,
        }}
      >
        <CircularProgress size={32} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  const pageTitle = id ? "Editar produto" : "Cadastrar produto";

  return (
    <>
      <ProductFormToolbar
        title={pageTitle}
        onBack={handleGoBack}
        submitLabel={id ? "Salvar" : "Cadastrar"}
        saving={loading}
      />

      <Box
        sx={{
          maxWidth: FORM_MAX_WIDTH,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: 1.5,
          pb: 4,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 1.5, py: 0.5 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          id="product-form"
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          onSubmit={handleSubmit}
          noValidate
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            p: { xs: 1.5, sm: 2 },
            boxShadow: "0 1px 3px rgba(0, 32, 74, 0.04)",
          }}
        >
        <Grid container spacing={1.5}>
          {/* Nome — linha compacta */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome do produto"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              variant="outlined"
              {...compactField}
            />
          </Grid>

          {/* Duas colunas: descrição | demais campos */}
          <Grid item xs={12} md={6}>
            <AutoResizeTextarea
              fullWidth
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              variant="outlined"
              minRows={5}
              {...compactField}
              sx={{
                ...compactField.sx,
                ...descriptionFieldSx,
                "& .MuiInputBase-root": { height: "auto" },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: FONT_BODY,
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                    display: "block",
                    mb: 0.25,
                  }}
                >
                  Configuração de preço
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" {...compactSelect}>
                  <InputLabel {...labelProps}>Tipo de preço</InputLabel>
                  <Select
                    name="tipo_preco"
                    value={formData.tipo_preco}
                    label="Tipo de preço"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tipo_preco: e.target.value as TipoPrecoProduto,
                      }))
                    }
                  >
                    <MenuItem value="FIXO" sx={{ fontSize: 14 }}>
                      Preço fixo
                    </MenuItem>
                    <MenuItem value="POR_METRICA" sx={{ fontSize: 14 }}>
                      Preço por métrica
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formData.tipo_preco === "FIXO" ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Preço (R$)"
                    name="preco"
                    value={formData.preco}
                    onChange={handleChange}
                    type="number"
                    required
                    variant="outlined"
                    InputProps={{ inputProps: { step: "0.01", min: 0 } }}
                    {...compactField}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" {...compactSelect}>
                      <InputLabel {...labelProps}>Métrica</InputLabel>
                      <Select
                        value={formData.metrica}
                        label="Métrica"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            metrica: e.target.value,
                          }))
                        }
                      >
                        {METRICAS_PRECO.map((m) => (
                          <MenuItem key={m.value} value={m.value} sx={{ fontSize: 14 }}>
                            {m.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" {...compactSelect}>
                      <InputLabel {...labelProps}>Unidade</InputLabel>
                      <Select
                        value={formData.unidade_metrica}
                        label="Unidade"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            unidade_metrica: e.target.value,
                          }))
                        }
                      >
                        {UNIDADES_METRICA.map((u) => (
                          <MenuItem key={u} value={u} sx={{ fontSize: 14 }}>
                            {u}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <PriceLineList
                      linhas={linhasPreco}
                      onChange={setLinhasPreco}
                      unidadeMetrica={formData.unidade_metrica}
                      metricaLabel={
                        METRICAS_PRECO.find((m) => m.value === formData.metrica)
                          ?.label ?? formData.metrica
                      }
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  variant="outlined"
                  {...compactField}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Estoque"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                  {...compactField}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  {...compactSelect}
                >
                  <InputLabel {...labelProps}>Categoria</InputLabel>
                  <Select
                    value={formData.categoria_id}
                    label="Categoria"
                    onChange={(e) => handleChangeCategoria(e)}
                  >
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.id} value={categoria.id} sx={{ fontSize: 14 }}>
                        {categoria.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" {...compactSelect}>
                  <InputLabel {...labelProps}>Subcategoria</InputLabel>
                  <Select
                    value={formData.subcategoria_id}
                    label="Subcategoria"
                    onChange={handleChangeSubcategoria}
                  >
                    {subcategorias.map((subcategoria) => (
                      <MenuItem key={subcategoria.id} value={subcategoria.id} sx={{ fontSize: 14 }}>
                        {subcategoria.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <VariacaoProdutoList
              variacoes={variacoes}
              setVariacoes={setVariacoes}
              produto_id={Number(id)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: FONT_BODY,
                fontWeight: 700,
                fontSize: 12,
                color: "text.secondary",
                display: "block",
                mb: 0.5,
              }}
            >
              Imagem do produto
            </Typography>
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1.5,
                p: 1.5,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: "#fafbfc",
                minHeight: 100,
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
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: 13, py: 2 }}
                    >
                      Arraste ou clique para selecionar
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Grid>

        </Grid>
        </Box>
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
    </>
  );
};

export default ProductForm;
