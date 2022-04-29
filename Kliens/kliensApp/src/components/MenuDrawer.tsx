import React, { useContext, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Link, useNavigate } from "react-router-dom";
import AccountMenu from "./AccountMenu";
import LoggedInContext from "../utils/context";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function MenuDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { isLoggedIn, setLoggedIn } = useContext(LoggedInContext);
  const { position, setPosition } = useContext(LoggedInContext);

  const handleDrawer = () => {
    if (open == true) setOpen(false);
    else setOpen(true);
    console.log(open);
  };


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 /*, ...(open && { display: 'none' })*/ }}
          >
            {"Beosztás: " + (position != "" ? position : "---")}
          </Typography>
          {isLoggedIn ? (
            <AccountMenu />
          ) : (
            <Button
              color="inherit"
              sx={{ display: "flex" }}
              component={Link}
              to="/login"
            >
              Belépés
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          {
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Menü
            </Typography>
          }
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            sx={{ mr: 2 /*...(open && { display: 'none' })*/ }}
          >
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />

          { //Beosztastol fuggoen jeleniti meg az egyes oldalakra vezeto linkeket
            {
              Operator: (
                <>
                  <ListItem button component={Link} to="/home">
                    <ListItemText primary="Kezdőoldal" />
                  </ListItem>

                  <ListItem button component={Link} to="/degrees">
                    <ListItemText primary="Végzettségek" />
                  </ListItem>

                  <ListItem button component={Link} to="/tasks">
                    <ListItemText primary="Feladatok" />
                  </ListItem>
                </>
              ),
              Repairer: (
                <>
                  <List>
                    <ListItem button component={Link} to="/home">
                      <ListItemText primary="Kezdőoldal" />
                    </ListItem>

                    <ListItem button component={Link} to="/tasks">
                      <ListItemText primary="Feladatok" />
                    </ListItem>
                  </List>
                </>
              ),
              DeviceCorrespondent: (
                <>
                  <List>
                    <ListItem button component={Link} to="/home">
                      <ListItemText primary="Kezdőoldal" />
                    </ListItem>

                    <ListItem button component={Link} to="/categories">
                      <ListItemText primary="Kategóriák" />
                    </ListItem>

                    <ListItem button component={Link} to="/devices">
                      <ListItemText primary="Eszközök" />
                    </ListItem>
                  </List>
                </>
              ),
            }[position!]
          }

        {/* <Divider /> */}
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <div className="App"></div>
      </Main>
    </Box>
  );
}
