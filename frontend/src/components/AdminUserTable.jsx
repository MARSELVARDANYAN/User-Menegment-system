import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  AppBar,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import {
  deleteUserById,
  updateUserById,
  getUsersByOption,
  toggleUserStatus,
} from "../api/users.api.js";
import { adminCreateUser } from "../api/admin.api.js";
import UserDetailsDialog from "./UserDetailsModal.jsx"; 
import { useNavigate } from "react-router-dom";

const AdminUserTable = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    role: "all",
  });
  const [detailsOpen, setDetailsOpen] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.status !== "all") params.status = filters.status;
        if (filters.role !== "all") params.role = filters.role;

        const response = await getUsersByOption({ params });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [filters]);

  const handleDelete = async (userId) => {
    try {
      await deleteUserById(userId);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleStatusToggle = async (userId) => {
    try {
      const response = await toggleUserStatus(userId);
      setUsers(
        users.map((user) => (user._id === userId ? response.data : user))
      );
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (currentUser._id) {
        const response = await updateUserById(currentUser._id, currentUser);
        setUsers(
          users.map((user) =>
            user._id === currentUser._id ? response.data : user
          )
        );
      } else {
        const response = await adminCreateUser(currentUser);
        setUsers([...users, response.data]);
      }
      setOpenDialog(false);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <CssBaseline />

      <AppBar position="static" elevation={1} color="default" >
        <Toolbar >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Management System
          </Typography>
          <Button
          style={{ marginRight: '10px' }}
            variant="contained"
            color="info"
            onClick={() => {
              navigate(-1)
            }}
          >
            back
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => {
              setCurrentUser({
                name: "",
                email: "",
                phone: "",
                role: "user",
                status: "inactive",
              });
              setOpenDialog(true);
            }}
          >
            Add User
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ flex: 1, py: 3, overflow: "auto" }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
                  }
                  label="Role"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 260px)" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "25%" }}>User</TableCell>
                  <TableCell sx={{ width: "20%" }}>Contact</TableCell>
                  <TableCell sx={{ width: "15%" }}>Role</TableCell>
                  <TableCell sx={{ width: "15%" }}>Status</TableCell>
                  <TableCell sx={{ width: "25%" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow hover key={user._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={user.avatar} sx={{ mr: 2 }}>
                          {user.name?.charAt(0) || "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {user.name || "No name"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>{user.phone || "No phone"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            user.role === "admin"
                              ? "primary.light"
                              : user.role === "editor"
                              ? "secondary.light"
                              : "grey.100",
                          color:
                            user.role === "admin"
                              ? "primary.dark"
                              : user.role === "editor"
                              ? "secondary.dark"
                              : "grey.800",
                        }}
                      >
                        {user.role}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            user.status === "active"
                              ? "success.light"
                              : "error.light",
                          color:
                            user.status === "active"
                              ? "success.dark"
                              : "error.dark",
                        }}
                      >
                        {user.status}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip title="View">
                          <IconButton
                            color="info"
                            sx={{ mr: 1 }}
                            onClick={() => handleView(user)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setCurrentUser(user);
                              setOpenDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            sx={{ mr: 1 }}
                            onClick={() => handleDelete(user._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Toggle Status">
                          <Switch
                            checked={user.status === "active"}
                            onChange={() => handleStatusToggle(user._id)}
                            color="success"
                          />
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentUser?._id ? "Edit User" : "Create New User"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={currentUser?.name || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                value={currentUser?.email || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={currentUser?.phone || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, phone: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={currentUser?.role || "user"}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, role: e.target.value })
                  }
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentUser?.status || "inactive"}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            color="success"
            onClick={handleSave}
            variant="contained"
            disabled={!currentUser?.email}
          >
            {currentUser?._id ? "Save Changes" : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>
      <UserDetailsDialog
        user={selectedUser}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onEdit={(user) => {
          setCurrentUser(user);
          setOpenDialog(true);
        }}
      />
    </Box>
  );
};

export default AdminUserTable;
