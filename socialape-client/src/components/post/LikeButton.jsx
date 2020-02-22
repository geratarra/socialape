import React from 'react';
import PropTypes from 'prop-types';
import TooltipButton from './TooltipButton';

// MUI icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import { connect } from 'react-redux';
import { likePost, unlikePost } from '../../redux/actions/dataActions';

const Link = require("react-router-dom").Link;

const LikeButton = props => {
    const { authenticated } = props.user;

    const likedPost = () => {
        if (props.user.likes && props.user.likes.find(like => like.postId === props.postId)) {
            return true;
        } else { return false; }
    };

    const likePost = () => {
        props.likePost(props.postId);
    };

    const unlikePost = () => {
        props.unlikePost(props.postId);
    };

    const likeButton = !authenticated ?
        (
            <Link to='/login'>
                <TooltipButton tip='Like'>
                    <FavoriteBorder color='primary'></FavoriteBorder>
                </TooltipButton>
            </Link>
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

    return likeButton;
};

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
};

const mapActionsToProps = {
    likePost,
    unlikePost,
};

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);