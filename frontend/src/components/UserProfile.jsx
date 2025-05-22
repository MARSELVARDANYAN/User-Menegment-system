import React, { useState } from "react";
import {
  Box,
  Container,
  Avatar,
  Typography,
  Paper,
  Divider,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Lock as StatusIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  Upload,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { deleteUserById, updateUserById } from "../api/users.api";

const UserProfile = ({ user }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();

  if (!user) return null;

  const initEditData = () => {
    setEditData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
    setOpenEditModal(true);
    setError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("email", editData.email);
      formData.append("phone", editData.phone);

      if (avatar instanceof File) {
        formData.append("file", avatar);
      } else if (avatar === null && user.avatar) {
        formData.append("removeAvatar", "true");
      }

      await updateUserById(user._id, formData);
      setOpenEditModal(false);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      setAvatar(file);
    };
  const viewUsers = () => {
    navigate("/allUsers-table");
  };

  const deleteMe = async (us) => {
    try {
      await deleteUserById(us._id);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, position: "relative" }}>
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

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
          position: "relative",
        }}
      >
        <Stack direction="row" spacing={4} alignItems="center" sx={{ mb: 4 }}>
          <Avatar
            src={user.avatar?.data}
            sx={{
              width: 120,
              height: 120,
              fontSize: 48,
              border: "3px solid",
              borderColor: "primary.main",
            }}
          >
            {user.name?.charAt(0) || "U"}
          </Avatar>

          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {user.name || "No name"}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Chip
                label={user.role.toUpperCase()}
                color={
                  user.role === "admin"
                    ? "primary"
                    : user.role === "editor"
                    ? "secondary"
                    : "default"
                }
                size="medium"
                sx={{ fontWeight: "bold" }}
              />

              <Chip
                icon={<StatusIcon />}
                label={user.status === "active" ? "ACTIVE" : "INACTIVE"}
                color={user.status === "active" ? "success" : "error"}
                variant="outlined"
                size="medium"
              />
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main",
                mb: 2,
              }}
            >
              <PersonIcon sx={{ mr: 1 }} />
              Personal Information
            </Typography>

            <List dense>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={user.email || "Not specified"}
                  secondaryTypographyProps={{ sx: { wordBreak: "break-all" } }}
                />
              </ListItem>

              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={user.phone || "Not specified"}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main",
                mb: 2,
              }}
            >
              <CalendarIcon sx={{ mr: 1 }} />
              Account Information
            </Typography>

            <List dense>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Account Created"
                  secondary={new Date(user.createdAt).toLocaleDateString()}
                />
              </ListItem>

              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Last Updated"
                  secondary={new Date(user.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<EditIcon />}
            onClick={initEditData}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            Edit Profile
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<ViewIcon />}
            onClick={viewUsers}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            View Users
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => deleteMe(user)}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Edit Profile
          </Typography>
          <IconButton onClick={() => setOpenEditModal(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={editData.name || ""}
                onChange={handleEditChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editData.email || ""}
                onChange={handleEditChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editData.phone || ""}
                onChange={handleEditChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Upload Avatar
              </Typography>

              <Button variant="outlined" component="label">
                Upload Avatar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Button>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {avatar && (
                  <Chip
                    label={avatar.name}
                    onDelete={() => setAvatar(null)}
                    color="primary"
                    deleteIcon={<CloseIcon />}
                  />
                )}
                {user.avatar && !avatar && (
                  <Chip
                    label="Remove Avatar"
                    onDelete={() => setAvatar(null)}
                    color="error"
                    deleteIcon={<CloseIcon />}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {/* Cancel edit button*/}
          <Button
            onClick={() => setOpenEditModal(false)}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
