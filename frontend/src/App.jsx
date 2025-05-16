// App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Login from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ForgotPasswordReset from "./components/ForgotPasswordReset.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import AdminUserTable from "./components/AdminUserTable.jsx";
import AllUserTable from "./components/AllUserTable.jsx";

const theme = createTheme({
  palette: {
    background: {
      default: "linear-gradient(135deg,rgb(240, 241, 243) 0%, #e4e8f0 100%)",
      paper: "#ffffff",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(60deg,rgb(186, 232, 118) 0%,rgb(95, 175, 240) 100%)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          margin: "50px",
          padding: "4px",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminHome" element={<AdminHomePage />} />
          <Route path="/userHome" element={<UserProfilePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/forgot-password-reset"
            element={<ForgotPasswordReset />}
          />
          <Route path="/users-table" element={<AdminUserTable />} />
          <Route path="/allUsers-table" element={<AllUserTable />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
