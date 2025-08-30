import './Top.css';
import Searchbar from '../Searchbar/Searchbar';
import UserIcon from '../UserIcon/UserIcon';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router';

const Top = () => {
    const { user } = useAuth();

    return (
        <div className="topContainer">
            <Searchbar />
            {user ? (
                <UserIcon />
            ) : (
                <Link to="/login" className="mobile-login-btn">
                    Log In
                </Link>
            )}
        </div>
    )
}

export default Top;