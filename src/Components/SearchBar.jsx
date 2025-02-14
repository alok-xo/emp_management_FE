import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
    return (
        <div className="search-box">
            {/* <FaSearch className="search-icon" /> */}
            <input type="text" placeholder="Search" />
        </div>
    );
};

export default SearchBar;
