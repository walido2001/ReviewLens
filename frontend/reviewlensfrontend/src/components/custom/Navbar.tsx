import React from "react";
import AppSwitcher from "./AppSwitcher";
import SearchBar from "./SearchBar";
import SearchButton from "./SearchButton";

const Navbar = () => {
  return (
    <div className="flex flex-row items-center p-3 border-b space-x-4">
      <div>Review Lens</div>
      <div>
        <AppSwitcher />
      </div>
      <div className="flex-grow">
        <SearchBar />
      </div>
      <div>
        <SearchButton />
      </div>
    </div>
  );
};

export default Navbar;
