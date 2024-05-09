import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../../utils/userSlice';

const defaultTheme = createTheme();



const login = () => {

const [error,setError] = useState('')
const [emailError,setEmailError] = useState('')
const[formData,setFormData] = useState({
    email:'',
    password:''
})
const navigate = useNavigate()
const dispatch = useDispatch()

const handleInputChange=(event)=>{
    const {name,value} = event.target;
    setFormData({...formData,
    [name]:value
})

}

    const handleSubmit = async(event) => {
        event.preventDefault();
        if (!formData.email.trim()) {
          setEmailError('Email is required');
          return;
        } else {
          setEmailError('');
        }
      
        if (!formData.password.trim()) {
          setError('Password is required');
          return;
        } else {
          setError('');
        }
        try{
            const response = await fetch("http://localhost:5000/auth/login",
            {method:"POST",  
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(formData)

            }
        )
        const result = await response.json();
    
        if(result.user._id){
            navigate('/home');
            dispatch(addUser(result.user))
            console.log(result.user)

            const user = JSON.stringify(result.user);
            localStorage.setItem("user",user);
            localStorage.setItem("token",result.token)
            
        }else{
            console.log("Login Failed")
            setError("Login Failed")
        }

        }catch(error){
            console.error(error.message)
            setError("User doesn't Exist")
        }
      };
    
  return (
    <div>
    
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              
            />
            {emailError && <Typography color="error">{emailError}</Typography>}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              
            />
              {error && (
  <Typography sx={{ color: 'red !important' }}>
    {error}
  </Typography>
)}
   
            <Button
            onClick={handleSubmit}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
               
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
                <br/>
                <Link href="/adminLogin" variant="body2">
                  {"Admin? Login"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>


    </div>
  )
}

export default login
