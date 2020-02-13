import React from 'react';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { useForm } from '../utils/customHooks';

// Redux
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

// MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const Link = require("react-router-dom").Link;

const styles = (theme) => ({...theme.general});

const Signup = (props) => {
    const { classes, UI: { loading } } = props;
    const { inputs, handleInputChange } = useForm();
    const errors = props.UI.errors;

    const newUserData = {
        email: inputs.email,
        password: inputs.password,
        confirmPassword: inputs.confirmPassword,
        handle: inputs.handle
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        props.signupUser(newUserData, props.history);
    };

    return (
        <Grid container className={classes.form}>
            <Grid item sm />
            <Grid item sm>
                <img src={AppIcon} alt='monkey' className={classes.image} />
                <Typography variant='h2' className={classes.pageTitle}>
                    Sign up
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField helperText={errors?.email} error={errors?.email ? true : false} value={inputs.email} onChange={handleInputChange} fullWidth id='email' name='email' type='email' label='Email' className={classes.textField}></TextField>
                    <TextField helperText={errors?.password} error={errors?.password ? true : false} value={inputs.password} onChange={handleInputChange} fullWidth id='password' name='password' type='password' label='Password' className={classes.textField}></TextField>
                    <TextField helperText={errors?.confirmPassword} error={errors?.confirmPassword ? true : false} value={inputs.confirmPassword} onChange={handleInputChange} fullWidth id='confirmPassword' name='confirmPassword' type='password' label='Confirm Password' className={classes.textField}></TextField>
                    <TextField helperText={errors?.handle} error={errors?.handle ? true : false} value={inputs.handle} onChange={handleInputChange} fullWidth id='handle' name='handle' type='text' label='Handle' className={classes.textField}></TextField>
                    {errors?.general && (
                        <Typography variant='body2' className={classes.customError}>{errors.general}</Typography>
                    )}
                    <Button disabled={loading} type='submit' variant='contained' color='primary' className={classes.button}>
                        Sign up
                        {loading && (
                            <CircularProgress size={30} className={classes.progress}></CircularProgress>
                        )}
                    </Button>
                    <br/>
                    <small>Already an account ? Sign up <Link to='/login'>here</Link></small>
                </form>
            </Grid>
            <Grid item sm />
        </Grid>
    );
};

Signup.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

export default connect(mapStateToProps, { signupUser })(withStyles(styles)(Signup));