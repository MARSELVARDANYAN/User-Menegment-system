// import UserTable2 from '../components/UserTableWithDetails.jsx';
// import { useState, useEffect } from 'react';
// import { fetchAllUsers } from '../api/users.api.js';
// import { Container, Box, Typography } from '@mui/material';

// const UserManagementPage = () => {
//   const [users, setUsers] = useState([]);

//   // Загрузка пользователей
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetchAllUsers();
//         console.log(response.data);
//         setUsers(response.data);
//       } catch (err) {
//         console.error('Error fetching users:', err);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleDelete = async (userId) => {
//     try {
//       await deleteUser(userId);
//       setUsers(users.filter(user => user._id !== userId));
//     } catch (err) {
//       console.error('Error deleting user:', err);
//     }
//   };

//   const handleEdit = (user) => {
//     // Реализуйте логику редактирования
//     console.log('Edit user:', user);
//   };

//   const handleStatusToggle = async (userId) => {
//     try {
//       await toggleUserStatus(userId);
//       setUsers(users.map(user => 
//         user._id === userId ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
//       ));
//     } catch (err) {
//       console.error('Error toggling status:', err);
//     }
//   };

//   return (
//     <Container maxWidth="lg">
//       <Box my={4}>
//         <Typography variant="h4" gutterBottom>
//           User Management
//         </Typography>
//         <UserTable2
//           users={users}
//           onDelete={handleDelete}
//           onEdit={handleEdit}
//           onStatusToggle={handleStatusToggle}
//         />
//       </Box>
//     </Container>
//   );
// };

// export default UserManagementPage;