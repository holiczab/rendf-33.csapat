import React from "react";
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

let DeviceOptions: { value: string; label: string }[] = [];
let ImportanceOptions: { value: string; label: string }[] = [{ value:"High", label: "High" }, { value:"Medium", label: "Medium" }, { value:"Low", label: "Low" }];

export default function TaskAddDialog(Data: any) {
  
  DeviceOptions = [];
  const [open, setOpen] = React.useState(false);
  let ID = Data.ID;

  for (let c in Data.DevDeviceList) {
    DeviceOptions.push({
      value: Data.DevDeviceList[c].ID,
      label: Data.DevDeviceList[c].Name,
    });
    //console.log("Instr.: "+Data.DevDeviceList[c].Instruction);
  } 

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
    let customInstruction = "";
    for(let i in Data.DevDeviceList){
      if(Data.DevDeviceList[i].ID === params.device){
        customInstruction = Data.DevDeviceList[i].Instruction;
      }
    }
    var mess = "amtt;" +
      params.name + ";" +
      params.device + ";" +
      "New" + ";" + //params.status
      params.instruction + "\n" + customInstruction + ";" +
      "0" + ";" +  //params.type
      params.importance;
    //console.log(mess);
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
        sx={{ m: 1, display:  Data.isOperator ? "" : "none"  }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Add new Task</DialogTitle>
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
              label="Device"
              fullWidth
              {...register("device", {
                required: true,
              })}
              error={errors.device}
              type="text"
            >
              {DeviceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Instruction"
              multiline
              margin="normal"
              required
              fullWidth
              {...register("instruction", {
              })}
              error={errors.instruction}
              type="text"
            />
            <TextField
              select
              margin="normal"
              label="Importance"
              required
              fullWidth
              {...register("importance", {
                required: true,
              })}
              error={errors.importance}
              type="text"
            >
              {ImportanceOptions.map((option) => (
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
