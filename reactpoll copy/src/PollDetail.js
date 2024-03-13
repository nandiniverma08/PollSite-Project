import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "chart.js/auto";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import "./PollDetail.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Pie } from "react-chartjs-2";

function PollDetail() {
  const [questionId, setQuestionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [chartData, setChartData] = useState(null); // State to store chart data
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("questionId");
    console.log("questionId", id);
    if (id) {
      setQuestionId(id);
      fetchQuestion(id);
    }
  }, [location.search]);

  useEffect(() => {
    if (question) {
      // Calculate chart data based on votes
      const data = {
        labels: Object.keys(question.OptionVote),
        datasets: [
          {
            label: "Votes",
            data: Object.values(question.OptionVote),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)",
            ],
          },
        ],
      };
      setChartData(data);
    }
  }, [question]);

  const fetchQuestion = async (questionId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/polls/pollDetailById/${questionId}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch question from the API");
      }
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleVoteClick = () => {
    navigate(`/vote?questionId=${questionId}`, {
      state: { question: question, OptionVote: question.OptionVote },
    });
  };

  if (!question) {
    return <CircularProgress />;
  }

  return (
    <div className="main_div">
      <h2 id="question">{question.Question}</h2>
      <Button id="vote-id" variant="outlined" onClick={handleVoteClick}>
        Vote on Poll
      </Button>
      <div id="poll-table">
        <TableContainer id="table-container">
          <Table id="table-box">
            <TableHead>
              <TableRow id="table-head">
                <TableCell id="head1">Number</TableCell>
                <TableCell id="head1">Options</TableCell>
                <TableCell id="head1">Votes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(question.OptionVote).map(
                ([option, votes], index) => (
                  <TableRow key={index}>
                    <TableCell id="value1">{index + 1}</TableCell>
                    <TableCell id="value1">{option}</TableCell>
                    <TableCell id="value1">{votes}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          <div id="pie-chart">
            {/* Render the pie chart */}
            {chartData && <Pie data={chartData} />}
          </div>
        </TableContainer>
      </div>
    </div>
  );
}

export default PollDetail;
