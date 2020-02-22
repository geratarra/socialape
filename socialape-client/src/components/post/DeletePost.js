import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import TooltipButton from './TooltipButton';

// MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

// MUI icons
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';
import { deletePost } from '../../redux/actions/dataActions';

const styles = {
    deleteButton: {
        float: 'right'
    }
};

const DeletePost = (props) => {
    const { classes } = props;
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deletePost = () => {
        props.deletePost(props.postId);
        setOpen(false);
    };

    return (
        <Fragment>
            <TooltipButton tip='Delete Post' onClick={handleOpen} btnClassName={classes.deleteButton}>
                <DeleteOutline color='secondary'></DeleteOutline>
            </TooltipButton>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
                <DialogTitle>Are you sure you want to delete this post ?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>Cancel</Button>
                    <Button onClick={deletePost} color='secondary'>Delete</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

DeletePost.propTypes = {
    deletePost: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
};

export default connect(null, { deletePost })(withStyles(styles)(DeletePost));