import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import PropTypes from 'prop-types';
import TooltipButton from './TooltipButton';
import DeletePost from './DeletePost';
import PostDialog from './PostDialog';
import LikeButton from './LikeButton';

// MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// MUI icons
import ChatIcon from '@material-ui/icons/Chat';

import { connect } from 'react-redux';

const Link = require("react-router-dom").Link;

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover',
        width: '100%'
    }
};

const Post = (props) => {
    const { classes, post: { body, createdAt, userImage, userHandle, likeCount, commentCount, postId }, user: { authenticated, credentials: { handle } } } = props;
    dayjs.extend(relativeTime);

    const deleteButton = authenticated && userHandle === handle ? (
        <DeletePost postId={postId}></DeletePost>
    ) : null;

    return (
        <Card className={classes.card}>
            <CardMedia
                image={userImage}
                title="Profile image"
                className={classes.image} />
            <CardContent className={classes.content}>
                <Typography component={Link} to={`/users/${userHandle}`} variant='h5' color='primary'>{userHandle}</Typography>
                {deleteButton}
                <Typography variant='body2' color='textSecondary'>{dayjs(createdAt).fromNow()}</Typography>
                <Typography variant='body1'>{body}</Typography>
                <LikeButton postId={postId}/>
                <span>{likeCount} likes</span>
                <TooltipButton tip='Comments'>
                    <ChatIcon color='primary'></ChatIcon>
                </TooltipButton>
                <span>{commentCount ? commentCount : '0'} comments</span>
                <PostDialog postId={postId} userHandle={userHandle}></PostDialog>
            </CardContent>
        </Card>
    );
};

Post.propTypes = {
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));