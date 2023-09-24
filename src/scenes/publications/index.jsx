import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/publication")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((row) => ({
          id: row.pubID,
          title: row.pubTitle,
          author: row.pubAuthors,
          date: row.pubDate,
          type: row.pubType,
          vol: row.pubVol,
          issue: row.pubIssue,
          pages: row.pubPages,
          totCite: row.pubTotCite,
        }));
        setRows(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "title",
      headerName: "Title",
      flex: 3,
      renderCell: (params) => (
        <Link
          to={`/publicationDetails/${params.row.id}`}
          style={{
          textDecoration: "none",
          color: colors.greenAccent[300],
          fontWeight: "bold",
          }}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "author",
      headerName: "Author",
      flex: 2,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "vol",
      headerName: "Volume",
      flex: 1,
    },
    {
      field: "issue",
      headerName: "Issue",
      flex: 1,
    },
    {
      field: "pages",
      headerName: "Pages",
      flex: 1,
    },
    {
      field: "totCite",
      headerName: "Total Cited By",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="Publications" subtitle="List of UniKL Publications" />
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
        <div style={{ height: 1000, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={100}
            components={{ Toolbar: GridToolbar }}
          />
        </div>
      </Box>
    </Box>
  );
}

export default App;
