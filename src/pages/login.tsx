import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom"; 

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { handleSubmit, control } = useForm<LoginForm>();
  const { login } = useAuth();

  const onSubmit = (data: LoginForm) => {
    login(data.username, data.password);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Email" type="email" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Password" type="password" fullWidth margin="normal" required />
          )}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Link to="/SignUp" style={{ color: "#1976d2", textDecoration: "none" }}>
          Signup here
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;


