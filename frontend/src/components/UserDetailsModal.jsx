import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Typography,
  Button,
  Divider,
  Chip,
  Stack,
  Paper,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as RoleIcon,
  Lock as StatusIcon,
} from "@mui/icons-material";

const UserDetailsDialog = ({ user, open, onClose, onEdit }) => {
  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(145deg, #f5f7fa 0%, #e4e8f0 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          User Details
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 3 }}>
        <Stack
          direction="row"
          spacing={4}
          alignItems="flex-start"
          sx={{ mb: 3 }}
        >
          <Avatar
            variant="square"
            src={user.avatar?.data}
            sx={{
              width: 200,
              height: 200,
              fontSize: 48,
              boxShadow: 3,
              borderRadius: 2, // округление углов (мягкий квадрат)
              border: "3px solid",
              // borderColor: "primary.main",
              bgcolor: "background.paper",
              color: "text.primary",
              overflow: "hidden",
            }}
          >
            {user.name?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Stack spacing={1} flexGrow={1}>
            <Typography variant="h4" fontWeight="bold">
              {user.name || "No name"}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Chip
                icon={<RoleIcon />}
                label={user.role.toUpperCase()}
                color={
                  user.role === "admin"
                    ? "primary"
                    : user.role === "editor"
                    ? "secondary"
                    : "default"
                }
                size="medium"
              />

              <Chip
                icon={<StatusIcon />}
                label={user.status === "active" ? "ACTIVE" : "INACTIVE"}
                color={user.status === "active" ? "success" : "error"}
                variant="outlined"
                size="medium"
              />
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, height: "100%" }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "primary.main",
                }}
              >
                <PersonIcon sx={{ mr: 1 }} />
                Basic Information
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={user.email || "Not specified"}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={user.phone || "Not specified"}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <RoleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="User ID" secondary={user._id} />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, height: "100%" }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "primary.main",
                }}
              >
                <CalendarIcon sx={{ mr: 1 }} />
                Activity
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Created At"
                    secondary={new Date(user.createdAt).toLocaleString()}
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Updated At"
                    secondary={new Date(user.updatedAt).toLocaleString()}
                  />
                </ListItem>

                {user.lastLogin && (
                  <ListItem>
                    <ListItemText
                      primary="Last Login"
                      secondary={new Date(user.lastLogin).toLocaleString()}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
          }}
        >
          Close
        </Button>
        {localStorage.getItem("role") === "admin" && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              onEdit(user);
              onClose();
            }}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Edit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsDialog;
