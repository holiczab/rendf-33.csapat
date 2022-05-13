import React, { useContext, useState } from "react";
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
import LoggedInContext from "../utils/context";
import AutoTaskInstructionsDialog from "./AutoTaskInstructionsDialog";
import ReactDOM from "react-dom";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const client = new W3CWebSocket("ws://127.0.0.1:5050");

async function FetchDataFromDB(DeviceIDAssignTo : string) {
    var mess = "sspecwithqual;"+DeviceIDAssignTo;
    console.log(mess);
    client.send(mess);
}

let RepairerOptions: { value: string; label: string }[] = [];

export default function TaskAssignTo(Data: any) {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    getValues,
    reset,
    formState: { errors },
    formState,
  } = useForm({
    mode: "onChange"
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    Data.resetSelection();
  };

  const saveDataToDB = (params: any) => {
    //console.log("savePopupDialog");

    var mess = "ustatus;as;"+Data.ID+";"+ params.repairer;
      
    console.log(mess);
    client.send(mess);
    reset();
    Data.updateFunction();
    setOpen(false);
  };

  React.useEffect(
    // HA elso betoltes
    () => {
      FetchDataFromDB(Data.DeviceID);
      //GetLocationsFromDB()
    },
    []
  );

  useEffect(() => {
    //HA sikerese a kapcsolat, és HA üzenet érkezik a szervertől
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message: any) => {
        console.log("SQL answer: "+message.data);
        RepairerOptions = [];

        let SplittedMessage = message.data.split("END_OF_ROW");
        SplittedMessage.splice(-1, 1);

        console.log("Splitted Length: " + SplittedMessage[0].split(";").length);

        for (let Row in SplittedMessage) {
            let SplittedRow = SplittedMessage[Row].split(";");

            RepairerOptions.push({
                value: SplittedRow[0],
                label: SplittedRow[1]
            });
            console.log("RepairerOptions.push: value: "+RepairerOptions[0].value+" label: "+RepairerOptions[0].label);
                        
          }

      };
  }, []);

  return (
    <div id="editDialog">
      <Fab
        variant="extended"
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
        sx={{ m: 1 }}
      >
        <AssignmentIndIcon sx={{ mr: 1 }} />
        Assign
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Assign Task to:</DialogTitle>
            <DialogContent>
              <form noValidate autoComplete="off">
                
                <TextField
                  select
                  margin="normal"
                  label="Repairer"
                  fullWidth
                  {...register("repairer")}
                  error={errors.repairer}
                  type="text"
                >
                  {RepairerOptions.map((option) => (
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
            onClick={() => {saveDataToDB(getValues());}}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
