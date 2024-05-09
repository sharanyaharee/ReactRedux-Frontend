import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./components/register/Register.jsx";
import Login from "./components/login/Login.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import HomePage from './pages/HomePage.jsx'
import Error from './components/Error/Error.jsx'
import AdminSignIn from './components/admin/AdminSignIn.jsx'
import AdminPage from "./pages/AdminPage.jsx";
import { Provider } from "react-redux";
import appStore from "./utils/appStore.js";


const appRouter = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
    errorElement: <Error/>
  },
  {
    path: "/",
    element: <Login />,
    errorElement: <Error/>
  },
  {
    path: "/home",
    element:<HomePage/>,
    errorElement: <Error/>
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    errorElement: <Error/>
  },
  {
    path: "/adminLogin",
    element: <AdminSignIn/>,
    errorElement: <Error/>
  },
  {
    path: "/adminPage",
    element: <AdminPage/>,
    errorElement: <Error/>
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
<Provider store={appStore}>
  <React.StrictMode>
    <RouterProvider router={appRouter}>
      <App />
    </RouterProvider>
  </React.StrictMode>
  </Provider>

);
