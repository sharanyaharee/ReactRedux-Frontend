import Dashboard from '../components/dashboard/Dashboard'
import React from 'react'
import Container from "@mui/material/Container";

const HomePage = () => {
  return (
    <div>
        <Dashboard/>
        <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h1>Home page</h1>
      </Container>
      
    </div>
  )
}

export default HomePage
