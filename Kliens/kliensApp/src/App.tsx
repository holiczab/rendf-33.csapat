import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import MenuDrawer from "./components/MenuDrawer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import Home from "./components/Home";
import Categories from "./components/Categories";
import Degrees from "./components/Degrees";
import Tools from "./components/Tools";
import Login from "./components/Login";
import LoggedInContext from "./contexts/context";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [position, setPosition] = useState("");

  return (
    <LoggedInContext.Provider
      value={{ isLoggedIn, setLoggedIn, username, setUsername, position, setPosition }}
    >
      <BrowserRouter>
        <MenuDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          {isLoggedIn ? (
            <>
              <Route path="categories" element={<Categories />} />
              <Route path="degrees" element={<Degrees />} />
              <Route path="tools" element={<Tools />} />
            </>
          ) : (
            <Route path="login" element={<Login />} />
          )}
        </Routes>
      </BrowserRouter>
    </LoggedInContext.Provider>
  );
}

export default App;
