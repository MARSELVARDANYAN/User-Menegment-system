import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { adminCreateUser } from "../api/admin.api";
import { useNavigate } from "react-router-dom";
import {
  Logout as LogoutIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";

const AdminHomePage = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleCreateUser = async () => {
    if (!email || !role) {
      alert("Please fill in all fields");
      return;
    }

    const user = await adminCreateUser({ email, role });
    console.log("Creating a user:", { email, role }, user);
    alert(`User with email: ${email} and role: ${role} created`);

    setEmail("");
    setRole("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleClick = () => {
    navigate("/users-table");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, position: "relative" }}>
      <Tooltip title="Logout" arrow>
        <IconButton
          onClick={handleLogout}
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            backgroundColor: "error.light",
            color: "white",
            "&:hover": {
              backgroundColor: "error.main",
            },
            boxShadow: 3,
            borderRadius: "50%",
            width: 48,
            height: 48,
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Tooltip>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        <Typography variant="body1" gutterBottom>
          Here you can create users and perform administrative tasks.
        </Typography>

        <Box display="flex" flexDirection="column" gap={2} mt={3}>
          <TextField
            label="User email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Role"
            variant="outlined"
            select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            color="success"
            fullWidth
            startIcon={<EditIcon />}
            onClick={handleCreateUser}
          >
            Create a user
          </Button>

          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<ViewIcon />}
              onClick={handleClick}
            >
              View users
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminHomePage;
