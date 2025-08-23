import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { AppWindow, ChevronsUpDown, Loader2 } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContext";
import type { App } from "@/dataTypes/reviewTypes";

const AppSwitcher = () => {
  const { state, actions } = useGlobalContext();
  const [popOverOpen, setPopOverOpen] = useState(false);

  // Get display text for current app
  const getDisplayText = () => {
    if (state.isLoadingApps) return "Loading apps...";
    if (!state.currentApp) return "Select an app";
    return state.currentApp.name;
  };

  const handleAppSelect = async (app: App) => {
    try {
      await actions.setCurrentApp(app);
      setPopOverOpen(false);
    } catch (error) {
      console.error("Error selecting app:", error);
    }
  };

  return (
    <div>
      <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" disabled={state.isLoadingApps}>
            {state.isLoadingApps ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <AppWindow className="h-4 w-4" />
            )}
            {getDisplayText()}
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Search apps..." />
            <CommandList>
              <CommandEmpty>No apps found.</CommandEmpty>
              <CommandGroup>
                {state.appsList.map((app) => (
                  <CommandItem
                    key={app.id}
                    onSelect={() => handleAppSelect(app)}
                    className="cursor-pointer"
                  >
                    <AppWindow className="h-4 w-4 mr-2" />
                    <span>{app.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AppSwitcher;
