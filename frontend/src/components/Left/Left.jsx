import './Left.css';
import Img from '../Image/Image';

const Left = () => {
    return (
        <div className='left-container'>
            <div className="menu-icons">
                <a href="/">
                    <Img src='icons/logo.png' alt="logo" className='logo' />
                </a>
                <a href="/">
                    <Img src='icons/home.svg' alt="home" className='menu-item' />
                </a>
                <a href="/">
                    <Img src='icons/add.svg' alt="add" className='menu-item' />
                </a>
                <a href="/">
                    <Img src='icons/notification.svg' alt="notification" className='menu-item' />
                </a>
                <a href="/">
                    <Img src='icons/message.svg' alt="messages" className='menu-item' />
                </a>
            </div>
            <div className="bottom-icon">
                <a href="/">
                    <Img src='icons/settings.svg' alt="settings" className='menu-item' />
                </a>
            </div>
        </div>
    )
}

export default Left;