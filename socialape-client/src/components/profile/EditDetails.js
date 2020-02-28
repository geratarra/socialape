import React, { Fragment, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import TooltipButton from '../post/TooltipButton';

// Redux
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

// MUI
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import EditIcon from '@material-ui/icons/Edit';

const styles = (theme) => ({ ...theme.general, button: { float: 'right' } });

const EditDetails = (props) => {
    const [open, setOpen] = useState(false);
    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');
    const [location, setLocation] = useState('');

    // const { inputs, handleInputChange } = useForm();

    const { classes, credentials } = props;

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        if (bio === '' || website === '' || location === '') {
            setInputs();
        }
        setOpen(false);
    };

    const handleSubmit = () => {
        const userDetails = {
            bio: bio,
            website: website,
            location: location
        };
        props.editUserDetails(userDetails);
        handleClose();
    };

    const handleInputChange = (event) => {
        switch (event.target.name) {
            case 'bio':
                setBio(event.target.value);
                break;
            case 'location':
                setLocation(event.target.value);
                break;
            case 'website':
                setWebsite(event.target.value);
                break;
            default:
                break;
        }
    };

    const setInputs = useCallback(() => {
        setBio(credentials.bio ? credentials.bio : '');
        setWebsite(credentials.website ? credentials.website : '');
        setLocation(credentials.location ? credentials.location : '');
    }, [credentials.bio, credentials.website, credentials.location]);

    useEffect(() => {
        setInputs();
    }, [setInputs]);

    return (
        <Fragment>
            <TooltipButton tip='Edit details' onClick={handleOpen} btnClassName={classes.button}>
                <EditIcon color='primary'></EditIcon>
            </TooltipButton>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
                <DialogTitle>Edit your details</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            name='bio'
                            type='text'
                            label='Bio'
                            multiline
                            rows='3'
                            placeholder='A short bio about yourself'
                            className={classes.textField}
                            value={bio}
                            onChange={handleInputChange}
                            fullWidth></TextField>
                        <TextField
                            name='website'
                            type='text'
                            label='Website'
                            placeholder='Your personal/professional website'
                            className={classes.textField}
                            value={website}
                            onChange={handleInputChange}
                            fullWidth></TextField>
                        <TextField
                            name='location'
                            type='text'
                            label='Location'
                            placeholder='Where you live'
                            className={classes.textField}
                            value={location}
                            onChange={handleInputChange}
                            fullWidth></TextField>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>Cancel</Button>
                    <Button onClick={handleSubmit} color='primary' disabled={bio === '' || website === '' || location === ''}>Save</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

EditDetails.prototype = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
});

export default connect(mapStateToProps, { editUserDetails })(withStyles(styles)(EditDetails));