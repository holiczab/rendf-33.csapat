import * as React from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import { MenuItem } from "@mui/material";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useForm } from "react-hook-form";

const client = new W3CWebSocket("ws://127.0.0.1:5050");

let ParentCategoryOptions: { value: string; label: string }[] = [];
let IntervalOptions: { value: string; label: string }[] = [];
let QualificationOptions: { value: string; label: string }[] = [];
let StandardTimeOptions: { value: string; label: string }[] = [];

export default function CategoryEditDialog(Data: any) {
  ParentCategoryOptions = [];
  IntervalOptions = [];
  QualificationOptions = [];
  StandardTimeOptions = [];

  const [open, setOpen] = React.useState<boolean>(false);
  let ID = Data.ID;

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
      parentID: Data.ParentID,
      interval: Data.Interval,
      specification: Data.Specification,
      standardTime: Data.StandardTime,
      reqQualification: Data.RequredQualification,
    },
  });

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
      "ucat;" +
      ID +
      ";" +
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
        <EditIcon sx={{ mr: 1 }} />
        Modify
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>Modify Category</DialogTitle>
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
              defaultValue={Data.ParentID}
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
              required
              fullWidth
              defaultValue={Data.Interval}
              {...register("interval", {
                required: true,
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
              required
              fullWidth
              {...register("specification", {
                required: true,
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
              defaultValue={Data.StandardTime}
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
              required
              margin="normal"
              label="Required Qualification"
              fullWidth
              defaultValue={Data.RequredQualification}
              {...register("reqQualification", {
                required: true,
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
