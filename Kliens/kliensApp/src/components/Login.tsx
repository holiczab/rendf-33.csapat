import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import isEmail, { IsEmailOptions } from "validator/lib/isEmail";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useNavigate } from "react-router-dom";
import LoggedInContext from "../contexts/context";

const client = new W3CWebSocket("ws://127.0.0.1:5050");

function SendLoginToServer(params: any) {
  // Elküldi a szervernek az adatokat
  console.log(params);
  var mess = "pwd;" + params.email.split("@")[0] + ";" + params.password;
  //client.send(JSON.stringify({ type: "message", msg: mess }));
  client.send(mess);
  console.log(mess);
}

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { isLoggedIn, setLoggedIn } = useContext(LoggedInContext);
  const { username, setUsername } = useContext(LoggedInContext);

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

  React.useEffect(
    // HA sikerese a kapcsolat, és HA üzenet érkezik a szervertől
    () => {
      client.onopen = () => {
        console.log("WebSocket Client Connected");
      };
      client.onmessage = (message: any) => {
        console.log(message.data);
        if (message.data.split(";")[0] === "Username-Password correct") {
          //belepesi allapot kezelese
          setLoggedIn(true);
          setUsername(message.data.split(";")[1]);
          navigate("/");
        } else if (
          message.data.split(";")[0] === "Username-Password incorrect"
        ) {
          //TODO: Felugro ablak helye
          setErrorMessage("Helytelen belépési adatok!");
          console.log("Helytelen belepesi adatok!");
        }
      };
    },
    []
  );

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
        <p>belepve: {String(isLoggedIn)}</p>

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
          onClick={() => SendLoginToServer(getValues())} //A függvény elküldi a szervernek
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
