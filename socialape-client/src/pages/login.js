import React from 'react';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { useForm } from '../utils/customHooks';

// MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const Link = require("react-router-dom").Link;

const styles = (theme) => ({...theme.general});

const Login = (props) => {
    const { classes, UI: { loading } } = props;
    const { inputs, handleInputChange } = useForm();
    const errors = props.UI.errors;

    const userData = {
        email: inputs.email,
        password: inputs.password
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        props.loginUser(userData, props.history);
    };

    return (
        <Grid container className={classes.form}>
            <Grid item sm />
            <Grid item sm>
                <img src={AppIcon} alt='monkey' className={classes.image} />
                <Typography variant='h2' className={classes.pageTitle}>
                    Login
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField helperText={errors?.email} error={errors?.email ? true : false} value={inputs.email} onChange={handleInputChange} fullWidth id='email' name='email' type='email' label='Email' className={classes.textField}></TextField>
                    <TextField helperText={errors?.password} error={errors?.password ? true : false} value={inputs.password} onChange={handleInputChange} fullWidth id='password' name='password' type='password' label='Password' className={classes.textField}></TextField>
                    {errors?.general && (
                        <Typography variant='body2' className={classes.customError}>{errors?.general}</Typography>
                    )}
                    <Button disabled={loading} type='submit' variant='contained' color='primary' className={classes.button}>
                        Login
                        {loading && (
                            <CircularProgress size={30} className={classes.progress}></CircularProgress>
                        )}
                    </Button>
                    <br/>
                    <small>Don't have an account ? Login <Link to='/signup'>here</Link></small>
                </form>
            </Grid>
            <Grid item sm />
        </Grid>
    );
};

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));