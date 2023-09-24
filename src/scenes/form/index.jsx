import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [compSubject, setcompSubject] = useState('');
  const [compDesc, setcompDesc] = useState('');
  const [lectID, setLectID] = useState(""); 
  const [loggedIn, setLoggedIn] = useState(false);
  const [authorIDState, setAuthorID] = useState('');
  const [message, setMessage] = useState('');
  const [forceRender, setForceRender] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    setLoggedIn(true);
    setAuthorID(localStorage.getItem("authorID"));
    fetchLecturerID(); // Fetch the lecturer ID on component mount
  }
}, []);

const fetchLecturerID = async (authorID) => {
  try {
    const response = await axios.get(`http://localhost:3001/lecturer/${authorID}`);
    const lecturer = response.data;
    setLectID(lecturer.lectID);
  } catch (error) {
    console.log("Error fetching lecturer ID:", error);
  }
};

const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post("http://localhost:3001/complaint", {
      subject: compSubject,
      desc: compDesc,
      lectID: lectID, // Use the retrieved lecturer ID
    });

    setMessage("Complaint sent successfully");
  } catch (error) {
    setMessage("Error sending complaint");
  }
  setForceRender(!forceRender);
};

  return (
    <Box m="20px">
      <Header title="Complaint" subtitle="Fill in complaint" />

          <form onSubmit={handleFormSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Subject"
                value={compSubject}
                name="subject"
                onChange={(e) => { setcompSubject(e.target.value); }}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Desc"
                value={compDesc}
                name="desc"
                onChange={(e) => { setcompDesc(e.target.value); }}
                sx={{ gridColumn: "span 4" }}
              />
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Complaint"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 4", gridRow: "span 4" }}
              /> */}
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address 2"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address2}
                name="address2"
                error={!!touched.address2 && !!errors.address2}
                helperText={touched.address2 && errors.address2}
                sx={{ gridColumn: "span 4" }}
              /> */}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Submit
              </Button>
            </Box>
          </form>
    </Box>
  );
};


export default Form;
