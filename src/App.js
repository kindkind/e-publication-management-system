import { useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Auth from "./scenes/auth";
import AuthorProfile from "./scenes/authorProfile";
import Publications from "./scenes/publications";
import PublicationDetails from "./scenes/publicationDetails";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const params = useParams();


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar}  />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Publications />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/publicationDetails/:id" element={<PublicationDetails />} />
              <Route path="/authorProfile/:authorID" element={<AuthorProfile authorID={params.authorID} />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
