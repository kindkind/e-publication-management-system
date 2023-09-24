import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useParams, Link } from "react-router-dom";
import { ResponsiveBar } from "@nivo/bar";
import BarChart from "../../components/BarChart";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const AuthorProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authorID } = useParams();
  const [authorData, setAuthorData] = useState(null);
  const [chartHeight, setChartHeight] = useState(300); // Initial height of the chart
  const [rows, setRows] = useState([]);
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/author/${authorID}`);
        if (response.ok) {
          const data = await response.json();
          setAuthorData(data);
        } else {
          console.error("Error fetching author details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching author details:", error);
      }
    };
    fetchData();
  }, [authorID]);

  useEffect(() => {
    fetch(`http://localhost:3001/authorPublication/${authorID}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((row) => ({
          id: row.pubID,
          title: row.pubTitle,
          author: row.pubAuthors,
          citedBy: row.pubTotCite,
          date: row.pubDate,
          pubType: row.pubType,
        }));
        setRows(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [authorID]);


  useEffect(() => {
    const handleResize = () => {
      const chartContainer = document.getElementById("chart-container");
      if (chartContainer) {
        setChartHeight(chartContainer.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial height on mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!authorData) {
    return <Typography>Loading...</Typography>; // Display a loading indicator while waiting for the data to load
  }

  const authData = authorData[0];
  const currentYear = new Date().getFullYear();
  const authorCitePerYear = JSON.parse(authData.authorCitePerYear);
  const data = authorCitePerYear.map((count, index) => ({
    year: currentYear - authorCitePerYear.length + index + 1,
    citations: count,
  }));

  // Group publications by pubType and calculate the count for each type
  const publicationTypes = rows.reduce((types, publication) => {
    const pubType = publication.pubType;
    types[pubType] = types[pubType] ? types[pubType] + 1 : 1;
    return types;
  }, {});

  // Convert the publication types object into an array of objects
  const publicationTypeData = Object.keys(publicationTypes).map((pubType) => ({
    pubType,
    count: publicationTypes[pubType],
  }));

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
      field: "title",
      headerName: "Title",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "author",
      headerName: "Author",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "pubType",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "citedBy",
      headerName: "Total Cited By",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
{/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header authData={authData} subtitle="Welcome to your profile" />
      </Box>



{/* GRID & CHARTS */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
{/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" fontWeight="600" sx={{ padding: "0px 30px 0 0px" }}>
            {authData.authorTotCite}
          </Typography>

          <Typography variant="h4" color={colors.greenAccent[600]}>
            Total Citation
          </Typography>
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" fontWeight="600" sx={{ padding: "0px 30px 0 0px" }}>
            {authData.authorHindex}
          </Typography>

          <Typography variant="h4" color={colors.greenAccent[600]}>
            h-Index
          </Typography>
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" fontWeight="600" sx={{ padding: "0px 30px 0 0px" }}>
            {authData.authorI10index}
          </Typography>

          <Typography variant="h4" color={colors.greenAccent[600]}>
            i10-Index
          </Typography>
        </Box>

{/* ROW 2 */}
        <Box gridColumn="span 6" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Box
            id="chart-container"
            gridColumn="span 6"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            overflow="auto"
          >
              <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ padding: "30px 30px 10px 30px" }}
              >
                Author Cite Per Year
              </Typography>
              </Box>
              <Box>
              </Box>
            </Box>
            <Box height="250px" mt="-20px">
              <ResponsiveBar
                data={data}
                keys={["citations"]}
                indexBy="year"
                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: "set2" }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Year",
                  legendPosition: "middle",
                  legendOffset: 40,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Citations",
                  legendPosition: "middle",
                  legendOffset: -50,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
              />
            </Box>
        </Box>
        <Box gridColumn="span 6" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 10px 30px" }}>
            Publication Type
          </Typography>
          <Box height="250px" mt="-20px">
            <ResponsiveBar
              data={publicationTypeData}
              keys={["count"]}
              indexBy="pubType"
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: "set2" }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Publication Type",
                legendPosition: "middle",
                legendOffset: 40,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Count",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
            />
          </Box>
        </Box>


{/* ROW 3 */}





      <Box
        gridColumn="span 12"
        gridRow="span 4"
        backgroundColor={colors.primary[400]}
        p="30px"
        overflow="auto"
      >
      <Typography variant="h5" fontWeight="600">
        List of Publications
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="20px"
        alignItems="center"
        borderBottom={`4px solid ${colors.primary[500]}`}
        p="15px"
      >
        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="30px">
          <Typography variant="h5" fontWeight="600">
            TITLE
          </Typography>
        </Box>

        <Box gridColumn="span 2" backgroundColor={colors.primary[400]} p="30px">
          <Typography variant="h5" fontWeight="600">
            TYPE
          </Typography>
        </Box>

        <Box gridColumn="span 2" backgroundColor={colors.primary[400]} p="30px">
          <Typography variant="h5" fontWeight="600">
            CITED BY
          </Typography>
        </Box>

        <Box gridColumn="span 2" backgroundColor={colors.primary[400]} p="30px">
          <Typography variant="h5" fontWeight="600">
            DATE
          </Typography>
        </Box>
      </Box>



  {rows.map((publication, i) => {

const { title, author, pubType, citedBy, date, id } = publication;

return (
    <Box
    key={`${publication.title}-${i}`}
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gap="20px"
      alignItems="center"
      borderBottom={`4px solid ${colors.primary[500]}`}
      p="15px"
    >
      <Box gridColumn="span 6">
      <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
      {
        <Link
        to={"/publicationDetails/"+ id}
        // to={pubID ? "/publicationDetails/" + pubID : "/"}
        style={{
          textDecoration: 'none',
          color: colors.greenAccent[300],
          fontWeight: 'bold',
        }}
      >
      
        {title}
      </Link>
      },
      </Typography>

        <Typography color={colors.grey[100]}>
          {author}
        </Typography>
      </Box>

      <Box gridColumn="span 2" p="5px 10px" borderRadius="4px">
          {pubType}
      </Box>

      <Box gridColumn="span 2" color={colors.grey[100]}>
          {citedBy}
      </Box>

      <Box gridColumn="span 2" p="5px 10px" borderRadius="4px">
          {date}
      </Box>
    </Box>
)})}
    </Box>
      </Box>
    </Box>
  );
};

export default AuthorProfile;
