import './Top.css';
import Searchbar from '../Searchbar/Searchbar';
import UserIcon from '../UserIcon/UserIcon';

const Top = () => {
    return (
        <div className="topContainer">
            <Searchbar />
            <UserIcon />
        </div>
    )
}

export default Top;