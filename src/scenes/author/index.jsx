import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Author = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/author")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((row) => ({
          id: row.authorID,
          name: row.authorName,
          citedby: row.authorTotCite,
          hindex: row.authorHindex,
          i10index: row.authorI10index,
        }));
        setRows(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Link to={`/authorProfile/${params.row.id}`} style={{ color: colors.greenAccent[300] }}>
          {params.value}
        </Link>
      ),
    },
    {
      field: "citedby",
      headerName: "Cited By",
      type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hindex",
      headerName: "h-Index",
      type: "number",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "i10index",
      headerName: "i10-Index",
      type: "number",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
  ];

  return (
    <Box m="20px">
      <Header title="Authors" subtitle="List of Authors/Lecturers of UniKL" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell a": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={100}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Author;
