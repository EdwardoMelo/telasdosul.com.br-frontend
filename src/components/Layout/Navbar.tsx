
import React, { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  TextField,
  InputBase,
} from "@mui/material";
import { Menu as MenuIcon, ShoppingCart, Person } from "@mui/icons-material";
import { alpha, borderBottom, Stack, styled, textTransform } from "@mui/system";
import { useUser } from "@/contexts/userContext";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PreNavbar from "../ui/PreNavbar";
import SearchIcon from "@mui/icons-material/Search";


import { set } from "date-fns";
import CategoryNavbar from "../ui/CategoryNavbar";
import { useNav } from "@/contexts/navContext";
import { useProduct } from "@/contexts/productContext";

const StyledAppBar = styled(AppBar)(
  ({ isTransparent }: { isTransparent: boolean }) => ({
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    position: "fixed",
    top: 0,
    zIndex: 30,
    boxShadow: "none",
    transition: "background-color 0.3s ease-in-out",
  })
);

const NavButton = styled(RouterLink)({
  color: "white",
  margin: "0 8px",
  padding: 4,
  "&:hover": {
    padding: 4,
    color: "primary.main",
  },
  transition: "all 0.5s ease-in-out",
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
  border: "1px solid lightgray",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  minWidth: 200,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: 'gray'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "gray",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: "all 0.3s ease-in-out",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const {searchTerm, setSearchTerm } = useProduct();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isTransparent, setIsTransparent] = useState(true);
  const [LocalSearchTerm, setLocalSearchTerm] = useState("");
  const [isCategoryNavbarVisible, setIsCategoryNavbarVisible] = useState(true);

  const { setNavbarHeight } = useNav();



  const navRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const {id} = useParams();
  const { user } = useUser();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    if (LocalSearchTerm.trim()) {
      setSearchTerm(LocalSearchTerm);
      if(location.pathname !== '/produtos'){ 
        navigate(`/produtos`);
        return;
      }
    }
  };

  useEffect(( ) => { 
      console.log('useEffect searchterm')
      setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(( ) =>  {
    console.log('useEffect LocalSearchTerm')
    if(LocalSearchTerm === ''){ 
      setSearchTerm(LocalSearchTerm);
    }
  }, [LocalSearchTerm]);

  

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", zIndex: 30 }}>
      <List>
        <ListItem component={RouterLink} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={RouterLink} to="/produtos">
          <ListItemText primary="Produtos" />
        </ListItem>
        <ListItem component={RouterLink} to="/contato">
          <ListItemText primary="Contato" />
        </ListItem>
        {!user && (
          <ListItem component={RouterLink} to="/login">
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );
  useEffect(() => {
    const checkHeroInView = () => {
      // Hide category navbar on specific routes
      if (["/produtos", "/servicos"].includes(location.pathname)) {
        setIsCategoryNavbarVisible(false);
        return;
      }
      if(id){ 
        setIsCategoryNavbarVisible(false);
        return;
      }
      const hero = document.getElementById("hero-section");
      if (!hero) {
        setIsCategoryNavbarVisible(false);
        return;
      }

      const rect = hero.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 400;
      setIsCategoryNavbarVisible(inView);
    };

    window.addEventListener("scroll", checkHeroInView);
    window.addEventListener("resize", checkHeroInView);
    checkHeroInView();

    return () => {
      window.removeEventListener("scroll", checkHeroInView);
      window.removeEventListener("resize", checkHeroInView);
    };
  }, [location]);

 //useEffect que coloca observer no navRef, ataulizando a altura no contexto a cada mudança
  useEffect(() => {
    if (!navRef.current) return;
    const handleResize = () => {
      setNavbarHeight(navRef.current.clientHeight);
    };
    const observer = new window.ResizeObserver(handleResize);
    observer.observe(navRef.current);
    handleResize();
    return () => {
      observer.disconnect();
    };
  }, [navRef]);

  useEffect(() => {
    if (navRef.current) {
      setNavbarHeight(navRef.current.clientHeight);
    }
  }, [navRef]);

  return (
    <>
      <StyledAppBar
        position="static"
        isTransparent={isTransparent}
        ref={navRef}
      >
        <PreNavbar background={isTransparent ? "transparent" : "black"} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            alignItems: "center",
            padding: 1,
            position: "relative",
          }}
        >
          <Stack
            direction="row"
            sx={{
              width: {
                xs: "100%",
                sm: "80%",
              },
              flexWrap: "wrap",
            }}
          >
            {/*LOGO */}

            {/*Serach e links */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                maxHeight: 60,
                padding: 2,
              }}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocalSearchTerm(e.target.value)
                  }
                  placeholder="Pesquisar..."
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
              <Button
                onClick={handleSearch}
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: 1,
                  color: "white",
                  fontWeight: "normal",
                  width: 100,
                  "&:hover": { backgroundColor: "gray" },
                }}
              >
                Buscar
              </Button>

              <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                {[
                  { label: "Home", to: "/" },
                  { label: "Produtos", to: "/produtos" },
                  { label: "Contato", to: "/contato" },
                ].map(({ label, to }) => (
                  <NavButton
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "gray",
                    }}
                    to={to}
                    key={to}
                  >
                    {label}
                  </NavButton>
                ))}
              </Box>
            </Box>
          </Stack>
        </Box>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: { sm: "none" },
            color: "primary.main",
            position: "absolute",
            top: 1,
            right: 2,
          }}
        >
          <MenuIcon />
        </IconButton>

        <CategoryNavbar visible={isCategoryNavbarVisible} />
      </StyledAppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
