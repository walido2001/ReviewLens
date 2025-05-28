import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { AppWindow } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";

const AppSwitcher = () => {
  const dummyCode = [
    {
      id: 0,
      name: "ChatGPT",
      description: "Ipsum Lorem Dipsum",
    },
    {
      id: 1,
      name: "WhatsApp",
      description: "Ipsum Lorem Dipsum",
    },
    {
      id: 2,
      name: "Facebook",
      description: "Ipsum Lorem Dipsum",
    },
  ];

  const [appDisplay, setAppDisplay] = useState("Current App");
  const [appList, setAppList] = useState(dummyCode);
  const [popOverOpen, setPopOverOpen] = useState(false);

  return (
    <div>
      <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
        <PopoverTrigger>
          <Button variant="outline">
            <AppWindow />
            {appDisplay}
            <ChevronsUpDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandList>
              {appList.map((item) => {
                return (
                  <CommandItem
                    onSelect={() => {
                      setAppDisplay(item.name), setPopOverOpen(false);
                    }}
                  >
                    <AppWindow />
                    <span>{item.name}</span>
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AppSwitcher;
