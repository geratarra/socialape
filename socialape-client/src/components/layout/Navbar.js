import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TooltipButton from '../post/TooltipButton';
import CreatePost from '../post/CreatePost';
import Notifications from './Notifications';

// MaterialUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

// MUI icons
import Home from '@material-ui/icons/Home';

const Link = require("react-router-dom").Link;

const Navbar = (props) => {
    const { authenticated } = props;

    return (
        <AppBar>
            <Toolbar className='nav-container'>
                {authenticated ? (
                    <Fragment>
                        <CreatePost></CreatePost>
                        <Link to='/'>
                            <TooltipButton tip='Home'>
                                <Home></Home>
                            </TooltipButton>
                        </Link>
                        <Notifications></Notifications>
                    </Fragment>
                ) : (
                        <Fragment>
                            <Button color='inherit' component={Link} to='/login'>
                                Login
                        </Button>
                            <Button color='inherit' component={Link} to='/'>
                                Home
                        </Button>
                            <Button color='inherit' component={Link} to='/signup'>
                                Signup
                        </Button>
                        </Fragment>
                    )}
            </Toolbar>
        </AppBar>
    );
};

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({ authenticated: state.user.authenticated });

export default connect(mapStateToProps)(Navbar);