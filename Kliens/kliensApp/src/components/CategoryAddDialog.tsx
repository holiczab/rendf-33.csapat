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

let ParentCategoryOptions: { value: string; label: string }[] = [];
let IntervalOptions: { value: string; label: string }[] = [];
let QualificationOptions: { value: string; label: string }[] = [];
let StandardTimeOptions: { value: string; label: string }[] = [];

export default function CategoryAddDialog(Data: any) {
  ParentCategoryOptions = [];
  IntervalOptions = [];
  QualificationOptions = [];
  StandardTimeOptions = [];

  for (let c in Data.ParentCategoryList) {
    ParentCategoryOptions.push({
      value: Data.ParentCategoryList[c].ID,
      label: Data.ParentCategoryList[c].Name,
    });
  }

  for (let i in Data.IntervalList) {
    IntervalOptions.push({
      value: Data.IntervalList[i].ID,
      label: Data.IntervalList[i].Name,
    });
  }

  for (let q in Data.QualificationList) {
    QualificationOptions.push({
      value: Data.QualificationList[q],
      label: Data.QualificationList[q],
    });
  }

  for (let i in Data.StandardTimeList) {
    StandardTimeOptions.push({
      value: Data.StandardTimeList[i].ID,
      label: Data.StandardTimeList[i].Name,
    });
  }

  const [open, setOpen] = React.useState<boolean>(false);

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
    var mess =
      "acat;" +
      params.name +
      ";" +
      params.parentID +
      ";" +
      params.interval +
      ";" +
      params.specification +
      ";" +
      params.standardTime +
      ";" +
      params.reqQualification;

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
        sx={{ m: 1 }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Add new Category</DialogTitle>
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
              label="Parent Category"
              fullWidth
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
              {...register("specification", {
                required: false,
                minLength: 10,
              })}
              error={errors.specification}
              helperText={errors.specification && "Minimum 10 character!"}
              type="text"
            />
            <TextField
              select
              margin="normal"
              label="Standard Time"
              fullWidth
              {...register("standardTime", {
                required: false,
              })}
              error={errors.standardTime}
              type="text"
            >
              {StandardTimeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              margin="normal"
              label="Required Qualification"
              fullWidth
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
