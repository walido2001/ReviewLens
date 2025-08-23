import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "@/context/GlobalContext";

interface SearchBarProps {
  onSearch: (appId: string) => void;
  onInputChange: (appId: string) => void;
  value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onInputChange,
  value,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <Input
      placeholder="Enter App ID (e.g., com.example.app)"
      value={value}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyPress={handleKeyPress}
    />
  );
};

export default SearchBar;
