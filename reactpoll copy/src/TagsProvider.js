import React, { createContext, useState } from "react";

export const filteredContext = createContext();

export const TagsProvider = (props) => {
  const [filterTags, setFilterTags] = useState([]);

  const handleFilterTagsChange = (selectedTags) => {
    setFilterTags(selectedTags);
    console.log("selectedTags", selectedTags);
  };

  return (
    <filteredContext.Provider value={{ filterTags, handleFilterTagsChange }}>
      {props.children}
    </filteredContext.Provider>
  );
};
