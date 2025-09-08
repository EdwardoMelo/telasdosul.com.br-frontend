import { VariacaoProduto, VariacaoProdutoDTO } from "@/models/VariacaoProduto";
import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  Modal,
  TextField,
  Button,
  List,
  ListItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";

interface props {
  produto_id?: number;
  variacoes?: VariacaoProdutoDTO[];
  setVariacoes?: React.Dispatch<React.SetStateAction<VariacaoProdutoDTO[]>>;
}

const VariacaoProdutoList = ({
  produto_id,
  variacoes,
  setVariacoes,
}: props) => {
  const [newVariacao, setNewVariacao] = useState<VariacaoProdutoDTO>(
    {
      id: 0,
      nome: "",
      descricao: "",
      produto_id: produto_id ?? 0,
      created_at: "",
      updated_at: "",
    });
  const [editing, setEditing] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState<string>();
  const [alertColor, setAlertColor] = useState<string>();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const showFeedBack = (message: string, alertColor: string) => {
    setSnackbarOpen(true);
    setMessage(message);
    setAlertColor(alertColor);
  };

  const handleChangeNewVariacao = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVariacao({
      ...newVariacao,
        [name]: value,
    });
  };

  const validateVariacao = (variacao: VariacaoProdutoDTO) => {
    if (!variacao.nome || variacao.nome.trim() === "") {
      throw new Error("O nome da variação é obrigatório.");
    }
    return;
  };

  const handleSubmit = async () => {
    if (editing) {
      await saveEditedVariacao();
    } else {
      await addVariacao();
    }
    setModalOpen(false);
    setNewVariacao(
      {
        id: 0,
        nome: "",
        descricao: "",
        produto_id: produto_id ?? 0,
        created_at: "",
        updated_at: "",
      }
    );
  };

  const saveEditedVariacao = async () => {
    try {
      newVariacao.updated_at = new Date().toISOString();
      validateVariacao(newVariacao);
      const updatedVariacao =  await new VariacaoProduto(newVariacao).update();
      setVariacoes(
        variacoes.map((variacao) =>
          variacao.id === updatedVariacao.id ? updatedVariacao : variacao
        )
      );
      showFeedBack("Variação atualizada com sucesso!", "success");
    } catch (e) {
      showFeedBack(e.message, "error");
    }
  };

  const addVariacao = async () => {
    try {
      if (produto_id) {
        validateVariacao(newVariacao);
        newVariacao.produto_id = produto_id;
        newVariacao.created_at = new Date().toISOString();
        newVariacao.updated_at = new Date().toISOString();
        const createdVariacao = await new VariacaoProduto(newVariacao).create();
        console.log('createdVariacao', createdVariacao)
        setVariacoes([...variacoes, createdVariacao]);
        showFeedBack("Variação adicionada com sucesso!", "success");
        return;
      }
      newVariacao.id = Math.floor(Math.random() * 1000000);
      newVariacao.created_at = new Date().toISOString();
      newVariacao.updated_at = new Date().toISOString();
      setVariacoes([...variacoes, newVariacao]);
    } catch (e: any) {
      showFeedBack(e.message, "error");
    }
  };

  const deleteVariacao = async (variacao: VariacaoProdutoDTO) => {
    if (produto_id) {
      const deletedVariacao = new VariacaoProduto(variacao)
      await deletedVariacao.delete();
      setVariacoes(variacoes.filter((v) => v.id !== variacao.id));
      showFeedBack("Variação excluída com sucesso!", "success");
      return;
    }
    setVariacoes(variacoes.filter((v) => v.id !== variacao.id));
  };

  useEffect(() => {
    if (produto_id) {
      const fetchVariacoes = async () => {
        const variacoesData = await VariacaoProduto.getByProdutoId(produto_id);
        setVariacoes(variacoesData);
      };
      fetchVariacoes();
    }
  }, [produto_id]);

  return (
    <Box
      sx={{
        border: "1px solid lightgray",
        position: "relative",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Tooltip title="Adicionar nova variação">
        <IconButton
          onClick={() => setModalOpen(true)}
          sx={{
            backgroundColor: "primary.main",
            position: "absolute",
            right: 4,
            "&:hover": {
              backgroundColor: "primary.main",
              scale: 1.2,
            },
            transition: "all 0.3s ease-in-out",
            color: "white",
          }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Typography variant="body2" color="text.secondary" fontWeight="bold">
        Variações
      </Typography>
      {variacoes && variacoes.length > 0 ? (
        <List>
          {variacoes.map((variacao) => (
            <ListItem
              key={variacao.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 0.5,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                - {variacao.nome}
              </Typography>
              <Tooltip title="Excluir variação">
                <IconButton
                  onClick={() => deleteVariacao(variacao)}
                  sx={{
                    height: 20,
                    width: 20,
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Nenhuma variação cadastrada.
        </Typography>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" mb={2}>
            Adicionar Nova Variação
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Nome"
              name="nome"
              value={newVariacao.nome}
              onChange={handleChangeNewVariacao}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              value={newVariacao.descricao}
              onChange={handleChangeNewVariacao}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button variant="outlined" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                color="primary"
              >
                Salvar
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertColor === "success" ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VariacaoProdutoList;
