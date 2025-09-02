import './Left.css';
import Img from '../Image/Image';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import Notifications from '../Notifications/Notifications';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../../api/notificationsApi';
import { messagesApi } from '../../api/messagesApi';
import { useAuth } from '../../contexts/AuthContext';

const Left = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: notifications, isLoading, error } = useQuery({
        queryKey: ["notifications", currentPage],
        queryFn: () => notificationsApi.getNotifications({ page: currentPage, limit: 6 }),
        enabled: !!user,
    });

    const { data: unreadCount } = useQuery({
        queryKey: ["unread-messages-count"],
        queryFn: () => messagesApi.getUnreadCount(),
        staleTime: 5 * 60 * 1000, // 5 minutes - consider data fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnReconnect: false, // Don't refetch on network reconnect
        refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes automatically
        enabled: !!user, // Only run query if user is logged in
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: notificationsApi.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        },
    });

    const deleteAllNotificationsMutation = useMutation({
        mutationFn: notificationsApi.deleteAllNotifications,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        },
    });


    const toggleNotifications = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        if (!isNotificationsOpen) {
            markAllAsReadMutation.mutate();
        }
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
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
                            onDeleteAll={deleteAllNotificationsMutation.mutate}
                            currentPage={currentPage}
                            totalPages={notifications?.totalPages || 1}
                            onPageChange={handlePageChange}
                        />
                    )}
                </button>
                <Link to="/messages">
                    <div className="notification-icon-wrapper">
                        <Img src='icons/message.svg' alt="messages" className='menu-item' />
                        {unreadCount?.unreadCount > 0 && (
                            <div className="notification-badge"></div>
                        )}
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Left;