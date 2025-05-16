// Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { loginUser } from "../api/auth.api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser({ email, password });
      localStorage.setItem('token', user.data.user.token);
      localStorage.setItem('userId', user.data.user._id);
      localStorage.setItem('role', user.data.user.role)
      if(user.data.user.role === 'admin') {
        navigate("/adminHome");
      } else {
        navigate("/userHome");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="password"
            variant="outlined"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="success"
            sx={{ mt: 3, py: 1.5 }}
          >
            Login
          </Button>
          <Box mt={2} textAlign="center">
            <Link
              href="#"
              onClick={() => navigate("/forgot-password")}
              underline="hover"
            >
              Forgot your password?
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
