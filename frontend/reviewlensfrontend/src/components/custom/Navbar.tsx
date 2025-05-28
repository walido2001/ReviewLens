import React from "react";
import AppSwitcher from "./AppSwitcher";
import SearchBar from "./SearchBar";

const Navbar = () => {
  return (
    <div className="flex flex-row p-3 border-b">
      <div className="basis-1/4 p-1">
        <AppSwitcher />
      </div>
      <div className="basis-3/4 p-1">
        <SearchBar />
      </div>
    </div>
  );
};

export default Navbar;
