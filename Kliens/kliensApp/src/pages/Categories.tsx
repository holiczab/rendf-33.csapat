import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { SelectAllSharp } from '@mui/icons-material';
import { StyledEngineProvider } from '@mui/styled-engine-sc';
import { Button } from '@mui/material';
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { render } from '@testing-library/react';
import ReactDOM from 'react-dom';

const client = new W3CWebSocket("ws://127.0.0.1:5050");

var rows: Data[];

rows = [
  //createData('', '', '', '', '', '')
];

function sleep(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function FetchDataFromDB(){
  //rows = [];
  var mess = "scat";
  client.send(mess);
  //console.log(mess);
  //await sleep(1000);
};


interface Column {
  id: 'ID' | 'Name' |/* 'ParentID' |*/ 'Interval' | 'Specification' | 'StandardTime' | 'RequredQualification';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'ID', label: 'ID', minWidth: 90 },
  { id: 'Name', label: 'Name', minWidth: 100 },
  /* {
    id: 'ParentID',
    label: 'ParentID'
  }, */
  {
    id: 'Interval',
    label: 'Interval'
  },
  {
    id: 'Specification',
    label: 'Specification'
  },
  {
    id: 'StandardTime',
    label: 'StandardTime'
  },
  {
    id: 'RequredQualification',
    label: 'RequredQualification'
  },
];

interface Data {
  ID: string;
  Name: string;
  //ParentID: string;
  Interval: string;
  Specification: string;
  StandardTime: string;
  RequredQualification: string;
}

function createData(
  ID: string,
  Name: string,
  //ParentID: string,
  Interval: string,
  Specification: string,
  StandardTime: string,
  RequredQualification: string,
): Data {
  return { ID, Name, /* ParentID, */ Interval, Specification, StandardTime, RequredQualification };
}

const Styles = styled.div`
  form {
   background: white;
   border: 1px solid #dedede;
   display: flex;
   flex-direction: column;
   justify-content: space-around;
   margin: 0 auto;
   max-width: 500px;
   padding: 0px 50px 25px;
   
   input {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
  }
 
  label {
    color: #3d3d3d;
    display: block;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
  }
 
  .error {
    color: red;
    font-family: sans-serif;
    font-size: 12px;
    height: 30px;
  }
 
  .submitButton {
    background-color: #6976d9;
    color: white;
    font-family: sans-serif;
    font-size: 14px;
    margin: 20px 0px;
 `;

 

function Form() {
  
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    formState,
  } = useForm({ mode: "onChange" });

  const onSubmit = (data: any) => {
    //console.log(data);
    client.send("acat;"+data.ID+";"+data.Name+";"+data.ParentID+";"+data.Interval+";"+data.Specification+";"+data.StandardTime+";"+data.RequredQualification);
    reset();
    FetchDataFromDB();
  };
 
  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Kategória hozzáadása</h3>
        <label>
          Azonosító:
          <input type="text" {...register("ID", {
              required: true
            })}/>
        </label>
        <label>
          Név:
          <input type="text" {...register("Name", {
              required: true
            })}/>
        </label>
        <label>
          ParentID:
          <input type="text" {...register("ParentID", {
              required: true
            })}/>
        </label>
        <label>
          Interval:
          <input type="text" {...register("Interval", {
              required: true
            })}/>
        </label>
        <label>
          Specification:
          <input type="text" {...register("Specification", {
              required: true
            })}/>
        </label>
        <label>
          StandardTime:
          <input type="text" {...register("StandardTime", {
              required: true
            })}/>
        </label>
        <label>
          RequredQualification:
          <input type="text" {...register("RequredQualification", {
              required: true
            })}/>
        </label>
        <input type="submit" 
          value="Kategória felvétele"
          color="primary"
          disabled={!formState.isValid}/>
      </form>
  );

  //  onClick={() => onSubmit(getValues())}
 }

 function TableReturn(){
  return <Styles><div>
    <h2 style={{paddingLeft: 280}}>Kategóriák</h2>
  <div style={{paddingLeft: 280}}>
  <Paper sx={{ width: '95%' /*, overflow: 'hidden' */ }}>
  <TableContainer sx={{ maxHeight: 440 }}>
    <Table stickyHeader aria-label="sticky table">
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align={column.align}
              style={{ minWidth: column.minWidth }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows
          .map((row) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number'
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  </TableContainer>
</Paper>
</div >
    <div style={{paddingTop: 20, width: '95%' /*, overflow: 'hidden' */ }}> 
      <DeleteForm />
    </div>
    <div style={{paddingLeft: 500}}>
      <Form />
    </div>
</div>
</Styles>
}

function DeleteForm() {

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    formState,
  } = useForm({ mode: "onChange" });

  const onSubmit = (data: any) => {
    //console.log(data);
    client.send("dcat;"+data.ID);
    reset();
    FetchDataFromDB();
  };
 
  return (
      <form style={{float: 'right'}} id="delete-form" onSubmit={handleSubmit(onSubmit)}>
        <h3>Kategória Törlése</h3>
        <label>
          ID:
          <input type="text" {...register("ID", {
              required: true
            })}/>
        </label>
        <input type="submit" 
          value="Kategória eltávolítása"
          color="primary"
          disabled={!formState.isValid}/>
      </form>
  );
 }

function Categories() {
  FetchDataFromDB();
  React.useEffect(
    // HA sikerese a kapcsolat, és HA üzenet érkezik a szervertől
    () => {
      client.onopen = () => {
        console.log("WebSocket Client Connected");
      };
      client.onmessage = (message: any) => {
          //console.log(message.data);
          
          rows = [];
          var SplittedMessage = message.data.split("END_OF_ROW");
          for (let Row in SplittedMessage){
            //console.log(SplittedMessage[Row]);
            var SplittedRow = SplittedMessage[Row].split(";");
            for (let str in SplittedRow){
              if (SplittedRow[str] === "None"){
                SplittedRow[str] = "";
              }
            }
            if (SplittedRow[2] != undefined){
              let ParentID: string = SplittedRow[2].toString().slice(0, -3);
              //console.log(ParentID);
              if (ParentID == "catm"){
                SplittedRow[1] = "---" + SplittedRow[1];
                //console.log(SplittedRow[1]);
              } 
              else if (ParentID == "cats"){
                SplittedRow[1] = "------" + SplittedRow[1];
                //console.log(SplittedRow[1]);
              }
            }
            
            rows.push(createData(SplittedRow[0], SplittedRow[1], /* SplittedRow[2], */ SplittedRow[3], SplittedRow[4], SplittedRow[5], SplittedRow[6]));
          }
          
          /*for (let entry of rows) {
            console.log(entry); 
          } */
          ReactDOM.render(TableReturn(), document.getElementById('rrrrr'));
      };
    },
    []
  );

  

  return (
    <div id='rrrrr'></div>
  );
}

function AddCategory(){

}

function DeleteCategory(){

}



export default Categories;