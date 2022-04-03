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
  console.log(mess);
  await sleep(1000);
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
            console.log(SplittedMessage[Row]);
            var SplittedRow = SplittedMessage[Row].split(";");
            for (let str in SplittedRow){
              if (SplittedRow[str] === "None"){
                SplittedRow[str] = "";
              }
            }  
            rows.push(createData(SplittedRow[0], SplittedRow[1], SplittedRow[2], SplittedRow[3], SplittedRow[4]));
          }
          
          for (let entry of rows) {
            console.log(entry); 
          }
          
          return TableReturn();
      };
    },
    []
  );

  function TableReturn(){
    return <div>
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
    <div style={{ width: '95%' /*, overflow: 'hidden' */ }}> 
      <Button  style={{float: 'right'}} /*onClick={} */>Eszköz felvétel</Button> 
      <Button style={{float: 'right'}} /*onClick={} */>Eszköz törlése</Button> 
    </div>
  </div>
  }

  return (
    TableReturn()    
  );
}

function AddCategory(){

}

function DeleteCategory(){

}


export default Tools;