import React, { useState, Fragment } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import PropTypes from 'prop-types';

// MUI stuff
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

// MUI icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';

// Redux
import { connect } from 'react-redux';
import { markNotificationsRead } from '../../redux/actions/userActions';

const Link = require("react-router-dom").Link;

const Notifications = props => {
    const [anchorEl, setAnchorEl] = useState(null);
    const notifications = props.notifications;

    dayjs.extend(relativeTime);

    const handleOpen = (event) => {
        setAnchorEl(event.target);
    };

    const handleClose = (event) => {
        setAnchorEl(null);
    };

    const onMenuOpened = () => {
        let unreadNotificationsIds = props.notifications
            .filter(not => !not.read)
            .map(not => not.notificationId);
        props.markNotificationsRead(unreadNotificationsIds);
    };

    let notificationsMarkup;
    let notificationsIcon;
    if (notifications && notifications.length > 0) {
        const notificationsLength = notifications.filter(not => not.read === false).length;
        if (notificationsLength > 0) {
            notificationsIcon = (
                <Badge badgeContent={notificationsLength} color='secondary'>
                    <NotificationsIcon></NotificationsIcon>
                </Badge>
            );
        } else {
            notificationsIcon = <NotificationsIcon></NotificationsIcon>;
        }

        notificationsMarkup = notifications.map(not => {
            const verb = not.type === 'like' ? 'liked' : 'commented on';
            const time = dayjs(not.createdAt).fromNow();
            const iconColor = not.read ? 'primary' : 'secondary';
            let icon;
            if (not.type === 'like') {
                icon = <FavoriteIcon color={iconColor} style={{ marginRight: 10 }}></FavoriteIcon>
            } else {
                icon = <ChatIcon color={iconColor} style={{ marginRight: 10 }}></ChatIcon>
            }

            return (
                <MenuItem key={not.createdAt} onClick={handleClose}>
                    {icon}
                    <Typography
                        component={Link}
                        variant='body1'
                        to={`/users/${not.recipient}/post/${not.postId}`}>
                            {not.sender} {verb} your post {time}
                        </Typography>
                </MenuItem>
            );
        });
    } else {
        notificationsMarkup =
            <MenuItem onClick={handleClose}>
                You have no notifications yet
            </MenuItem>;
        notificationsIcon = <NotificationsIcon></NotificationsIcon>;
    }


    return (
        <Fragment>
            <Tooltip placement='top' title='Notifications'>
                <IconButton
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup='true'
                    onClick={handleOpen}
                >{notificationsIcon}</IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onEntered={onMenuOpened}>
                    {notificationsMarkup}
            </Menu>
        </Fragment>
    );
};

Notifications.propTypes = {
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
    notifications: state.user.notifications
});

export default connect(mapStateToProps, { markNotificationsRead })(Notifications);