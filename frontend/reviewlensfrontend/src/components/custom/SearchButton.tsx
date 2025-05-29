import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchButton = () => {
  return (
    <Button variant="outline" size="icon">
      <Search />
    </Button>
  );
};

export default SearchButton;
