import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { filteredContext } from "./TagsProvider";
import "./SideBar.css";
import Button from "@mui/material/Button";

function SideBar() {
  const { filterTags, handleFilterTagsChange } = useContext(filteredContext);
  console.log("filterTags", filterTags);

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    getApiData();
  }, []);

  const getApiData = async () => {
    try {
      const response = await fetch("http://localhost:8000/polls/tags");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the API");
      }
      const data = await response.json();

      // Filter out empty tags
      const nonEmptyTags = data.Tags.filter((tag) => tag.trim() !== "");

      setTags(nonEmptyTags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTagChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedTags((prevTags) => [...prevTags, value]);
    } else {
      setSelectedTags((prevTags) => prevTags.filter((tag) => tag !== value));
    }
  };

  const handleFilterByTags = () => {
    handleFilterTagsChange(selectedTags);
  };

  return (
    <div id="parent-container">
      <div id="first-div">
        <Link to="/createpoll">
          <Button id="create-poll-button" variant="contained">
            Create Poll
          </Button>
        </Link>
        <div id="categories">
          {tags.map((tag, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={tag}
                name="category"
                value={tag}
                onChange={handleTagChange}
              />
              <label htmlFor={tag}>{tag}</label>
              <br />
            </div>
          ))}
          <Button
            id="filter-by-tags-button"
            variant="outlined"
            onClick={handleFilterByTags}
          >
            Filter by tags
          </Button>
        </div>
      </div>
    </div>
  );
}

export { SideBar };
