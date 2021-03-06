import React, { Fragment, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
// import { useForm } from '../../utils/customHooks';
import TooltipButton from './TooltipButton';

// MUI
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux
import { connect } from 'react-redux';
import { createPost, clearErrors } from '../../redux/actions/dataActions';

const styles =theme => ({
    ...theme.general,
    submitButton: {
        position: 'relative'
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
});

const CreatePost = props => {
    const [open, setOpen] = useState(false);
    const [bodyInput, setBodyInput] = useState('');
    // const { inputs, handleInputChange } = useForm();

    const { classes, UI: { loading, errors } } = props;

    const handleOpen = () => {
        setOpen(true);
    };

    const { clearErrors } = props;
    const handleClose = useCallback(() => {
        setBodyInput('');
        setOpen(false);
        clearErrors();
    }, [clearErrors]);

    const handleSubmit = () => {
        props.createPost({ body: bodyInput });
    };

    const handleInputChange = (event) => {
        setBodyInput(event.target.value);
    };

    useEffect(() => {
        if (!errors && !loading) {
            handleClose();
            setBodyInput('');
        }
    }, [errors, loading, handleClose]);

    return (
        <Fragment>
            <TooltipButton tip='Create a Post' onClick={handleOpen}>
                <AddIcon></AddIcon>
            </TooltipButton>
            <Dialog
                open={open}
                onClose={handleClose} fullWidth maxWidth='sm'>
                <TooltipButton tip='Close' onClick={handleClose} tipClassName={classes.closeButton}>
                    <CloseIcon></CloseIcon>
                </TooltipButton>
                <DialogTitle>Create a new Post</DialogTitle>
                <DialogContent>
                    <form noValidate>
                        <TextField
                            name='bodyInput'
                            type='text'
                            label='Post'
                            multiline
                            rows='3'
                            value={bodyInput}
                            placeholder='Create a post to your fellow apes'
                            error={errors?.body ? true : false}
                            helperText={errors?.body}
                            className={classes.textField}
                            onChange={handleInputChange}
                            fullWidth
                        ></TextField>
                        <Button
                            onClick={handleSubmit}
                            variant='contained'
                            color='primary'
                            className={classes.submitButton}
                            disabled={loading || bodyInput === ''}
                        >
                            Submit
                            {loading && (<CircularProgress size={30} className={classes.progressSpinner} />)}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

CreatePost.propTypes = {
    createPost: PropTypes.func.isRequired,
    clearErrors:PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI
});

export default connect(mapStateToProps, { createPost, clearErrors })(withStyles(styles)(CreatePost));
