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
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { MenuItem } from "@mui/material";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://127.0.0.1:5050");

let devicesOptions: { value: string; label: string }[] = [];


//function Form() {
  
  //   const {
  //     register,
  //     handleSubmit,
  //     reset,
  //     getValues,
  //     formState: { errors },
  //     formState,
  //   } = useForm({ mode: "onChange" });
  
  //   const onSubmit = (data: any) => {
  //     console.log(data);
  //     client.send("acat;"+data.Name+";"+data.ParentID+";"+data.Interval+";"+data.Specification+";"+data.StandardTime+";"+data.RequredQualification);
  //     reset();
  //     FetchDataFromDB();
  //   };
   
  //   return (
  //     <Styles>
  //       <form onSubmit={handleSubmit(onSubmit)}>
  //         <h3>Kategória hozzáadása</h3>        
  //         <label>
  //           Név:
  //           <input type="text" {...register("Name", {
  //               required: true
  //             })}/>
  //         </label>
  //         <label>
  //           ParentID:
  //           <input type="text" {...register("ParentID", {
  //               required: true
  //             })}/>
  //         </label>
  //         <label>
  //           Interval: 
  //           <select {...register("Interval", {
  //               required: true
  //             })}>
  //             <option value="1w">1 week</option>
  //             <option value="1m">1 month</option>
  //             <option value="3m">3 month</option>
  //             <option value="6m">6 month</option>
  //             <option value="12m">12 month</option>
  //           </select>
  //         </label>
  //         <label>
  //           Specification:
  //           <input type="text" {...register("Specification", {
  //               required: true
  //             })}/>
  //         </label>
  //         <label>
  //           StandardTime:
  //           <input type="text" {...register("StandardTime", {
  //               required: true
  //             })}/>
  //         </label>
  //         <label>
  //           RequredQualification:
  //           <input type="text" {...register("RequredQualification", {
  //               required: true
  //             })}/>
  //         </label>
  //         <input type="submit" 
  //           value="Kategória felvétele"
  //           color="primary"
  //           disabled={!formState.isValid}/>
  //       </form>
  //       </Styles>
  //   );
  
  //   //  onClick={() => onSubmit(getValues())}
  //  }

async function FetchDataFromDB() {
  var mess = "sdvc";
  client.send(mess);

  client.onmessage = (message: any) => {
    devicesOptions = [];
    var SplittedMessage = message.data.split("END_OF_ROW");
    SplittedMessage.splice(-1, 1);

    for (let Row in SplittedMessage) {
      var SplittedRow: string = SplittedMessage[Row].split(";");
      devicesOptions.push({
        value: SplittedRow[0],
        label: SplittedRow[1].concat(" [", SplittedRow[4], "]"),
        //label: (SplittedRow[1] + "\t|\t" + SplittedRow[4])
      });
    }
    console.log(devicesOptions);
  };
}

export default function CategoryPopupDialog() {
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

    FetchDataFromDB();
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
        <DialogTitle>Új eszköz hozzáadása</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              id="outlined-multiline-flexible"
              label="Név"
              required
              margin="normal"
              fullWidth
              maxRows={4}
              value={description}
              onChange={handleFailureDescChange}
            />
            <TextField
              id="outlined-select-currency"
              select
              required
              margin="normal"
              label="Kategória"
              fullWidth
              value={selectedDevice}
              onChange={handleSelectedDeviceChange}
            >
              {devicesOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="outlined-multiline-flexible"
              label="Leírás"
              required
              margin="normal"
              multiline
              fullWidth
              maxRows={4}
              value={description}
              onChange={handleFailureDescChange}
            />

            <TextField
              id="outlined-select-currency"
              select
              required
              margin="normal"
              label="Helyszín"
              fullWidth
              value={selectedDevice}
              onChange={handleSelectedDeviceChange}
            >
              {devicesOptions.map((option) => (
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
