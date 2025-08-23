import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchButtonProps {
  onSearch: () => void;
  disabled?: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  onSearch,
  disabled = false,
}) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onSearch}
      disabled={disabled}
    >
      <Search />
    </Button>
  );
};

export default SearchButton;
