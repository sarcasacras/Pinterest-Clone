import Img from '../Image/Image';
import './Searchbar.css';

export default function Searchbar() {
  return (
    <div className="search">
      <Img src="/icons/search.svg" alt="" className="searchIcon" />
      <input type="text" placeholder="Search" className="searchInput" />
    </div>
  );
}
