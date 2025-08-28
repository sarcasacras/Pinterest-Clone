import './Left.css';
import Img from '../Image/Image';
import { Link } from 'react-router';
import { useState } from 'react';
import Notifications from '../Notifications/Notifications';

const Left = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    return (
        <div className='left-container'>
            <div className="menu-icons">
                <Link to="/">
                    <Img src='icons/website_logo.png' alt="logo" className='logo' />
                </Link>
                <Link to="/">
                    <Img src='icons/home.svg' alt="home" className='menu-item' />
                </Link>
                <Link to="/create">
                    <Img src='icons/add.svg' alt="add" className='menu-item' />
                </Link>
                <button className='menu-button'>
                    <Img 
                        src='icons/notification.svg' 
                        alt="notification" 
                        className='menu-item' 
                        onClick={toggleNotifications}
                    />
                    {isNotificationsOpen && <Notifications onClose={() => setIsNotificationsOpen(false)} />}
                </button>
                <Link to="/">
                    <Img src='icons/message.svg' alt="messages" className='menu-item' />
                </Link>
            </div>
            <div className="bottom-icon">
                <Link to="/">
                    <Img src='icons/settings.svg' alt="settings" className='menu-item' />
                </Link>
            </div>
        </div>
    )
}

export default Left;