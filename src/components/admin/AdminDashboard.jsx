import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { fetchAllUsers } from "../../utils/adminSlice";
import { useDispatch ,useSelector} from "react-redux";

const defaultTheme = createTheme();

const FullWidthAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));


export default function adminDashboard() {
  const userDetails = useSelector((store) => store.admin.users);
  console.log(">>>>>>>>>>>>>>>>>>", userDetails)
  const dispatch = useDispatch();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});

  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = useState([]);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/admin/users",

          { method: "GET" }
        );

        
        const result = await response.json();
        console.log(result)
        dispatch(fetchAllUsers(result))
        setUsers(result)
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");

    if (!adminLoggedIn) {
      navigate("/adminLogin");
    }
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      return (
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    dispatch(fetchAllUsers(filtered))
  }, [searchQuery, users]);

  const handleSearch = (event) => {
    const query = event.target.value.trim();
    setSearchQuery(query);

    if (query === "") {
      dispatch(fetchAllUsers(""))
    } else {
      const filtered = users.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(query.toLowerCase()) ||
          user.lastName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
        );
      });
      dispatch(fetchAllUsers(filtered))
    }
  };
  const handleEdit = (user) => {
    setOpenEditModal(true);
    setEditedUserData(user);
  };
  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/users/${editedUserData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUserData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      setOpenEditModal(false);
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => {
          if (user._id === editedUserData._id) {
            return editedUserData;
          } else {
            return user;
          }
        });
        return updatedUsers;
      });
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleAddUser = (user) => {
    setOpenAddModal(true);
    setError("");
  };

  const handleFirstNameChange = (event) => {
    const value = event.target.value;
    if (/^[a-zA-Z]*$/.test(value) || value === "") {
      setNewUserFirstName(value);
      setFirstNameError("");
    } else {
      setFirstNameError("Only alphabets are allowed");
    }
  };

  const handleLastNameChange = (event) => {
    const value = event.target.value;
    if (/^[a-zA-Z]*$/.test(value) || value === "") {
      setNewUserLastName(value);
      setLastNameError("");
    } else {
      setLastNameError("Only alphabets are allowed");
    }
  };
  const handleEmailChange = (event) => {
    const value = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value) || value === "") {
      setEmailError("");
    } else {
      setEmailError("Invalid email format");
    }

    setNewUserEmail(value);
  };
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setNewUserPassword(newPassword);

    if (newPassword !== confirmPassword) {
      setPasswordError("*Password and confirm password should match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const newPassword = event.target.value;
    setConfirmPassword(newPassword);

    if (newPassword !== newUserPassword) {
      setPasswordError("*Password and confirm password should match");
    } else {
      setPasswordError("");
    }
  };
  const handleAddUserSubmit = async () => {
    try {
      if (
        !newUserFirstName ||
        !newUserLastName ||
        !newUserEmail ||
        !newUserPassword
      ) {
        setError("Please fill user data to add");
      } else {
        setError(" ");
      }
      const newUser = {
        firstName: newUserFirstName,
        lastName: newUserLastName,
        email: newUserEmail,
        password: newUserPassword,
      };
      const response = await fetch("http://localhost:5000/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.status === 200) {
        const data = await response.json();
        const addedUser = data.user;

        setUsers((prevUsers) => [...prevUsers, addedUser]);
        setNewUserFirstName("");
        setNewUserLastName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setConfirmPassword("");
        setOpenAddModal(false);
      } else {
        throw new Error("Failed to add user");
      }
    } catch (error) {
      if (error.message === "Failed to add user") {
        setError("User already Exist");
        setNewUserFirstName("");
        setNewUserLastName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setConfirmPassword("");
      }
      console.error("Failed to add user:", error.message);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/adminLogin");
  };
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <FullWidthAppBar position="absolute">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>
              <TextField
                label="Search"
                value={searchQuery}
                onChange={handleSearch}
                variant="outlined"
                margin="dense"
                sx={{ backgroundColor: "#FFFFFF" }}
              />
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Toolbar>
          </FullWidthAppBar>

          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h3" component="h2">
                  User Management
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddUser}
                >
                  Add User
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userDetails &&
                      userDetails.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user.firstName}</TableCell>
                          <TableCell>{user.lastName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex" }}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleEdit(user)}
                              >
                                Edit
                              </Button>
                              <Box sx={{ marginLeft: 1 }}>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => handleDelete(user._id)}
                                >
                                  Delete
                                </Button>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
      // Modal component
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={editedUserData.firstName}
            onChange={(e) =>
              setEditedUserData({
                ...editedUserData,
                firstName: e.target.value,
              })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Last Name"
            value={editedUserData.lastName}
            onChange={(e) =>
              setEditedUserData({ ...editedUserData, lastName: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Email"
            value={editedUserData.email}
            onChange={(e) =>
              setEditedUserData({ ...editedUserData, email: e.target.value })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      //Add modal
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={newUserFirstName}
            onChange={handleFirstNameChange}
            error={Boolean(firstNameError)}
            helperText={firstNameError}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={newUserLastName}
            onChange={handleLastNameChange}
            error={Boolean(lastNameError)}
            helperText={lastNameError}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={newUserEmail}
            onChange={handleEmailChange}
            error={Boolean(emailError)}
            helperText={emailError}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={newUserPassword}
            onChange={handlePasswordChange}
            helperText={passwordError}
            error={Boolean(passwordError)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            helperText={passwordError}
            error={Boolean(passwordError)}
            fullWidth
            margin="normal"
          />
          {error && (
            <Typography sx={{ color: "red !important" }}>{error}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddUserSubmit} color="primary">
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
