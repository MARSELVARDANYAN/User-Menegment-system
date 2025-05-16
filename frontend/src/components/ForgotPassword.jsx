// ForgotPassword.jsx

import { useState } from "react";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import { forgotPassword } from "../api/auth.api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    try {
      // Вызов API для сброса пароля
      await forgotPassword({ email });
      alert(`Password reset link sent to ${email}`);
    } catch (err) {
      alert("Error sending link", err);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Password recovery
        </Typography>

        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          onClick={handleSend}
        >
          Send link
        </Button>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
