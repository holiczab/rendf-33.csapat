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
import ReactDOM from 'react-dom';
import { useState } from 'react';

const client = new W3CWebSocket("ws://127.0.0.1:5050");

var rows: Data[];
  
  //createData('India', 'IN', '1324171354', '3287263', 'China', 'CN', 'Italy')

rows = [
  createData('', '', '', '', '')
];

function sleep(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function FetchDataFromDB(){
  //rows = [];
  var mess = "sdvc";
  client.send(mess);
  //console.log(mess);
};


interface Column {
  id: 'ID' | 'Name' | 'Category' | 'Description' | 'Location';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'ID', label: 'ID'},
  { id: 'Name', label: 'Name'},
  { id: 'Category', label: 'Category'},
  { id: 'Description', label: 'Description'},
  { id: 'Location', label: 'Location'}
];

interface Data {
  ID: string;
  Name: string;
  Category: string;
  Description: string;
  Location: string;
}

function createData(
  ID: string,
  Name: string,
  Category: string,
  Description: string,
  Location: string,
): Data {
  return { ID, Name, Category, Description, Location};
}

function TableReturn(){
  return <Styles><div>
    <h2 style={{paddingLeft: 280}}>Eszközök</h2>
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
    client.send("ddvc;"+data.ID);
    reset();
    FetchDataFromDB();
  };
 
  return (
      <form style={{float: 'right'}} id="delete-form" onSubmit={handleSubmit(onSubmit)}>
        <h3>Eszköz Törlése</h3>
        <label>
          ID:
          <input type="text" {...register("ID", {
              required: true
            })}/>
        </label>
        <input type="submit" 
          value="Eszköz eltávolítása"
          color="primary"
          disabled={!formState.isValid}/>
      </form>
  );
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
    client.send("advc;"+data.ID+";"+data.Name+";"+data.Category+";"+data.Description+";"+data.Location+";");
    reset();
    FetchDataFromDB();
  };
 
  return (
      <form id="input-form" onSubmit={handleSubmit(onSubmit)}>
        <h3>Eszköz hozzáadása</h3>
        <label>
          Azonosító:
          <input type="text" {...register("ID", {
              required: true
            })}/>
        </label>
        <label>
          Név:
          <input id="NameInput" type="text" {...register("Name", {
              required: true,
              value: ''
            })}/>
        </label>
        <label>
          Kategória:
          <input type="text" {...register("Category", {
              required: true
            })}/>
        </label>
        <label>
          Leírás:
          <input type="text" {...register("Description", {
              required: true
            })}/>
        </label>
        <label>
          Helyszín:
          <input type="text" {...register("Location", {
              required: true
            })}/>
        </label>
        <input type="submit" 
          value="Eszköz felvétele"
          color="primary"
          disabled={!formState.isValid}/>
      </form>
  );

  //  onClick={() => onSubmit(getValues())}
 }

function Tools() {
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
          var SplittedMessage = message.data.split("\n");
          for (let Row in SplittedMessage){
            //console.log(SplittedMessage[Row]);
            var SplittedRow = SplittedMessage[Row].split(";");
            for (let str in SplittedRow){
              if (SplittedRow[str] === "None"){
                SplittedRow[str] = "";
              }
            }  
            rows.push(createData(SplittedRow[0], SplittedRow[1], SplittedRow[2], SplittedRow[3], SplittedRow[4]));
          }
          
          /* for (let entry of rows) {
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


function DeleteDevice(){

}


export default Tools;