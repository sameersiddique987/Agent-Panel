import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

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
            <TextField {...field} label="Username" fullWidth margin="normal" required />
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
    </Box>
  );
};

export default Login;