// src/components/tasks/list/SearchBar.tsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store/store";
import { setSearchTerm } from "@/store/taskSlice";
import { useCallback, useState } from "react";
import debounce from "lodash/debounce";

export function SearchBar() {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: RootState) => state.tasks.filters.searchTerm);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const debouncedSearch = useCallback(
    (term: string) => {
      debounce((searchValue: string) => {
        dispatch(setSearchTerm(searchValue));
      }, 300)(term);
    },
    [dispatch]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search tasks..."
        value={localSearch}
        onChange={handleSearch}
        className="pl-8 w-full md:w-[300px]"
      />
    </div>
  );
}
