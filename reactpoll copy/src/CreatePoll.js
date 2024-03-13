import React, { useState, useEffect } from "react";
import "./CreatePoll.css";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress } from "@mui/material";

function CreatePoll() {
  // State variables for managing form inputs
  const [Question, setQuestion] = useState("");
  const [Option, setOptions] = useState(["", ""]); // Initialize with two empty options
  const [Tags, setTags] = useState("");
  const [icon, setIcon] = useState(true); // Default icon to true
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set icon to false if number of options is less than or equal to 2
    if (Option.length <= 2) {
      setIcon(false);
    } else {
      setIcon(true);
    }
  }, [Option]); // Run this effect when Option changes

  // Function to add a new option
  const addOption = () => {
    const newOption = `Option${Option.length + 1}`;
    setOptions([...Option, ""]); // Add an empty option
  };

  const deleteOption = (index) => {
    const newOptions = [...Option];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    console.log("Submitting form...");
    console.log("Question:", Question);

    // Prepare the data to send to the API
    const OptionVote = {};
    Option.forEach((option, index) => {
      OptionVote[option.toLowerCase()] = 0; // Initialize vote count for each option
    });

    const formData = {
      Question,
      OptionVote, // Use OptionVote as the key
      Tags: Tags.split(",").map((tag) => tag.trim()), // Split tags by comma and trim whitespace
    };

    console.log("Form data:", formData);

    try {
      // Send a POST request to the API endpoint
      setLoading(true);
      console.log("Sending request to server...");
      const response = await fetch("http://localhost:8000/polls/create_poll/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Failed to create poll");
      }

      // Reset form inputs after successful submission
      alert("Poll created successfully");
      console.log("Poll created successfully");
      setQuestion("");
      setOptions([""]); // Reset options to have one empty option
      setTags("");
    } catch (error) {
      console.error("Error creating poll:", error);
    } finally {
      setLoading(false); // Set loading state back to false after vote operation is completed
    }
  };

  return (
    <div>
      <div id="main-div">
        <h4>Question</h4>
        <input
          id="question-div"
          type="text"
          placeholder="Type your question here"
          value={Question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <h4>Options</h4>
        <div id="option-div">
          {Option.map((option, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <input
                id="option-box"
                key={index}
                type="text"
                placeholder={index === 0 ? "Option" : "Option"}
                value={option}
                onChange={(e) => {
                  const newOptions = [...Option];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
              />
              {icon ? (
                <FontAwesomeIcon
                  id="icon-setting"
                  icon={faTimes}
                  onClick={() => deleteOption(index)}
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                    marginBottom: "8px",
                  }}
                />
              ) : null}
            </div>
          ))}

          <Button
            id="addoption-button"
            variant="outlined"
            onClick={addOption}
            style={{ marginBottom: "10px" }}
          >
            Add option
          </Button>
        </div>
        <h4>Tags</h4>
        <input
          type="text"
          placeholder="Tag1, tag2, tag3"
          value={Tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
      </div>
      <Button id="create-button" variant="contained" onClick={handleSubmit}>
        {loading ? <CircularProgress size={24} /> : "Create Poll"}
      </Button>
    </div>
  );
}

export default CreatePoll;
