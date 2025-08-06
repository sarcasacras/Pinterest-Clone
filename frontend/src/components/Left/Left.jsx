import './Left.css';
import Img from '../Image/Image';
import { Link } from 'react-router'

const Left = () => {
    return (
        <div className='left-container'>
            <div className="menu-icons">
                <Link to="/">
                    <Img src='icons/logo.png' alt="logo" className='logo' />
                </Link>
                <Link to="/">
                    <Img src='icons/home.svg' alt="home" className='menu-item' />
                </Link>
                <Link to="/">
                    <Img src='icons/add.svg' alt="add" className='menu-item' />
                </Link>
                <Link to="/">
                    <Img src='icons/notification.svg' alt="notification" className='menu-item' />
                </Link>
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