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
import AddIcon from '@mui/icons-material/Add';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { MenuItem } from "@mui/material";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useForm } from "react-hook-form";

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


export default function CategoryPopupDialog(Data : any) {
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
    for(let c in Data.ParentCategoryList){
      ParentCategoryOptions.push({
        value: Data.ParentCategoryList[c].ID,
        label: Data.ParentCategoryList[c].Name });
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

  const [open, setOpen] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>("");
  const [parentID, setParentID] = React.useState<string>("");
  const [interval, setSetInterval] = React.useState<string>("");
  const [specification, setSpecification] = React.useState<string>("");
  const [standardTime, setStandardTime] = React.useState<string>("");
  const [reqQualification, setReqQualification] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
    formState,
  } = useForm({ mode: "onChange" });

  const onSubmit = (data: any) => {
    console.log(data);
  };


  const handleFailureDescChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setName(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    console.log("cancelPopupDialog");
    reset();
  };
  const saveDataToDB = (params: any) => {
    console.log("savePopupDialog");
    
    var mess = "acat;" +
      params.name + ";" +
      params.parentID + ";" +
      params.interval + ";" +
      params.specification + ";" +
      params.standardTime + ";" +
      params.reqQualification;
    
    console.log(mess);
    client.send(mess);
    reset();
    setOpen(false);
  };
  const resetFormValues = () => {
    setName("");
    setParentID("");
    setSetInterval("");
    setSpecification("");
    setStandardTime("");
    setReqQualification("");
  }

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
        Hozzáadás
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Új kategória hozzáadása</DialogTitle>
        <DialogContent>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name"
              required
              margin="normal"
              fullWidth
              maxRows={1}
              //value={name}
              //onChange={handleFailureDescChange}
              {...register("name", {
                required: true,
                minLength: 3
              })}
              error={errors.name}
              helperText={
                errors.name &&
                "Minimum 3 character!"
              }
              type="text"
            />
            <TextField
              select
              required
              margin="normal"
              label="Parent Category"
              fullWidth
              // value={parentInput}
              // defaultValue={{ label: parentInput, value: parentInput }}
              // onChange={handleSelectedDeviceChange}
              {...register("parentID", {
                required: true,
              })}
              error={errors.parentID}
              type="text"
            >
              {ParentCategoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              margin="normal"
              label="Interval"
              fullWidth
              // value={intervalInput}
              // defaultValue={{ label: intervalInput, value: intervalInput }}
              // onChange={handleSelectedDeviceChange}
              {...register("interval", {
                required: false,
              })}
              error={errors.interval}
              type="text"
            >
              {IntervalOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Specification"
              multiline
              margin="normal"
              fullWidth
              // value={specificationInput}
              // onChange={handleFailureDescChange}
              {...register("specification", {
                required: false,
                minLength: 10
              })}
              error={errors.specification}
              helperText={
                errors.specification &&
                "Minimum 10 character!"
              }
              type="text"
            />
            <TextField
              label="StandardTime"
              margin="normal"
              fullWidth
              maxRows={1}
              // value={standardTInput}
              // onChange={handleFailureDescChange}
              {...register("standardTime", {
                required: false,
                minLength: 2
              })}
              error={errors.standardTime}
              type="text"
            />    
            <TextField
              select
              margin="normal"
              label="Required Qualification"
              fullWidth
              // value={qualificationInput}
              // defaultValue={{ label: qualificationInput, value: qualificationInput }}
              // onChange={handleSelectedDeviceChange}
              {...register("reqQualification", {
                required: false,
              })}
              error={errors.reqQualification}
              type="text"
            >
              {QualificationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Mégse</Button>
          <Button
            type="submit"
            disabled={!formState.isValid}
            //onClick={saveDataToDB}
            onClick={() => saveDataToDB(getValues()) }
          >
            Mentés
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
