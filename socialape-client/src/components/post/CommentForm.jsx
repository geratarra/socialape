import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../../utils/customHooks';

// MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// Redux
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme.general
});

const CommentForm = props => {
    const { classes, authenticated } = props;
    const errors = props.UI.errors;
    const { inputs, handleInputChange } = useForm();

    const handleSubmit = (event) => {
        event.preventDefault();
        props.submitComment(props.postId, { body: inputs.commentInputField });
        inputs.commentInputField = '';
    };

    const commentFormMarkup = authenticated ? (
        <Grid item sm={12} style={{ textAlign: 'center' }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    name='commentInputField'
                    type='text'
                    label='Comment on Post'
                    className={classes.textField}
                    onChange={handleInputChange}
                    value={inputs.commentInputField}
                    error={errors?.comment ? true : false}
                    helperText={errors?.comment}
                    fullWidth/>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        className={classes.button}>Submit</Button>
                        <hr className={classes.visibleSeparator}/>
            </form>
        </Grid>
    ) : (null);

    return commentFormMarkup;
};

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    authenticated: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm));