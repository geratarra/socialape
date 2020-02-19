import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import PropTypes from 'prop-types';
import TooltipButton from '../components/TooltipButton';

// MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// MUI icons
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon  from '@material-ui/icons/Favorite';
import FavoriteBorder  from '@material-ui/icons/FavoriteBorder';

import { connect } from 'react-redux';
import { likePost, unlikePost } from '../redux/actions/dataActions';

const Link = require("react-router-dom").Link;

const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};

const Post = (props) => {
    const { classes, post: { body, createdAt, userImage, userHandle, likeCount, commentsCount }, user: { authenticated } } = props;
    dayjs.extend(relativeTime);

    const likedPost = () => {
        if (props.user.likes && props.user.likes.find(like => like.postId === props.post.postId)) {
            return true;
        } else { return false; }
    };

    const likePost = () => {
        props.likePost(props.post.postId);
    };

    const unlikePost = () => {
        props.unlikePost(props.post.postId);
    };

    const likeButton = !authenticated ?
        (
            <TooltipButton tip='Like'>
                <Link to='/login'>
                    <FavoriteBorder color='primary'></FavoriteBorder>
                </Link>
            </TooltipButton>
        ) : (
            likedPost() ?
                (
                    <TooltipButton tip='Undo like' onClick={unlikePost}>
                        <FavoriteIcon color='primary'></FavoriteIcon>
                    </TooltipButton>
                ) : (
                    <TooltipButton tip='Like' onClick={likePost}>
                        <FavoriteBorder color='primary'></FavoriteBorder>
                    </TooltipButton>
                )
        );

    return (
        <Card className={classes.card}>
            <CardMedia
                image={userImage}
                title="Profile image"
                className={classes.image} />
            <CardContent className={classes.content}>
                <Typography component={Link} to={`/users/${userHandle}`} variant='h5' color='primary'>{userHandle}</Typography>
                <Typography variant='body2' color='textSecondary'>{dayjs(createdAt).fromNow()}</Typography>
                <Typography variant='body1'>{body}</Typography>
                {likeButton}
                <span>{likeCount} likes</span>
                <TooltipButton tip='comments'>
                    <ChatIcon color='primary'></ChatIcon>
                </TooltipButton>
                <span>{commentsCount} comments</span>
            </CardContent>
        </Card>
    );
};

Post.propTypes = {
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    likePost,
    unlikePost,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Post));