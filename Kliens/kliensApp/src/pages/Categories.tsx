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
import CategoryAddDialog from "../components/CategoryAddDialog";
import CategoryEditDialog from "../components/CategoryEditDialog";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";

const client = new W3CWebSocket("ws://127.0.0.1:5050");

let rows: Data[];
let SelectedIndexes: string[] = [];
let CategoryList: string[] = [];
let IntervalList: { ID: string; Name: string }[] = [];
let StandardTimeList: { ID: string; Name: string }[] = [];
let QualificationList: string[] = [];
let ParentCategoryList: { ID: string; Name: string }[] = [];
let EditParams: Data;
let AddParams: AddDialogInput;

rows = [];

async function FetchDataFromDB() {
  rows = [];
  var mess = "scat";
  client.send(mess);
  //console.log(mess);
  console.log("Category SELECT query executed");
}

interface Data {
  ID: string;
  Name: string;
  ParentID: string;
  Interval: string;
  Specification: string;
  StandardTime: string;
  RequredQualification: string;
  ParentName: string;
}

function createData(
  ID: string,
  Name: string,
  ParentID: string,
  Interval: string,
  Specification: string,
  StandardTime: string,
  RequredQualification: string,
  ParentName: string
): Data {
  return {
    ID,
    Name,
    ParentID,
    Interval,
    Specification,
    StandardTime,
    RequredQualification,
    ParentName,
  };
}

interface EditDialogInput {
  ID: string;
  Name: string;
  ParentID: string;
  Interval: string;
  Specification: string;
  StandardTime: string;
  RequredQualification: string;
  ParentName: string;
  ParentCategoryList: { ID: string; Name: string }[];
  IntervalList: { ID: string; Name: string }[];
  QualificationList: string[];
  StandardTimeList: { ID: string; Name: string }[];
  updateFunction: () => any;
}

function createEditDialogInput(
  ID: string,
  Name: string,
  ParentID: string,
  Interval: string,
  Specification: string,
  StandardTime: string,
  RequredQualification: string,
  ParentName: string,
  ParentCategoryList: { ID: string; Name: string }[],
  IntervalList: { ID: string; Name: string }[],
  QualificationList: string[],
  StandardTimeList: { ID: string; Name: string }[],
  updateFunction: () => any
): EditDialogInput {
  return {
    ID,
    Name,
    ParentID,
    Interval,
    Specification,
    StandardTime,
    RequredQualification,
    ParentName,
    ParentCategoryList,
    IntervalList,
    QualificationList,
    StandardTimeList,
    updateFunction,
  };
}

interface AddDialogInput {
  ParentCategoryList: { ID: string; Name: string }[];
  IntervalList: { ID: string; Name: string }[];
  QualificationList: string[];
  StandardTimeList: { ID: string; Name: string }[];
  updateFunction: () => any;
}

