import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { filteredContext } from "./TagsProvider";
import "./Table.css";

const columns = [
  { id: "number", label: "Number", minWidth: 50 },
  { id: "question", label: "Poll Question", minWidth: 50 },
  { id: "totalVotes", label: "Total Votes", minWidth: 50 },
  { id: "tags", label: "Tags", minWidth: 50 },
];

const TableComponent = () => {
  const [polls, setPolls] = useState([]);
  const { filterTags } = useContext(filteredContext);
  console.log("filterTagsnew", filterTags);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    if (filterTags.length > 0) {
      getPollsByTags();
    } else {
      getAllPolls();
    }
  }, [filterTags]);

  const getAllPolls = async () => {
    try {
      const response = await fetch("http://localhost:8000/polls/get_polls/");
      if (!response.ok) {
        console.log("response default one", response);
        throw new Error("Failed to fetch data from the API");
      }
      const data = await response.json();
      setPolls(data);
      console.log("default data", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPollsByTags = async () => {
    try {
      const tagsQuery = filterTags.join(",");
      console.log("tagsQuery", tagsQuery);
      const response = await fetch(
        `http://localhost:8000/polls/get_polls_by_tags/?tags=${tagsQuery}`
      );
      console.log("response ??", response);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the API");
      }
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!polls || polls.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <Paper id="paper">
      <TableContainer id="main-table">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  id="head-content"
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {polls
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((poll, index) => {
                return (
                  <TableRow
                    id="table-row"
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                  >
                    <TableCell id="table-col">{index + 1}</TableCell>
                    <TableCell id="table-content1">
                      <Link
                        to={{
                          pathname: "/polldetail",
                          search: `?questionId=${poll.questionId}`,
                        }}
                        style={{ textDecoration: "none", color: "blue" }}
                      >
                        {poll.Question}
                      </Link>
                    </TableCell>
                    <TableCell id="table-content2">
                      {Object.values(poll.OptionVote).reduce(
                        (acc, curr) => acc + curr,
                        0
                      )}
                    </TableCell>
                    <TableCell id="table-content3">
                      {poll.Tags.join(", ")}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={polls.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableComponent;
