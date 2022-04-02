import React, { useState } from "react";
import "./App.css";
import MenuDrawer from "./components/MenuDrawer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Degrees from "./pages/Degrees";
import Tools from "./pages/Tools";
import Login from "./pages/Login";
import LoggedInContext from "./utils/context";
import PageNotFound from "./pages/PageNotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Tasks from "./pages/Tasks";
import { routePermissions } from "./utils/routePermissions";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [position, setPosition] = useState("");

  return (
    <LoggedInContext.Provider
      value={{
        isLoggedIn,
        setLoggedIn,
        username,
        setUsername,
        position,
        setPosition,
      }}
    >
      <BrowserRouter>
        <MenuDrawer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="login" element={<Login />} />

          <Route
            path="home"
            element={
              <ProtectedRoute
                roles={ routePermissions.find(e => e.path === "home")!.roles }
                component={Home}
              />
            }
          />
          <Route
            path="categories"
            element={
              <ProtectedRoute
                roles={ routePermissions.find(e => e.path === "categories")!.roles }
                component={Categories}
              />
            }
          />
          <Route
            path="degrees"
            element={
              <ProtectedRoute
                roles={ routePermissions.find(e => e.path === "degrees")!.roles }
                component={Degrees}
              />
            }
          />
          <Route
            path="tools"
            element={
              <ProtectedRoute
                roles={ routePermissions.find(e => e.path === "tools")!.roles }
                component={Tools}
              />
            }
          />
          <Route
            path="tasks"
            element={
              <ProtectedRoute
                roles={ routePermissions.find(e => e.path === "tasks")!.roles }
                component={Tasks}
              />
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </LoggedInContext.Provider>
  );
}

export default App;
