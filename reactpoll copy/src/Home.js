import React from "react";
import { SideBar } from "./SideBar";
import Table from "./Table";

import { TagsProvider } from "./TagsProvider";
import "./Home.css";

function Home() {
  return (
    <div className="main-div">
      <TagsProvider>
        <SideBar />
        <Table />
      </TagsProvider>
    </div>
  );
}

export default Home;