function createAddDialogInput(
  ParentCategoryList: { ID: string; Name: string }[],
  IntervalList: { ID: string; Name: string }[],
  QualificationList: string[],
  StandardTimeList: { ID: string; Name: string }[],
  updateFunction: () => any
): AddDialogInput {
  return {
    ParentCategoryList,
    IntervalList,
    QualificationList,
    StandardTimeList,
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

type Order = "asc" | "desc";

const headCells: readonly HeadCell[] = [
  {
    id: "Name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "ParentID",
    numeric: false,
    disablePadding: false,
    label: "ParentCategory",
  },
  {
    id: "Interval",
    numeric: false,
    disablePadding: false,
    label: "Interval",
  },
  {
    id: "Specification",
    numeric: false,
    disablePadding: false,
    label: "Specification",
  },
  {
    id: "StandardTime",
    numeric: false,
    disablePadding: false,
    label: "StandardTime",
  },
  {
    id: "RequredQualification",
    numeric: false,
    disablePadding: false,
    label: "RequiredQualification",
  },
];


export default function Categories() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("Name");
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const deleteCategory = () => {
    let msg = "";
    msg = SelectedIndexes.join();
    client.send("dcat;" + msg);
    setSelected([]);
    FetchDataFromDB();
  };

  const updateFunction = () => {
    FetchDataFromDB();
    setSelected([]);
  };

  const getIntervalName = (ID: string): string => {
    switch (ID) {
      case "H":
        return "Half-yearly";
      case "Q":
        return "Quarterly";
      case "M":
        return "Monthly";
      case "W":
        return "Weekly";

      default:
        return "Undefined";
    }
  };

  const getStandardTimeName = (ID: string): string => {
    switch (ID) {
      case "1d":
        return "1 Day";
      case "2d":
        return "2 Days";
      case "3d":
        return "3 Days";
      case "4d":
        return "4 Days";
      case "5d":
        return "5 Days";
      case "6d":
        return "6 Days";
      case "1w":
        return "1 Week";

      default:
        return "Undefined";
    }
  };

  StandardTimeList = [
    {
      ID: "1d",
      Name: getStandardTimeName("1d"),
    },
    {
      ID: "2d",
      Name: getStandardTimeName("2d"),
    },
    {
      ID: "3d",
      Name: getStandardTimeName("3d"),
    },
    {
      ID: "4d",
      Name: getStandardTimeName("4d"),
    },
    {
      ID: "5d",
      Name: getStandardTimeName("5d"),
    },
    {
      ID: "6d",
      Name: getStandardTimeName("6d"),
    },
    {
      ID: "1w",
      Name: getStandardTimeName("1w"),
    },
  ];

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
      //console.log(SelectedIndexes);

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
            rows[r].ParentID,
            rows[r].Interval,
            rows[r].Specification,
            rows[r].StandardTime,
            rows[r].RequredQualification,
            rows[r].ParentName,
            ParentCategoryList,
            IntervalList,
            QualificationList,
            StandardTimeList,
            updateFunction
          );
        }
      }
    }
    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

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
          Categories
        </Typography>
        {selected.length === 1 ? (
          <>
            <Fab
              variant="extended"
              color="error"
              aria-label="add"
              onClick={deleteCategory}
              sx={{ m: 1 }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Remove
            </Fab>
            <CategoryEditDialog {...EditParams} />
          </>
        ) : selected.length === 0 ? (
          <CategoryAddDialog {...AddParams} />
        ) : (
          <Fab
            variant="extended"
            color="error"
            aria-label="add"
            onClick={deleteCategory}
            sx={{ m: 1 }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Remove
          </Fab>
        )}
      </Toolbar>
    );
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
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                rows.slice().sort(getComparator(order, orderBy)) */}
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
                          <TableCell align="center">{row.ParentName}</TableCell>
                          <TableCell align="center">
                            {getIntervalName(row.Interval)}
                          </TableCell>
                          <TableCell align="left">
                            {row.Specification}
                          </TableCell>
                          <TableCell align="center">
                            {getStandardTimeName(row.StandardTime)}
                          </TableCell>
                          <TableCell align="center">
                            {row.RequredQualification}
                          </TableCell>
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
        rows = [];
        CategoryList = [];
        ParentCategoryList = [];
        IntervalList = [];
        QualificationList = [];

        //console.log("MSG from server: " + message);
        var SplittedMessage = message.data.split("END_OF_ROW");
        SplittedMessage.splice(-1, 1);

        for (let Row in SplittedMessage) {
          var SplittedRow = SplittedMessage[Row].split(";");

          if (CategoryList.indexOf(SplittedRow[1]) === -1) {
            if (!CategoryList.some((e) => e === SplittedRow[1])) {
              CategoryList.push(SplittedRow[1]);
            }
          }

          if (IntervalList.indexOf(SplittedRow[3]) === -1) {
            if (!IntervalList.some((e) => e.ID === SplittedRow[3])) {
              IntervalList.push({
                ID: SplittedRow[3],
                Name: getIntervalName(SplittedRow[3]),
              });
            }
          }

          if (QualificationList.indexOf(SplittedRow[6]) === -1) {
            if (!QualificationList.some((e) => e === SplittedRow[6])) {
              QualificationList.push(SplittedRow[6]);
            }
          }

          rows.push(
            createData(
              SplittedRow[0],
              SplittedRow[1],
              SplittedRow[2],
              SplittedRow[3],
              SplittedRow[4],
              SplittedRow[5],
              SplittedRow[6],
              ""
            )
          );

          ParentCategoryList.push({
            ID: SplittedRow[0],
            Name: SplittedRow[1],
          });
        }

        for (let r in rows) {
          for (let i in ParentCategoryList) {
            if (ParentCategoryList[i].ID === rows[r].ParentID) {
              rows[r].ParentName = ParentCategoryList[i].Name;
              //console.log(rows[r].ParentID);
            }
          }
        }

        AddParams = createAddDialogInput(
          ParentCategoryList,
          IntervalList,
          QualificationList,
          StandardTimeList,
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
