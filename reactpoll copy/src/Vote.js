import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Vote.css";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

function Vote() {
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [questionId, setQuestionId] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading state

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("questionId");
    if (id) {
      setQuestionId(id);
    }

    if (location.state && location.state.question) {
      const { OptionVote } = location.state.question;
      setOptions(Object.keys(OptionVote));
    }
  }, [location.search, location.state]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleVote = async () => {
    try {
      setLoading(true); // Set loading state to true when vote is initiated
      const response = await fetch(
        `http://localhost:8000/polls/poll_id/${questionId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ incrementOption: selectedOption }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to vote");
      }

      console.log("Vote submitted successfully");
      // Implement any additional logic here after successful vote
      alert("Vote updated successfully");
    } catch (error) {
      console.error("Error voting:", error.message);
    } finally {
      setLoading(false); // Set loading state back to false after vote operation is completed
    }
  };

  return (
    <div>
      {location.state && location.state.question && (
        <div>
          <h2 id="question">{location.state.question.Question}</h2>
          <form>
            {options.map((option, index) => (
              <div className="input-container" key={index}>
                <input
                  className="option-vote"
                  type="radio"
                  id={option}
                  name="options"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </form>
          <Button id="vote-button" variant="outlined" onClick={handleVote}>
            {loading ? <CircularProgress size={24} /> : "Vote"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Vote;
