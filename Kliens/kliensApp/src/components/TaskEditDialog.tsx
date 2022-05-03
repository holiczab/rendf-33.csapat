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

let DeviceOptions: { value: string, label: string }[] = [];
let ImportanceOptions: { value: string, label: string }[] = [{ value:"High", label: "High" }, { value:"Medium", label: "Medium" }, { value:"Low", label: "Low" }];
let StatusOptions: { value: string, label: string }[] = [
    { value:"New", label: "New" }, 
    { value:"Accepted", label: "Accepted" }, 
    { value:"Denied", label: "Denied" },
    { value:"Started", label: "Started" }, 
    { value:"Finished", label: "Finished" }];

export default function TaskEditDialog(Data: any) {
    DeviceOptions = [];

  const [open, setOpen] = React.useState(false);
  let ID = Data.ID;
  let TaskType = Data.Type;

  for (let c in Data.DevDeviceList) {
    DeviceOptions.push({
      value: Data.DevDeviceList[c].ID,
      label: Data.DevDeviceList[c].Name,
    });
    //console.log("Instr.: "+Data.DevDeviceList[c].Instruction);
  } 

  console.log("Device: "+Data.Device);

  
  const {
    register,
    getValues,
    reset,
    formState: { errors },
    formState,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: Data.Name,
      device: Data.DeviceID,
      status: Data.Status,
      instruction: Data.Instruction,
      importance: Data.Importance
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

    var mess =
      "umtt;" +
      ID +
      ";" +
      params.name +
      ";" +
      params.device +
      ";" +
      params.status +
      ";" +
      params.instruction  + "\n" + customInstruction +
      ";" +
      TaskType +
      ";" +
      params.importance;

    console.log(mess);  
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
        Modify
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Modify Task</DialogTitle>
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
              margin="normal"
              label="Device"
              fullWidth
              defaultValue={Data.DeviceID}
              {...register("device")}
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
              select
              margin="normal"
              label="Status"
              required
              fullWidth
              defaultValue={Data.Status}
              {...register("status", {
                required: true,
              })}
              error={errors.status}
              type="text"
            >
              {StatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Instruction"
              required
              multiline
              margin="normal"
              fullWidth
              {...register("instruction")}
              error={errors.name}
              type="text"
            />
            <TextField
              select
              margin="normal"
              label="Importance"
              required
              fullWidth
              defaultValue={Data.Importance}
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
