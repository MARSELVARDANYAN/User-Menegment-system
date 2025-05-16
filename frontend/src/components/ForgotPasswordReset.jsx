import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { forgotPasswordReset } from "../api/auth.api";

const ForgotPasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!password || !confirm) {
      alert("Please fill out both fields");
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await forgotPasswordReset(token, { password });
      alert(res.data.message || "Password reset successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <Container maxWidth="" sx={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ padding: 6, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom align="center">
          Reset Your Password
        </Typography>
        <Box display="flex" flexDirection="column" width={"500px"} gap={3}>
          <TextField
            type="password"
            label="New Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <TextField
            type="password"
            label="Confirm Password"
            variant="outlined"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="success" onClick={handleReset} fullWidth>
            Reset Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordReset;
