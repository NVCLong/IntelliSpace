import React from 'react'
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input"

const SearchBar = () => {
  return (
        <form>
          <div className="relative flex items-center drop-shadow-lg">
            <FiSearch className="absolute w-10 mr-2 text-gray-500" />
            <Input
              className="w-full pl-8 bg-white rounded-full appearance-none "
              placeholder="Search..."
              type="search"
            />
          </div>
        </form>

  )
}

export default SearchBar
