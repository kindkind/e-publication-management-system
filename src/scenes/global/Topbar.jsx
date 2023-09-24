import { Box, IconButton, useTheme} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Link, useNavigate } from 'react-router-dom';

// import logo from "../../assets/logo.png";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const navigate = useNavigate();
  const [authorIDState, setAuthorID] = useState('');

  useEffect(() => {
    // Check if a token exists in localStorage
  const token = localStorage.getItem('token');
    setLoggedIn(!!token);
    setAuthorID(localStorage.getItem('authorID'));
    setForceRender(!forceRender);
  }, []);

  const handleLogout = () => {
    // Remove the token from local storage and log out
    localStorage.removeItem('token');
    localStorage.removeItem('authorID');
    setLoggedIn(false);
    setAuthorID('');
    navigate('/publications');
    setForceRender(!forceRender);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >        
      
{/* Logo */}
        {/* <img src={logo} alt="Logo" style={{ height: "30px" }} /> */}
      </Box>

{/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {!loggedIn ? (
        <IconButton component={Link} to="/auth">
        <PersonOutlinedIcon />
        </IconButton>
        ) : (
          <IconButton onClick={handleLogout}>
          <h6>Logout</h6>
        </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
