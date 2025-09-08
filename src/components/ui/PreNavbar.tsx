import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {Link as RouterLink, useNavigate } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote"; //orçamento
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useUser } from "@/contexts/userContext";
import { contactInfo } from "@/utils";

interface props {
  background?: string;
}
const PreNavbar = ({ background }: props) => {
  const { user, logout } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAdminPanel = () => {
    window.location.href = "/admin";
    handleClose();
  };
  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <Box
      sx={{
        display: {
          xs: "none",
          md: "flex",
        },
        bgcolor: "primary.light",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Grid
        container
        sx={{
          height: 30,
          placeContent: "center",
          width: {
            md: "90%",
            lg: "80%",
          },
        }}
      >
        <Grid
          item
          xs={3}
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            flexShrink: 0,
          }}
        >
          <Button
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: 14,
              textAlign: "left",
              textTransform: "none",
              width: "100%",

              justifyContent: "flex-start",
            }}
            disableRipple
          >
            Telas e Cia RS - Fornecedora
          </Button>
        </Grid>

        <Grid
          item
          xs={3}
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            alignItems: "center",
            gap: 1,
          }}
        >
          <Button
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?phone=${contactInfo.phone}&text=Olá, vim pelo site da Sulfire!`,
                "_blank"
              )
            }
            startIcon={<WhatsAppIcon sx={{ color: "secondary.main" }} />}
            sx={{
              fontSize: "small",
              color: "white",
              textTransform: "none",
              width: "100%",
              justifyContent: "flex-start",
            }}
            disableRipple
          >
            <Typography fontSize="small">
              Whatsapp <strong>{contactInfo.phone}</strong>
            </Typography>
          </Button>
        </Grid>

        <Grid
          item
          xs={3}
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            alignItems: "center",
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Button
            onClick={() => navigate("/contato")}
            startIcon={<EditNoteIcon sx={{ color: "secondary.main" }} />}
            sx={{
              fontSize: "small",
              color: "white",
              textTransform: "none",
              width: "100%",
              fontWeight: "normal",
              justifyContent: "flex-start",
            }}
            disableRipple
          >
            <Typography fontSize="small">
              Envie aqui <strong> seu orçamento</strong>!
            </Typography>
          </Button>
        </Grid>

        <Grid
          item
          xs={3}
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            alignItems: "center",
            gap: 1,
            justifyContent: "flex-end",
            padding: 0.5,
          }}
        >
          <Box>
            {user ? (
              <>
                <IconButton onClick={handleMenu} color="inherit">
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                  >
                    {user?.nome?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={handleClose}
                    component={RouterLink}
                    to="/perfil"
                  >
                    Meu Perfil
                  </MenuItem>
                  {user.tipo_usuario?.tipo === "administrador" && (
                    <MenuItem onClick={handleAdminPanel}>Painel Admin</MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Sair</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                startIcon={<AccountCircleIcon sx={{ color: "#F64E29" }} />}
                sx={{
                  fontSize: "small",
                  textTransform: "none",
                  color: "white",

                  width: "100%",
                  justifyContent: "flex-start",
                }}
                disableRipple
              >
                Login!
              </Button>
            )}{" "}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PreNavbar;
