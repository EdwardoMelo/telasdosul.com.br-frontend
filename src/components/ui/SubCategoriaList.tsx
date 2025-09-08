import React, { useState } from "react";
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
  ListItemIcon,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Subcategoria, SubcategoriaDTO } from "@/models/SubCategoria"; // Adjust path as needed

interface SubcategoriaListProps {
  categoria_id?: number; // ID of the parent category, if it exists and is persisted
  subcategoriasFromParent: SubcategoriaDTO[];
  onSubcategoriasChange: (updatedSubcategorias: SubcategoriaDTO[]) => void;
}

const SubcategoriaList = ({
  categoria_id,
  subcategoriasFromParent,
  onSubcategoriasChange,
}: SubcategoriaListProps) => {
  const initialNewSubcategoriaState = (): SubcategoriaDTO => ({
    id: 0,
    nome: "",
    descricao: "",
    categoria_id: categoria_id || 0, // Will be confirmed by backend if 0 initially
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [newSubcategoria, setNewSubcategoria] = useState<SubcategoriaDTO>(
    initialNewSubcategoriaState()
  );
  const [editing, setEditing] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [alertColor, setAlertColor] = useState<"success" | "error" | "info">(
    "info"
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const showFeedBack = (msg: string, color: "success" | "error" | "info") => {
    setMessage(msg);
    setAlertColor(color);
    setSnackbarOpen(true);
  };

  const handleChangeNewSubcategoria = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewSubcategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateSubcategoria = (sub: SubcategoriaDTO) => {
    if (!sub.nome || sub.nome.trim() === "") {
      throw new Error("O nome da subcategoria é obrigatório.");
    }
    // Add other validations if needed (e.g., for descricao)
  };

  const resetModalState = () => {
    setNewSubcategoria(initialNewSubcategoriaState());
    setEditing(false);
    setModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setNewSubcategoria(initialNewSubcategoriaState());
    setEditing(false);
    setModalOpen(true);
  };

  const handleOpenEditModal = (sub: SubcategoriaDTO) => {
    setNewSubcategoria({ ...sub });
    setEditing(true);
    setModalOpen(true);
  };

  const handleSubmitModal = async () => {
    try {
      validateSubcategoria(newSubcategoria);
      let updatedList: SubcategoriaDTO[];
      if (editing) {
        if (!newSubcategoria.id) {
          throw new Error("ID da subcategoria inválido para edição.");
        }
        const subToUpdate = new Subcategoria(newSubcategoria);
        subToUpdate.updated_at = new Date(); 
        const updatedSub = await subToUpdate.update();
        console.log('updatedSub:', updatedSub)
        updatedList = subcategoriasFromParent.map((s) => s.id === updatedSub.id ? updatedSub : s);
        onSubcategoriasChange(updatedList);
        showFeedBack("Subcategoria atualizada com sucesso!", "success");
        resetModalState();
        return;
      } // Adding a new subcategory
        if (categoria_id) {
          const subToCreate = {
            ...newSubcategoria,
            categoria_id: categoria_id, // Ensure it's linked to the persisted parent
          };
          const createdSub = await new Subcategoria(subToCreate).create();
          updatedList = [...subcategoriasFromParent, createdSub];
          onSubcategoriasChange(updatedList);
          showFeedBack("Subcategoria adicionada com sucesso!", "success");
          resetModalState();
          return;
        }
        // Parent category is new, add to local list (will be created when parent is saved)
        const localSubToAdd: SubcategoriaDTO = {
          ...newSubcategoria,
          id: 0, // Mark as new, not yet persisted
          // categoria_id will be set by parent form logic before saving Categoria
        };
        updatedList = [...subcategoriasFromParent, localSubToAdd];
        showFeedBack("Subcategoria adicionada à lista.", "info");
      onSubcategoriasChange(updatedList);
      resetModalState();
    } catch (e: any) {
      showFeedBack(e.message || "Ocorreu um erro.", "error");
    }
  };

  const handleDeleteSubcategoria = async (subToDelete: SubcategoriaDTO) => {
    try {
      let updatedList: SubcategoriaDTO[];
      if (subToDelete.id && subToDelete.id !== 0 && categoria_id) {
        // Persisted subcategory and persisted parent category
        await new Subcategoria(subToDelete).delete();
        updatedList = subcategoriasFromParent.filter(
          (s) => s.id !== subToDelete.id
        );
        onSubcategoriasChange(updatedList);
        showFeedBack("Subcategoria excluída com sucesso!", "success");
        return;
      } 
        // Local subcategory (not yet saved, or parent is new)
        // Filter by object reference to handle multiple items with id:0
      updatedList = subcategoriasFromParent.filter((s) => s !== subToDelete);
      showFeedBack("Subcategoria removida da lista.", "info");
      onSubcategoriasChange(updatedList);
    } catch (e: any) {
      showFeedBack(e.message || "Erro ao excluir subcategoria.", "error");
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid lightgray",
        position: "relative",
        p: 2,
        mt: 2,
        borderRadius: 1,
      }}
    >
      <Tooltip title="Adicionar nova subcategoria">
        <IconButton
          onClick={handleOpenAddModal}
          sx={{
            backgroundColor: "primary.main",
            position: "absolute",
            top: 8,
            right: 8,
            "&:hover": { backgroundColor: "primary.main", transform: "scale(1.1)" },
            transition: "all 0.2s ease-in-out",
            color: "white",
            zIndex: 1,
          }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Typography variant="h6" gutterBottom component="div">
        Subcategorias
      </Typography>
      {subcategoriasFromParent && subcategoriasFromParent.length > 0 ? (
        <List dense>
          {subcategoriasFromParent.map((sub, index) => (
            <ListItem
              key={sub.id && sub.id !== 0 ? sub.id : `sub-${index}`}
              secondaryAction={
                <>
                  {sub.id !== 0 &&
                    categoria_id && ( // Only show edit for persisted items
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleOpenEditModal(sub)}
                        sx={{ mr: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteSubcategoria(sub)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              }
              sx={{
                pl: 0,
                borderBottom: "1px solid #eee",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <Typography variant="body2">{sub.nome}</Typography>
              {sub.descricao && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ ml: 1 }}
                >
                  - {sub.descricao}
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Nenhuma subcategoria cadastrada.
        </Typography>
      )}

      <Modal
        open={modalOpen}
        onClose={resetModalState}
        aria-labelledby="subcategoria-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="subcategoria-modal-title"
            variant="h6"
            component="h2"
            mb={2}
          >
            {editing ? "Editar Subcategoria" : "Adicionar Nova Subcategoria"}
          </Typography>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={newSubcategoria.nome}
            onChange={handleChangeNewSubcategoria}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descrição (Opcional)"
            name="descricao"
            value={newSubcategoria.descricao || ""}
            onChange={handleChangeNewSubcategoria}
            margin="normal"
            multiline
            rows={3}
          />
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button variant="text" onClick={resetModalState}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitModal}
              color="primary"
            >
              {editing ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </Box>
        </Box>
      </Modal>

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
    </Box>
  );
};

export default SubcategoriaList;
