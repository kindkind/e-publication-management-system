import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Grid, Paper, Button } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";
import { ResponsiveBar } from "@nivo/bar";
import Header from "../../components/Header";

const PublicationDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [publication, setPublication] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/publication/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPublication(data);
        } else {
          console.error("Error fetching publication details:", response.status);
        }
      } catch (error) {
        console.error("Error fetching publication details:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!publication) {
    return <Typography>Loading...</Typography>; // Display a loading indicator while waiting for the data to load
  }

  const pubData = publication[0];
  const currentYear = new Date().getFullYear();
  const pubCitePerYear = JSON.parse(pubData.pubCitePerYear);
  const data = pubCitePerYear.map((count, index) => ({
    year: currentYear - pubCitePerYear.length + index + 1,
    citations: count,
  }));

  return (
    <Box m="20px">
{/* HEADER */}

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header pubData={pubData} />
        </Box>

      {/* <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Article Title: {pubData.pubTitle}</Typography>
      </Box> */}

{/* GRID */}
      <Grid container spacing={2}>
{/* ROW 1 */}
        <Grid item xs={3}>
          <Paper variant="outlined">
            <Box p={2} height={140} display="flex" alignItems="center" justifyContent="center">
              Author: {pubData.pubAuthors}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper variant="outlined">
            <Box p={2} height={140} display="flex" alignItems="center" justifyContent="center">
              Vol: {pubData.pubVol} , Issue: {pubData.pubIssue}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper variant="outlined">
            <Box p={2} height={140} display="flex" alignItems="center" justifyContent="center">
              Total Pages: {pubData.pubPages}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper variant="outlined">
            <Box p={2} height={140} display="flex" alignItems="center" justifyContent="center">
              Date: {pubData.pubDate}
            </Box>
          </Paper>
        </Grid>


{/* ROW 2 */}
        <Grid item xs={12}>
          <Paper variant="outlined">
            <Box p={2} height={280}>
              <Typography variant="subtitle1">Description</Typography>
              <Box mt={1} p={2} style={{ whiteSpace: "pre-line" }}>
                {pubData.pubDesc || "No description available"}
              </Box>
            </Box>
          </Paper>
        </Grid>

{/* ROW 3 */}
        <Grid item xs={6}>
          <Paper variant="outlined">
            <Box p={2} height={140} display="flex" alignItems="center" justifyContent="center">
              Total Cite: {pubData.pubTotCite}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper variant="outlined">
            <Box p={2} height={140} display="flex" alignItems="center" justifyContent="center">
              PubType: {pubData.pubType}
            </Box>
          </Paper>
        </Grid>

{/* ROW 4 */}
        <Grid item xs={12}>
          <Paper variant="outlined">
            <Box p={2} height={280}>
              <Typography variant="subtitle1">Pub Cite Per Year</Typography>
              <Box  height="250px" mt="-20px">
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
          </Paper>
        </Grid>

{/* ROW 5 */}
        <Grid item xs={6}>
          <Paper variant="outlined">
            <Box p={2} height={140} display="flex" alignItems="center" justifyContent="center">
              <Button variant="contained" color="primary" href={pubData.pubLink} target="_blank">
                Pub Link
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper variant="outlined">
            <Box p={2} height={140} display="flex" alignItems="center" justifyContent="center">
              <Button variant="contained" color="primary" href={pubData.pubSrc} target="_blank">
                Pub Source
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PublicationDetails;
