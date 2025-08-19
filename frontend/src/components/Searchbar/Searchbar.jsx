import Img from "../Image/Image";
import "./Searchbar.css";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Searchbar() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${searchValue}`);
    }
  };

  return (
    <div className="search">
      <Img src="/icons/search.svg" alt="" className="searchIcon" />
      <input
        onKeyDown={handleKeyDown}
        onChange={handleSearch}
        type="text"
        placeholder="Search"
        className="searchInput"
      />
    </div>
  );
}
