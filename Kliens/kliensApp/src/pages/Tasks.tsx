import React, { useContext, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ReactDOM from "react-dom";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { alpha } from "@mui/material/styles";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import TaskAddDialog from "../components/TaskAddDialog";
import TaskEditDialog from "../components/TaskEditDialog";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import LoggedInContext from "../utils/context";
import TaskInstructionsDialog from "../components/TaskInstructionsDialog";
import TaskAssignTo from "../components/TaskAssignTo";

const client = new W3CWebSocket("ws://127.0.0.1:5050");

var rows: Data[];
let SelectedIndexes: string[] = [];
let EditParams: EditDialogInput;
let AddParams: AddDialogInput;
let DevDeviceList: { ID: string; Name: string; Instruction: string }[] = [];
let DeviceIdForAssigning: string;


rows = [];

async function FetchDataFromDB(position: string, username: string) {
  switch (position) {
    case "Operator": //lekeri az osszes feladatot
      var mess = "smtt";
      client.send(mess);
      console.log("Task SELECT query executed");
      break;

    case "Repairer": //lekeri a bejelentkezett karbantartohoz tartozo feladatokat
      var mess = "sspectasks;" + username;
      console.log(mess);
      client.send(mess);
      console.log("Task SELECT by username query executed");
      break;

    default:
      console.log("Invalid position!");
      break;
  }

  //rows = [];amtt
}

async function GetDevice_id_name_instr() {
  //rows = [];
  var mess = "sDev_id_name_instr";
  client.send(mess);
  console.log("sDev_id_name_instr SELECT query executed");
}

interface Data {
  ID: string;
  Name: string;
  DeviceID: string;
  Status: string;
  Instruction: string;
  Type: string;
  Importance: string;
  AssignedTo: string;
  AcceptedBy: string;
  Started: string;
  DeviceName: string;
}

function createData(
  ID: string,
  Name: string,
  DeviceID: string,
  Status: string,
  Instruction: string,
  Type: string,
  Importance: string,
  AssignedTo: string,
  AcceptedBy: string,
  Started: string,
  DeviceName: string
): Data {
  return {
    ID,
    Name,
    DeviceID,
    Status,
    Instruction,
    Type,
    Importance,
    AssignedTo,
    AcceptedBy,
    Started,
    DeviceName,
  };
}

interface EditDialogInput {
  ID: string;
  Name: string;
  DeviceID: string;
  Status: string;
  Instruction: string;
  Type: string;
  Importance: string;
  DevDeviceList: { ID: string; Name: string }[];
  Username: string;
  updateFunction: () => any;
  resetSelection: () => any;
  isOperator: () => any;
  isRepairer: () => any;
}

function createEditDialogInput(
  ID: string,
  Name: string,
  DeviceID: string,
  Status: string,
  Instruction: string,
  Type: string,
  Importance: string,
  DevDeviceList: { ID: string; Name: string }[],
  Username: string,
  updateFunction: () => any,
  resetSelection: () => any,
  isOperator: () => any,
  isRepairer: () => any
): EditDialogInput {
  return {
    ID,
    Name,
    DeviceID,
    Status,
    Instruction,
    Type,
    Importance,
    DevDeviceList,
    Username,
    updateFunction,
    resetSelection,
    isOperator,
    isRepairer,
  };
}

interface AddDialogInput {
  DevDeviceList: { ID: string; Name: string; Instruction: string }[];
  updateFunction: () => any;
  isOperator: boolean;
}

function createAddDialogInput(
  DevDeviceList: { ID: string; Name: string; Instruction: string }[],
  updateFunction: () => any,
  isOperator: boolean
): AddDialogInput {
  return {
    DevDeviceList,
    updateFunction,
    isOperator,
  };
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const headCells: readonly HeadCell[] = [
  {
    id: "Name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "DeviceID",
    numeric: false,
    disablePadding: false,
    label: "Device",
  },
  {
    id: "Status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  // {
  //   id: "Instruction",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Instruction",
  // },
  {
    id: "Type",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "Importance",
    numeric: false,
    disablePadding: false,
    label: "Importance",
  },
  {
    id: "AssignedTo",
    numeric: false,
    disablePadding: false,
    label: "AssignedTo",
  },
  {
    id: "AcceptedBy",
    numeric: false,
    disablePadding: false,
    label: "AcceptedBy",
  },
  {
    id: "Started",
    numeric: false,
    disablePadding: false,
    label: "Planned Start",
  },
];

const headCellsForRepairer: readonly HeadCell[] = [
  {
    id: "Name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "DeviceID",
    numeric: false,
    disablePadding: false,
    label: "Device",
  },
  {
    id: "Status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "Type",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "Importance",
    numeric: false,
    disablePadding: false,
    label: "Importance",
  },
  {
    id: "Instruction",
    numeric: false,
    disablePadding: false,
    label: "Instruction",
  },
];

type Order = "asc" | "desc";

export default function Tasks() {
  const { position, setPosition } = useContext(LoggedInContext); //beosztast megkapja Context-bol
  const { username, setUsername } = useContext(LoggedInContext); //nevet megkapja Context-bol
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("Name");
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const deleteTask = () => {
    let msg = "";
    msg = SelectedIndexes.join();
    console.log("dmtt;" + msg);
    client.send("dmtt;" + msg);
    setSelected([]);
    FetchDataFromDB(position, username);
    GetDevice_id_name_instr();
  };

  const updateFunction = () => {
    FetchDataFromDB(position, username);
    GetDevice_id_name_instr();
    setSelected([]);
  };

  const resetSelection = () => {
    setSelected([]);
  };

  const isOperator = (): boolean => {
    if (position === "Operator") return true;
    else return false;
  };

  const isRepairer = (): boolean => {
    if (position === "Repairer") return true;
    else return false;
  };

  const getType = (type: string): string => {
    switch (type) {
      case "0":
        return "Periodic";
      case "1":
        return "Exceptional";

      default:
        return "Unknown";
    }
  };

  const getDash = (param: string): string => {
    switch (param) {
      case "None":
        return "---";

      default:
        return param;
    }
  };

  const ColorizedImportance = (props: Data) => {
    if (props.Importance === "Low") {
      return (
        <Typography
          sx={{
            color: "green",
          }}
        >
          Low
        </Typography>
      );
    } else if (props.Importance === "Medium") {
      return (
        <Typography
          sx={{
            color: "orange",
          }}
        >
          Medium
        </Typography>
      );
    } else if (props.Importance === "High") {
      return (
        <Typography
          sx={{
            color: "red",
          }}
        >
          High
        </Typography>
      );
    } else {
      return <Typography>Unknown</Typography>;
    }
    // switch (props) {
    //   case "Low":
    //     return (
    //       <Typography
    //         sx={{
    //           color: "green",
    //         }}
    //       >
    //         Low
    //       </Typography>
    //     );
    //   case "Medium":
    //     return (
    //       <Typography
    //         sx={{
    //           color: "orange",
    //         }}
    //       >
    //         Medium
    //       </Typography>
    //     );
    //   case "High":
    //     return (
    //       <Typography
    //         sx={{
    //           color: "red",
    //         }}
    //       >
    //         High
    //       </Typography>
    //     );

    //   default:
    //     <Typography>Unknown</Typography>;
    // }
  };



  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number
  ) {
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

  function EnhancedTableHead(props: EnhancedTableProps) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
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
                "aria-label": "select all",
              }}
            />
          </TableCell>
          {isOperator() &&
            headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? "right" : "left"}
                padding={headCell.disablePadding ? "none" : "normal"}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}

          {!isOperator() &&
            headCellsForRepairer.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? "right" : "left"}
                padding={headCell.disablePadding ? "none" : "normal"}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
        </TableRow>
      </TableHead>
    );
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
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Tasks
        </Typography>
        {selected.length === 1 && DeviceIdForAssigning != "-1" ? (
          <>
            <TaskInstructionsDialog {...EditParams} />
            <Fab
              variant="extended"
              color="error"
              aria-label="add"
              onClick={deleteTask}
              sx={{ m: 1, display: isOperator() ? "" : "none" }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Remove
            </Fab>

            <Fab
              variant="extended"
              sx={{ m: 1, display: isOperator() ? "" : "none" }}
            ><TaskAssignTo {...EditParams} /></Fab>
            

            <TaskEditDialog {...EditParams} />
          </>
        ) : selected.length === 1 && DeviceIdForAssigning == "-1" ? (
          <>
            <TaskInstructionsDialog {...EditParams} />
            <Fab
              variant="extended"
              color="error"
              aria-label="add"
              onClick={deleteTask}
              sx={{ m: 1, display: isOperator() ? "" : "none" }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Remove
            </Fab>
            <TaskEditDialog {...EditParams} />
          </>
        ) : selected.length === 0 ? (
          <>
            <TaskAddDialog {...AddParams} />
          </>
        ) : (
          <Fab
            variant="extended"
            color="error"
            aria-label="add"
            onClick={deleteTask}
            sx={{ m: 1, display: isOperator() ? "" : "none" }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Remove
          </Fab>
        )}
      </Toolbar>
    );
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.ID);
      SelectedIndexes = newSelecteds;

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
        selected.slice(selectedIndex + 1)
      );
    }
    SelectedIndexes = newSelected;

    if (SelectedIndexes.length === 1) {
      for (let r in rows) {
        if (rows[r].ID === SelectedIndexes[0]) {
          EditParams = createEditDialogInput(
            rows[r].ID,
            rows[r].Name,
            rows[r].DeviceID,
            rows[r].Status,
            rows[r].Instruction,
            rows[r].Type,
            rows[r].Importance,
            DevDeviceList,
            username,
            updateFunction,
            resetSelection,
            isOperator,
            isRepairer
          );
          if(rows[r].Status != "Started"){
            DeviceIdForAssigning = rows[r].DeviceID;
          }
          else{
            DeviceIdForAssigning = "-1";
          }
        }
      }
    }
    console.log(EditParams);
    console.log("DeviceIdForAssigning: " + EditParams.DeviceID);
    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  function TableReturn() {
    return (
      <div id="DataTable">
        <Box style={{ paddingLeft: 280 }}>
          <Paper sx={{ width: "95%" /*, overflow: 'hidden' */ }}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer sx={{ height: "80vh", overflow: "auto" }}>
              <Table stickyHeader aria-labelledby="tableTitle">
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy)).map(
                    (row, index) => {
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
                                "aria-labelledby": labelId,
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
                          <TableCell align="left">{row.DeviceName}</TableCell>
                          <TableCell align="left">{row.Status}</TableCell>
                          <TableCell align="left">
                            {getType(row.Type)}
                          </TableCell>
                          <TableCell align="left">
                            <ColorizedImportance {...row} />
                          </TableCell>
                          {!isOperator() ? (
                            <TableCell align="center">
                              {row.Instruction}
                            </TableCell>
                          ) : (
                            <>
                              <TableCell align="left">
                                {getDash(row.AssignedTo)}
                              </TableCell>
                              <TableCell align="left">
                                {getDash(row.AcceptedBy)}
                              </TableCell>
                              <TableCell align="center">
                                {getDash(row.Started)}
                              </TableCell>
                            </>
                          )}
                          {/* <TableCell align="center">
                            {row.Instruction}
                          </TableCell> */}
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
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

        let SplittedMessage = message.data.split("END_OF_ROW");
        SplittedMessage.splice(-1, 1);

        console.log("Splitted Length: " + SplittedMessage[0].split(";").length);

        if (SplittedMessage[0].split(";").length === 10) {
          rows = [];

          for (let Row in SplittedMessage) {
            let SplittedRow = SplittedMessage[Row].split(";");

            rows.push(
              createData(
                SplittedRow[0],
                SplittedRow[1],
                SplittedRow[2],
                SplittedRow[3],
                SplittedRow[4],
                SplittedRow[5],
                SplittedRow[6],
                SplittedRow[7],
                SplittedRow[8],
                SplittedRow[9],
                ""
              )
            );
            /* console.log(
                SplittedRow[0],
                SplittedRow[1],
                SplittedRow[2],
                SplittedRow[3],
                SplittedRow[4],
                SplittedRow[5],
                SplittedRow[6]
            ); */
          }
        } else if (SplittedMessage[0].split(";").length === 7) {
          rows = [];

          for (let Row in SplittedMessage) {
            let SplittedRow = SplittedMessage[Row].split(";");

            rows.push(
              createData(
                SplittedRow[0],
                SplittedRow[1],
                SplittedRow[2],
                SplittedRow[3],
                SplittedRow[4],
                SplittedRow[5],
                SplittedRow[6],
                "",
                "",
                "",
                ""
              )
            );
            /* console.log(
                SplittedRow[0],
                SplittedRow[1],
                SplittedRow[2],
                SplittedRow[3],
                SplittedRow[4],
                SplittedRow[5],
                SplittedRow[6]
            ); */
          }
        } else {
          DevDeviceList = [];

          for (let Row in SplittedMessage) {
            //console.log(SplittedMessage[Row]);
            let SplittedRow = SplittedMessage[Row].split(";");
            //console.log("ID: "+SplittedRow[0]+"Name: "+SplittedRow[1]+"Instruction: "+SplittedRow[2]);
            DevDeviceList.push({
              ID: SplittedRow[0],
              Name: SplittedRow[1],
              Instruction: SplittedRow[2],
            });
          }
        }

        /*for (let r in rows) {
          for (let i in DevDeviceList) {
            if (DevDeviceList[i].ID === rows[r].CategoryID) {
              rows[r].CategoryName = DevDeviceList[i].Name;
            }
          }
        } */

        AddParams = createAddDialogInput(
          DevDeviceList,
          updateFunction,
          isOperator()
        );

        for (let r in rows) {
          for (let d in DevDeviceList) {
            if (rows[r].DeviceID === DevDeviceList[d].ID) {
              rows[r].DeviceName = DevDeviceList[d].Name;
            }
          }
        }
        // console.log("ROWS: ");
        // for (let row in rows) {
        //   console.log(rows[row].ID + " | " + rows[row].Name);
        // }
        ReactDOM.render(TableReturn(), document.getElementById("DataTable"));
      };
    }
  );

  React.useEffect(
    // HA elso betoltes
    () => {
      FetchDataFromDB(position, username);
      GetDevice_id_name_instr();
      //GetLocationsFromDB()
    },
    []
  );

  React.useEffect(
    // HA kijeloles valtozas van
    () => {
      ReactDOM.render(TableReturn(), document.getElementById("DataTable"));
    },
    [selected]
  );

  return TableReturn();
}
