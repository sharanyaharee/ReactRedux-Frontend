import * as React from "react";
import { useState, useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";

const Profile = () => {
  const [uploadError, setUploadError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const userDetails = useSelector((store) => store.user.users);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
       dispatch(addUser(result))
      } catch (error) {
        console.error(error.message);
      }
    };

    if (token) {
      fetchUser();
    } else {
      navigate("/");
    }
  }, [navigate, token]);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreviewImage(imageUrl);
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();

      formData.append("profileImage", fileInputRef.current.files[0]);
      const response = await fetch(
        "http://localhost:5000/api/user/profileImage",
        {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        dispatch(addUser({ profileImage: URL.createObjectURL(fileInputRef.current.files[0]) }));
        setUploadError(null);
        setUploadSuccess("Profile Image changed successfully!");
        setTimeout(() => {
          setUploadSuccess(null);
        }, 3000);

        console.log("Profile image updated successfully");
      } else {
        setUploadError("Failed to update profile image");
      }
    } catch (error) {
      console.error("Error updating profile image:", error.message);
      setUploadError("Error updating profile image");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: 2,
        }}
      >
        <Paper elevation={3} square={false} sx={{ padding: 3 }}>
          {userDetails && (
            <>
              <Avatar
                alt="Profile Picture"
                src={
                  previewImage
                    ? previewImage
                    : userDetails.profileImage
                    ? `http://localhost:5000/${userDetails.profileImage}`
                    : ""
                }
                sx={{ width: 100, height: 100, margin: "auto" }}
              />
              <input
                accept="image/*"
                name="profileImage"
                style={{ display: "none" }}
                id="profile-picture-upload"
                type="file"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              <label htmlFor="profile-picture-upload">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => fileInputRef.current.click()}
                >
                  <PhotoCamera />
                </IconButton>
                <button onClick={ handleImageUpload}>
                  Upload
                </button>
              </label>
              {uploadError && (
                <Typography sx={{ color: "red !important" }}>
                  {uploadError}
                </Typography>
              )}

              {uploadSuccess && (
                <Typography sx={{ color: "green !important" }}>
                  {uploadSuccess}
                </Typography>
              )}
              <h3> Name: {userDetails.firstName} {userDetails.lastName}</h3>
              <h3>Email: {userDetails.email}</h3>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Profile;
