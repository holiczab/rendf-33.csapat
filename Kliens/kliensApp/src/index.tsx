import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import Home from "./components/Home";
import Categories from "./components/Categories";
import Degrees from "./components/Degrees";
import Tools from "./components/Tools";
import MenuDrawer from "./components/MenuDrawer";

ReactDOM.render(
  <BrowserRouter>
    <MenuDrawer />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="home" element={<Home />} />
      <Route path="categories" element={<Categories />} />
      <Route path="degrees" element={<Degrees />} />
      <Route path="tools" element={<Tools />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
