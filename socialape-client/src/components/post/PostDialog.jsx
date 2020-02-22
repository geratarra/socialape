import React, { Fragment, useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import TooltipButton from './TooltipButton';
import LikeButton from './LikeButton';
import Comments from './Comments';

// MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';

// MUI icons
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';

import { connect } from 'react-redux';
import { getPost } from '../../redux/actions/dataActions';
import { DialogContent } from '@material-ui/core';

const Link = require("react-router-dom").Link;

const styles = (theme) => ({
    ...theme.general,
    profileImage: {
        width: '90%',
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        right: 0
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    },
    expandButton: {
        position: 'absolute',
        right: '4%'
    }
});

const PostDialog = props => {
    const [open, setOpen] = useState(false);
    const {
        classes,
        post: {
            body,
            createdAt,
            likeCount,
            commentCount,
            postId,
            userImage,
            userHandle,
            comments
        },
        UI: { loading }
    } = props;

    const handleOpen = () => {
        setOpen(true);
        props.getPost(props.postId);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const dialogMarkup = loading ? (
        <div className={classes.spinnerDiv}>
            <CircularProgress size={50} thickness={2}></CircularProgress>
        </div>
    ) : (
            <Grid container spacing={2}>
                <Grid item sm={5} style={{textAlign: 'center'}}>
                    <img src={userImage} alt="profile" className={classes.profileImage} />
                </Grid>
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        variant='h5'
                        color='primary'
                        to={`/users/${userHandle}`}>
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography
                        variant='body2'
                        color='textSecondary'>
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography
                        variant='body1'>
                        {body}
                    </Typography>
                    <LikeButton postId={postId}></LikeButton>
                    <span>{likeCount} likes</span>
                    <TooltipButton tip='Comments'>
                        <ChatIcon color='primary'></ChatIcon>
                    </TooltipButton>
                    <span>{commentCount} comments</span>
                </Grid>
                <hr className={classes.visibleSeparator}></hr>
                <Comments comments={comments}></Comments>
            </Grid>
        );

    return (
        <Fragment>
            <TooltipButton onClick={handleOpen} tip='Expand Post' tipClassName={classes.expandButton}>
                <UnfoldMore color='primary'></UnfoldMore>
            </TooltipButton>
            <Dialog
                open={open}
                onClose={handleClose} fullWidth maxWidth='sm'>
                <TooltipButton tip='Close' onClick={handleClose} tipClassName={classes.closeButton}>
                    <CloseIcon></CloseIcon>
                </TooltipButton>
                <DialogContent className={classes.dialogContent}>
                    {dialogMarkup}
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

PostDialog.propTypes = {
    getPost: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    post: state.data.post,
    UI: state.UI
});

export default connect(mapStateToProps, { getPost })(withStyles(styles)(PostDialog));