import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Button from '@mui/material/Button';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState(false);
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
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!loggedIn ? (
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Publications"
                to="/publications"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setForceRender={!setForceRender}
              />

              {/* <Item
                title="Complaint"
                to="/form"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setForceRender={!setForceRender}
              /> */}

            </Box>
          ) : (
            
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="My Profile"
                to={"/authorProfile/" + authorIDState}
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setForceRender={!setForceRender}
              />

              <Item
                title="Publications"
                to="/publications"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setForceRender={!setForceRender}
              />

              <Item
                title="Complaint"
                to="/form"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setForceRender={!setForceRender}
              />

            </Box>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
