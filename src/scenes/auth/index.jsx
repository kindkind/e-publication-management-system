import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { tokens } from "../../theme";
import { useNavigate, useParams, Link } from 'react-router-dom';

const AuthPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authorID: paramAuthorID } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const [forceRender, setForceRender] = useState(false);
  const navigate = useNavigate();
  const [authorIDState, setAuthorID] = useState('');
  const [rows, setRows] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      setAuthorID(localStorage.getItem('authorID'));
    }

    fetch("http://localhost:3001/author")
    .then((response) => response.json())
    .then((data) => {
      const mappedData = data.map((item) => ({
        id: item.authorID, // Replace with the correct column name
        name: item.authorName, // Replace with the correct column name
        citedby: item.authorTotCite, // Replace with the correct column name
        hindex: item.authorHindex, // Replace with the correct column name
        i10index: item.authorI10index, // Replace with the correct column name
      }));
      setRows(mappedData);
    })
    .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      await axios.post('http://localhost:3001/register', {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        phone: registerPhone,
        authorID: selectedAuthorId 
      });

      setMessage('User registered successfully');
    } catch (error) {
      setMessage('Error registering user');
    }
    setForceRender(!forceRender);
  };

  const handleLogin = async (e, authorID) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', {
        email: loginEmail,
        password: loginPassword
      });
      const token = response.data.token;

      const { message, authorID: responseAuthorID } = response.data;
      localStorage.setItem('token', token);
      if (responseAuthorID) {
        localStorage.setItem('authorID', responseAuthorID);
        navigate(`/authorProfile/${responseAuthorID}`);
        setForceRender(!forceRender);
      }
        setLoggedIn(true);
        navigate(`/authorProfile/${responseAuthorID}`);
        setForceRender(!forceRender);
    } catch (error) {
      setMessage('Invalid email or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authorID');
    setLoggedIn(false);
    setAuthorID('');
    navigate('/publications');
    setForceRender(!forceRender);
  };

  return (
    <div className="page">
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        width="90%"
        marginLeft="5%"
        marginRight="5%"
      >
        <Box gridColumn="span 6" gridRow="span 4" backgroundColor={colors.primary[400]}>
          <Box mt="25px" p="0 30px" display="flex " justifyContent="space-between" alignItems="center">
            <div className="form">
              <h1>Register</h1>
              <form onSubmit={handleRegister}>
                <Box sx={{ '& > :not(style)': { m: 1 }, maxWidth: '542px', marginTop: '20px', marginLeft: '10px' }}>
                  <TextField
                    required
                    label="Name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                    value={registerName}
                    onChange={(e) => { setRegisterName(e.target.value); }}
                    variant="outlined"
                  />

                  <TextField
                    required
                    sx={{ width: '97.5%' }}
                    label="Email Address"
                    value={registerEmail}
                    onChange={(e) => { setRegisterEmail(e.target.value); }}
                  />

                  <TextField
                    required
                    sx={{ width: '97.5%' }}
                    label="Password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => { setRegisterPassword(e.target.value); }}
                  />

                  <TextField
                    required
                    label="Phone Number"
                    sx={{ width: '47%' }}
                    value={registerPhone}
                    onChange={(e) => { setRegisterPhone(e.target.value); }}
                  />

                  <FormControl sx={{ width: '47%' }}>
                    <InputLabel id="demo-simple-select-label">Author</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedAuthorId}
                      onChange={(e) => setSelectedAuthorId(e.target.value)}
                      label="Author"
                    >
                    {rows.map((author) => (
                      <MenuItem key={author.id} value={author.id}>
                        {author.name}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ '& > :not(style)': { m: 1 }, maxWidth: '542px', marginTop: '20px', marginLeft: '10px' }}>
                  <Button type="submit" variant="contained" color="success">Sign Up</Button>
                </Box>
                {message && <p>{message}</p>}
              </form>
            </div>
          </Box>
        </Box>

        <Box gridColumn="span 6" gridRow="span 4" backgroundColor={colors.primary[400]} overflow="auto">
          <Box mt="25px" p="0 30px" display="flex " justifyContent="space-between" alignItems="center">
            
            
          <form onSubmit={handleLogin} Link to={`/authorProfile/${authorIDState}`} style={{ color: colors.greenAccent[300] }}>
              <h1>Login</h1>
              <Box sx={{ '& > :not(style)': { m: 1 }, maxWidth: '542px', marginTop: '20px', marginLeft: '10px' }}>
                <TextField
                  required
                  sx={{ width: '97.5%' }}
                  label="Email Address"
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); }}
                />

                <TextField
                  required
                  sx={{ width: '97.5%' }}
                  label="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); }}
                />
              </Box>

              <Box sx={{ '& > :not(style)': { m: 1 }, maxWidth: '542px', marginTop: '20px', marginLeft: '10px' }}>
                <Button type="submit" variant="contained" color="success">Login</Button>
              </Box>
              {message && <p>{message}</p>}
            </form>


          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AuthPage;
