import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  deleteAdminAvatar,
  getAdminById,
  updateAdminProfile,
} from "../../api/admin.api.js";

const AdminInfoCard = ({ adminId }) => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await getAdminById(adminId);
        const data = response.data;

        if (data.avatar?.data && !data.avatar.data.startsWith("data:")) {
          data.avatar.data = `data:${data.avatar.mimetype};base64,${data.avatar.data}`;
        }
        setAdminData(data);
        setOriginalData(data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
  }, [adminId]);

  const handleCancelEdit = () => {
    setAdminData(originalData); 
    setEditMode(false);
    setNewAvatar(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAdminData((prev) => ({
        ...prev,
        avatar: { data: reader.result },
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAdminAvatar(adminId);
      setAdminData((prev) => ({ ...prev, avatar: null }));
    } catch (err) {
      console.error("Delete avatar failed", err);
    }
  };

  const handleSave = async () => {
  try {
    const formData = new FormData();
    formData.append("name", adminData.name);
    formData.append("phone", adminData.phone);
    if (newAvatar) {
      formData.append("file", newAvatar);
    }

    const response = await updateAdminProfile(adminId, formData);
    setAdminData(response.data);
    setOriginalData(response.data); 
    setEditMode(false);
    setNewAvatar(null);
  } catch (err) {
    console.error("Update failed", err);
  }
};

  return (
    <Card elevation={3} sx={{ display: "flex", p: 2, mb: 4 }}>
      <Avatar
        variant="square"
        src={adminData.avatar?.data}
        sx={{
          width: 120,
          height: 120,
          fontSize: 48,
          boxShadow: 3,
          borderRadius: 2, 
          border: "3px solid",
          bgcolor: "background.paper",
          color: "text.primary",
          overflow: "hidden",
        }}
      >
        {adminData.name?.charAt(0).toUpperCase() || "U"}
      </Avatar>

      <CardContent sx={{ flex: 1 }}>
        {editMode ? (
          <>
            <TextField
              label="Name"
              value={adminData.name}
              onChange={(e) =>
                setAdminData({ ...adminData, name: e.target.value })
              }
              fullWidth
              sx={{ mb: 1 }}
            />
            <TextField
              label="Phone"
              value={adminData.phone}
              onChange={(e) =>
                setAdminData({ ...adminData, phone: e.target.value })
              }
              fullWidth
              sx={{ mb: 1 }}
            />
            <Button variant="outlined" component="label">
              Upload Avatar
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteAvatar}
              sx={{ ml: 2 }}
            >
              Delete Avatar
            </Button>

            <Box mt={2} display="flex" gap={2}>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6">{adminData.name}</Typography>
            <Typography color="textSecondary">{adminData.email}</Typography>
            <Typography color="textSecondary">📞 {adminData.phone}</Typography>
          </>
        )}
      </CardContent>
      {!editMode && (
        <IconButton
          onClick={() => setEditMode(true)}
          sx={{ alignSelf: "start" }}
        >
          <EditIcon />
        </IconButton>
      )}
    </Card>
  );
};

export default AdminInfoCard;
