import React, { useState } from "react";
import AppSwitcher from "./AppSwitcher";
import SearchBar from "./SearchBar";
import SearchButton from "./SearchButton";
import { useGlobalContext } from "@/context/GlobalContext";

const Navbar = () => {
  const { actions } = useGlobalContext();
  const [searchAppId, setSearchAppId] = useState("");

  const handleSearch = (appId: string) => {
    actions.startProcessing(appId);
  };

  const handleInputChange = (appId: string) => {
    setSearchAppId(appId);
  };

  const handleSearchClick = () => {
    if (searchAppId.trim()) {
      actions.startProcessing(searchAppId.trim());
    }
  };

  return (
    <div className="flex flex-row items-center p-3 border-b space-x-4">
      <div>Review Lens</div>
      <div>
        <AppSwitcher />
      </div>
      <div className="flex-grow">
        <SearchBar
          onSearch={handleSearch}
          onInputChange={handleInputChange}
          value={searchAppId}
        />
      </div>
      <div>
        <SearchButton onSearch={handleSearchClick} />
      </div>
    </div>
  );
};

export default Navbar;
