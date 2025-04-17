import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const { handleSubmit, control } = useForm<SignupForm>();
  const { signup } = useAuth();

  const onSubmit = (data: SignupForm) => {
    signup(data.name, data.email, data.password);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        SignUp
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Name" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="email"
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
                SignUp
              </Button>
      </form>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/login">
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUp;




