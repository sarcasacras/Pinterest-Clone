import './Left.css';
import Img from '../Image/Image';
import { Link } from 'react-router';
import { useState } from 'react';
import Notifications from '../Notifications/Notifications';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../../api/notificationsApi';

const Left = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: notifications, isLoading, error } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => notificationsApi.getNotifications(),
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: notificationsApi.markAllAsRead,
        onSuccess: (data) => {
            console.log('All notifications marked as read:', data);
            queryClient.invalidateQueries(['notifications']);
        },
    });

    const toggleNotifications = () => {
        if (!isNotificationsOpen) {
            markAllAsReadMutation.mutate();
        }
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
                    <div className="notification-icon-wrapper">
                        <Img 
                            src='icons/notification.svg' 
                            alt="notification" 
                            className='menu-item' 
                            onClick={toggleNotifications}
                        />
                        {notifications?.notifications?.some(n => !n.isRead) && (
                            <div className="notification-badge"></div>
                        )}
                    </div>
                    {isNotificationsOpen && (
                        <Notifications 
                            onClose={() => setIsNotificationsOpen(false)}
                            notifications={notifications}
                            isLoading={isLoading}
                            error={error}
                        />
                    )}
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