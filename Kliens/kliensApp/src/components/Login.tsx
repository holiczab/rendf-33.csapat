import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    formState,
  } = useForm({ mode: "onChange" });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="Belepes">
      <Paper
        elevation={10}
        style={{
          backgroundColor: "#eeeeee",
          maxWidth: "50%",
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h1 className="title">Belépés</h1>

        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <TextField //Email
            required
            //onChange={(event) => setEmail(event.target.value)}
            className="Szoveg"
            id="outlined-basic"
            variant="outlined"
            label="E-mail cím"
            {...register("email", {
              required: true,
              validate: (input) => isEmail(input),
            })}
            type="email"
            autoComplete="email"
            error={errors.email}
            helperText={errors.email && "Helytelen e-mail cím formátum!"}
            sx={{ width: 350 }}
          />
          <br></br>
          <br></br>

          <TextField //Jelszó
            required
            //onChange={(event) => setPassword(event.target.value)}
            className="Szoveg"
            id="outlined-password-input"
            variant="outlined"
            label="Jelszó"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: true,
              minLength: 6,
              maxLength: 20,
            })}
            error={errors.password}
            helperText={
              errors.password &&
              "A jelszó minimum 6, maximum 20 karakter hosszú lehet!"
            }
            sx={{ width: 350 }}
          />
        </form>
        <br></br>
        <br></br>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!formState.isValid}
          onClick={() => console.log(getValues())}
        >
          Belépés
        </Button>
        <br></br>
        <br></br>

        <h1 style={{ color: "red" }}>{errorMessage}</h1>
        <br></br>
      </Paper>
    </div>
  );
}

export default Login;
