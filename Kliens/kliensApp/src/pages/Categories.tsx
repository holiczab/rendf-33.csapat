import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';




interface Column {
  id: 'ID' | 'Name' | 'ParentID' | 'Interval' | 'Specification' | 'StandardTime' | 'RequredQualification';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'ID', label: 'ID', minWidth: 90 },
  { id: 'Name', label: 'Name', minWidth: 100 },
  {
    id: 'ParentID',
    label: 'ParentID',
    minWidth: 90,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Interval',
    label: 'Interval',
    minWidth: 90,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Specification',
    label: 'Specification',
    minWidth: 90,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
  {
    id: 'StandardTime',
    label: 'StandardTime',
    minWidth: 90,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
  {
    id: 'RequredQualification',
    label: 'RequredQualification',
    minWidth: 90,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
];

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
  return { ID, Name, ParentID, Interval, Specification, StandardTime, RequredQualification };
}

var rows: Data[];
  
  //createData('Brazil', 'BR', 210147125, 8515767),

rows = [
  createData('India', 'IN', '1324171354', '3287263', 'China', 'CN', 'Italy')
  
];

function FetchDataFromDB(){

};




function Categories() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <main style={{paddingLeft: 280}}>
      <Paper sx={{ width: '95%', overflow: 'hidden' }}>
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
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
    </main>
  );
}


export default Categories;