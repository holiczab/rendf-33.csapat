import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { alpha } from '@mui/material/styles';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';


const client = new W3CWebSocket("ws://127.0.0.1:5050");

let rows: Data[];
let SelectedIndexes: string[] = [];

rows = [];

async function FetchDataFromDB(){
  rows = [];
  var mess = "scat";
  client.send(mess);
  //console.log(mess);
};

interface Data {
  ID: string;
  Name: string;
  ParentID: string;
  Interval: string;
  Specification: string;
  StandardTime: string;
  RequredQualification: string;
}

function createData(
  ID: string,
  Name: string,
  ParentID: string,
  Interval: string,
  Specification: string,
  StandardTime: string,
  RequredQualification: string,
): Data {
  return { ID, Name,  ParentID, Interval, Specification, StandardTime, RequredQualification };
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  
  {
    id: 'Name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'ParentID',
    numeric: false,
    disablePadding: false,
    label: 'ParentID',
  },
  {
    id: 'Interval',
    numeric: false,
    disablePadding: false,
    label: 'Interval',
  },
  {
    id: 'Specification',
    numeric: false,
    disablePadding: false,
    label: 'Specification',
  },
  {
    id: 'StandardTime',
    numeric: false,
    disablePadding: false,
    label: 'StandardTime',
  },
  {
    id: 'RequredQualification',
    numeric: false,
    disablePadding: false,
    label: 'RequredQualification',
  }
];


interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Kategóriák
        </Typography>
    </Toolbar>
  );
};


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
    console.log(data);
    client.send("acat;"+data.Name+";"+data.ParentID+";"+data.Interval+";"+data.Specification+";"+data.StandardTime+";"+data.RequredQualification);
    reset();
    FetchDataFromDB();
  };
 
  return (
    <Styles>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Kategória hozzáadása</h3>        
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
          <select {...register("Interval", {
              required: true
            })}>
            <option value="1w">1 week</option>
            <option value="1m">1 month</option>
            <option value="3m">3 month</option>
            <option value="6m">6 month</option>
            <option value="12m">12 month</option>
          </select>
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
      </Styles>
  );

  //  onClick={() => onSubmit(getValues())}
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
    let msg = "";
    msg=SelectedIndexes.join();
    console.log("Client message: "+"dcat;"+msg);
    client.send("dcat;"+msg);
    SelectedIndexes = [];
    reset();
    FetchDataFromDB();
  };
 
  return (
    <Styles>
      <form style={{float: 'right'}} id="delete-form" onSubmit={handleSubmit(onSubmit)}>
        <h3>Kategória Törlése</h3>
        <input type="submit" 
          value="Kategória eltávolítása"
          color="primary"></input>
      </form>
      </Styles>
  );
 }




export default function Categories() {

  FetchDataFromDB();

  const [order, setOrder] = React.useState<Order>('asc');
      const [orderBy, setOrderBy] = React.useState<keyof Data>('Name');
      const [selected, setSelected] = React.useState<readonly string[]>([]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.ID);
      SelectedIndexes = newSelecteds;
      console.log(SelectedIndexes);

      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    SelectedIndexes = newSelected;
    console.log(SelectedIndexes);
    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  

  /* let SelectedIndexes: readonly string[] = ['1'];  
  setSelected(SelectedIndexes);   */

  function TableReturn(){
    /* console.log("Tömb SelectedIndexes: "+SelectedIndexes);
    SelectedIndexes = [];
    console.log("Tömb törölve: "+SelectedIndexes); */

    return (
      <div id='DataTable'>
      <Box style={{paddingLeft: 280}}>
        <Paper sx={{ width: '95%' /*, overflow: 'hidden' */ }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer sx={{ maxHeight: 440, overflow: "auto" }}>
            <Table
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.ID);
                    const labelId = `enhanced-table-checkbox-${index}`;
  
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.ID)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.ID}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.Name}
                        </TableCell>
                        <TableCell align="right">{row.ParentID}</TableCell>
                        <TableCell align="right">{row.Interval}</TableCell>
                        <TableCell align="right">{row.Specification}</TableCell>
                        <TableCell align="right">{row.StandardTime}</TableCell>
                        <TableCell align="right">{row.RequredQualification}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <div style={{paddingTop: 20, width: '95%' /*, overflow: 'hidden' */ }}> 
      <DeleteForm />
      </div>
      <div style={{paddingLeft: 500}}>
        <Form />
      </div>
      </div>
    );
  }


  
  React.useEffect(
    // HA sikerese a kapcsolat, és HA üzenet érkezik a szervertől
    () => {
      client.onopen = () => {
        console.log("WebSocket Client Connected");
      };
      
      client.onmessage = (message: any) => {
          //console.log(message.data);

          rows = [];    
          console.log("MSG from server: "+message);     
          var SplittedMessage = message.data.split("END_OF_ROW");
          SplittedMessage.splice(-1,1);

          for (let Row in SplittedMessage){
            //console.log(SplittedMessage[Row]);
            var SplittedRow = SplittedMessage[Row].split(";");
            /*for (let str in SplittedRow){
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
            } */
            
            rows.push(createData(SplittedRow[0], SplittedRow[1], SplittedRow[2], SplittedRow[3], SplittedRow[4], SplittedRow[5], SplittedRow[6]));
          }
          
          /* for (let entry of rows) {
            console.log(entry); 
            console.log("__________");
          } */
          ReactDOM.render(TableReturn(), document.getElementById('DataTable'));
      };
    }
  );

  return(TableReturn());
}
