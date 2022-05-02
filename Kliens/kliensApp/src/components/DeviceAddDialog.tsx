import * as React from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { MenuItem } from "@mui/material";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useForm } from "react-hook-form";

const client = new W3CWebSocket("ws://127.0.0.1:5050");

let CategoryOptions: { value: string; label: string }[] = [];
let LocationOptions: { value: string; label: string }[] = [];

export default function DeviceAddDialog(Data: any) {
  CategoryOptions = [];
  LocationOptions = [];

  for (let c in Data.DevCategoryList) {
    CategoryOptions.push({
      value: Data.DevCategoryList[c].ID,
      label: Data.DevCategoryList[c].Name
    });
  }

  for (let c in Data.LocationList) {
    LocationOptions.push({
      value: Data.LocationList[c],
      label: Data.LocationList[c]
    });
  }

  const [open, setOpen] = React.useState(false);

  const {
    register,
    getValues,
    reset,
    formState: { errors },
    formState,
  } = useForm({ mode: "onChange" });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    //console.log("cancelPopupDialog");
    reset();
  };

  const saveDataToDB = (params: any) => {
    //console.log("savePopupDialog");
    var mess = "advc;" +
      params.name + ";" +
      params.categoryID + ";" +
      params.description + ";" +
      params.location;
    
    client.send(mess);
    reset();
    Data.updateFunction();
    setOpen(false);
  };

  useEffect(() => {
    //HA sikerese a kapcsolat, és HA üzenet érkezik a szervertől
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
  }, []);

  return (
    <div>
      <Fab
        variant="extended"
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
        sx={{ m: 1 }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Add new Device</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off">
            <TextField
              label="Name"
              required
              margin="normal"
              fullWidth
              maxRows={1}
              {...register("name", {
                required: true,
                minLength: 3,
              })}
              error={errors.name}
              helperText={errors.name && "Minimum 3 character!"}
              type="text"
            />
            <TextField
              select
              required
              margin="normal"
              label="Category"
              fullWidth
              {...register("categoryID", {
                required: true,
              })}
              error={errors.categoryID}
              type="text"
            >
              {CategoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Description"
              multiline
              margin="normal"
              required
              fullWidth
              {...register("description", {
                required: true,
                minLength: 10,
              })}
              error={errors.description}
              helperText={errors.description && "Minimum 10 character!"}
              type="text"
            />
            <TextField
              select
              margin="normal"
              label="Location"
              required
              fullWidth
              {...register("location", {
                required: true,
              })}
              error={errors.location}
              type="text"
            >
              {LocationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={!formState.isValid}
            onClick={() => saveDataToDB(getValues())}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
