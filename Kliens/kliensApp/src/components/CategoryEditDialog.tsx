import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { MenuItem } from "@mui/material";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://127.0.0.1:5050");

let devicesOptions: { value: string; label: string }[] = [];


let ParentCategoryOptions: { value: string; label: string }[] = [];
let IntervalOptions: { value: string; label: string }[] = [];
let QualificationOptions: { value: string; label: string }[] = [];

async function FetchDataFromDB() {
  var mess = "scat";
  console.log(mess);
  client.send(mess);
}


export default function CategoryEditDialog(Data : any) {
    FetchDataFromDB();
    console.log(Data);
    ParentCategoryOptions = [];
    IntervalOptions = [];
    QualificationOptions = [];

    let idInput = Data.ID;
    let nameInput = Data.Name; 
    let parentInput = Data.ParentID;  
    let intervalInput = Data.Interval; 
    let specificationInput = Data.Specification; 
    let standardTInput = Data.StandardTime; 
    let qualificationInput = Data.RequredQualification; 
    for(let c in Data.CategoryList){
      ParentCategoryOptions.push({
        value: Data.CategoryList[c],
        label: Data.CategoryList[c] });
    };
    for(let i in Data.IntervalList){
      console.log("IntervalsIndex: "+i);
      IntervalOptions.push({
        value: Data.IntervalList[i],
        label: Data.IntervalList[i] });
    };
    for(let q in Data.QualificationList){
      QualificationOptions.push({
        value: Data.QualificationList[q],
        label: Data.QualificationList[q] });
    };
    
    
    /* for(let i in ParentCategoryOptions){
      console.log("ParentCategoryOptions: "+ParentCategoryOptions[i].value+"Labels: "+ParentCategoryOptions[i].label);
    };
    for(let i in IntervalOptions){
      console.log("Intervals: "+IntervalOptions[i].value+"Labels: "+IntervalOptions[i].label);
    };
    for(let i in QualificationOptions){
      console.log("QualificationOptions: "+QualificationOptions[i].value+"Labels: "+QualificationOptions[i].label);
    }; */
    

  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [selectedDevice, setSelectedDevice] = React.useState("");
  const [selectedDateTime, setSelectedDateTime] = React.useState(
    formatDate(new Date())
  );

  function padTo2Digits(num: number) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join("-") +
      "T" +
      [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes())].join(":")
    );
  }

  const handleSelectedDeviceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedDevice(event.target.value);
  };

  const handleSelectedDateTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedDateTime(formatDate(new Date(event.target.value)));
  };

  const handleFailureDescChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    console.log("cancelPopupDialog");
  };
  const saveDataToDB = () => {
    console.log("savePopupDialog");
    console.log(selectedDevice);
    console.log(selectedDateTime);
    console.log(description);

    setOpen(false);

    setDescription("");
    setSelectedDevice("");
    setSelectedDateTime(formatDate(new Date()));
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
        <EditIcon sx={{ mr: 1 }} />
        Részletek/Módosítás
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Kategória módosítása</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              id="outlined-multiline-flexible"
              label="Name"
              required
              margin="normal"
              fullWidth
              maxRows={1}
              value={nameInput}
              onChange={handleFailureDescChange}
            />
            <TextField
              id="outlined-select-currency"
              select
              required
              margin="normal"
              label="Parent Category"
              fullWidth
              value={parentInput}
              defaultValue={{ label: parentInput, value: parentInput }}
              onChange={handleSelectedDeviceChange}
            >
              {ParentCategoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="outlined-select-currency"
              select
              required
              margin="normal"
              label="Interval"
              fullWidth
              value={intervalInput}
              defaultValue={{ label: intervalInput, value: intervalInput }}
              onChange={handleSelectedDeviceChange}
            >
              {IntervalOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="outlined-multiline-flexible"
              label="Specification"
              required
              multiline
              margin="normal"
              fullWidth
              value={specificationInput}
              onChange={handleFailureDescChange}
            />
            <TextField
              id="outlined-multiline-flexible"
              label="StandardTime"
              required
              margin="normal"
              fullWidth
              maxRows={1}
              value={standardTInput}
              onChange={handleFailureDescChange}
            />    
            <TextField
              id="outlined-select-currency"
              select
              required
              margin="normal"
              label="Required Qualification"
              fullWidth
              value={qualificationInput}
              defaultValue={{ label: qualificationInput, value: qualificationInput }}
              onChange={handleSelectedDeviceChange}
            >
              {QualificationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Mégse</Button>
          <Button onClick={saveDataToDB}>Mentés</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
