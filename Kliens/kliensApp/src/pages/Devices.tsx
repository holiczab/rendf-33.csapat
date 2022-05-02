import * as React from "react";
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
import DeviceAddDialog from "../components/DeviceAddDialog";
import DeviceEditDialog from "../components/DeviceEditDialog";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";

const client = new W3CWebSocket("ws://127.0.0.1:5050");

var rows: Data[];
let SelectedIndexes: string[] = [];
let LocationList: string[] = [];
let EditParams: EditDialogInput;
let AddParams: AddDialogInput;
let DevCategoryList: { ID: string; Name: string }[] = [];

rows = [];

async function FetchDataFromDB() {
  //rows = [];
  var mess = "sdvc";
  client.send(mess);
  console.log("Device SELECT query executed");
}

async function GetCategoriesFromDB() {
  //rows = [];
  var mess = "scat";
  client.send(mess);
  console.log("Category SELECT query executed");
}

async function GetLocationsFromDB() {
  var mess = "sloc";
  client.send(mess);
  console.log("Location SELECT query executed");
}

interface Data {
  ID: string;
  Name: string;
  CategoryID: string;
  Description: string;
  Location: string;
  CategoryName: string;
}

function createData(
  ID: string,
  Name: string,
  CategoryID: string,
  Description: string,
  Location: string,
  CategoryName: string
): Data {
  return { ID, Name, CategoryID, Description, Location, CategoryName };
}

interface EditDialogInput {
  ID: string;
  Name: string;
  CategoryID: string;
  Description: string;
  Location: string;
  DevCategoryList: { ID: string; Name: string }[];
  LocationList: string[];
  updateFunction: () => any;
}

function createEditDialogInput(
  ID: string,
  Name: string,
  CategoryID: string,
  Description: string,
  Location: string,
  DevCategoryList: { ID: string; Name: string }[],
  LocationList: string[],
  updateFunction: () => any
): EditDialogInput {
  return {
    ID,
    Name,
    CategoryID,
    Description,
    Location,
    DevCategoryList,
    LocationList,
    updateFunction,
  };
}

interface AddDialogInput {
  DevCategoryList: { ID: string; Name: string }[];
  LocationList: string[];
  updateFunction: () => any;
}

function createAddDialogInput(
  DevCategoryList: { ID: string; Name: string }[],
  LocationList: string[],
  updateFunction: () => any
): AddDialogInput {
  return {
    DevCategoryList,
    LocationList,
    updateFunction,
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
    id: "CategoryID",
    numeric: false,
    disablePadding: false,
    label: "Category",
  },
  {
    id: "Description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
  {
    id: "Location",
    numeric: false,
    disablePadding: false,
    label: "Location",
  },
];

type Order = "asc" | "desc";

export default function Devices() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("Name");
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const deleteDevice = () => {
    let msg = "";
    msg = SelectedIndexes.join();
    client.send("ddvc;" + msg);
    setSelected([]);
    FetchDataFromDB();
    GetCategoriesFromDB();
  };

  const updateFunction = () => {
    FetchDataFromDB();
    setSelected([]);
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
          {headCells.map((headCell) => (
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
          Devices
        </Typography>
        {selected.length === 1 ? (
          <>
            <Fab
              variant="extended"
              color="error"
              aria-label="add"
              onClick={deleteDevice}
              sx={{ m: 1 }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Remove
            </Fab>
            <DeviceEditDialog {...EditParams} />
          </>
        ) : selected.length === 0 ? (
          <DeviceAddDialog {...AddParams} />
        ) : (
          <Fab
            variant="extended"
            color="error"
            aria-label="add"
            onClick={deleteDevice}
            sx={{ m: 1 }}
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
            rows[r].CategoryID,
            rows[r].Description,
            rows[r].Location,
            DevCategoryList,
            LocationList,
            updateFunction
          );
        }
      }
    }
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
                          <TableCell align="center">
                            {row.CategoryName}
                          </TableCell>
                          <TableCell align="left">{row.Description}</TableCell>
                          <TableCell align="center">{row.Location}</TableCell>
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

        if (SplittedMessage[0].split(";").length === 5) {
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
                ""
              )
            );
          }
        } else if (SplittedMessage[0].split(";").length === 1) {
          LocationList = [];

          for (let Row in SplittedMessage) {
            let SplittedRow = SplittedMessage[Row].split(";");
            LocationList.push(SplittedRow[0]);
          }
        } else {
          DevCategoryList = [];

          for (let Row in SplittedMessage) {
            //console.log(SplittedMessage[Row]);
            let SplittedRow = SplittedMessage[Row].split(";");

            DevCategoryList.push({
              ID: SplittedRow[0],
              Name: SplittedRow[1],
            });
          }
        }

        for (let r in rows) {
          for (let i in DevCategoryList) {
            if (DevCategoryList[i].ID === rows[r].CategoryID) {
              rows[r].CategoryName = DevCategoryList[i].Name;
            }
          }
        }

        AddParams = createAddDialogInput(
          DevCategoryList,
          LocationList,
          updateFunction
        );

        ReactDOM.render(TableReturn(), document.getElementById("DataTable"));
      };
    }
  );

  React.useEffect(
    // HA elso betoltes
    () => {
      FetchDataFromDB();
      GetCategoriesFromDB();
      GetLocationsFromDB()
    },[]
  );

  React.useEffect(
    // HA kijeloles valtozas van
    () => {
      ReactDOM.render(TableReturn(), document.getElementById("DataTable"));
    }, [selected]
  );

  return TableReturn();
}
