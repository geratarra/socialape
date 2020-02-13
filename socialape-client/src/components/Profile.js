import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// MUI
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
// MUI icons
import LinkIcon from '@material-ui/icons/Link';
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

// Redux
import { connect } from 'react-redux';
import { logoutUser, uploadImage } from '../redux/actions/userActions';

const styles = (theme) => ({
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            },
            '& a': {
                color: '#00bcd4'
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        },
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    }
});

const Profile = (props) => {
    const {
        classes,
        user: {
            credentials: {
                handle, createdAt, imageUrl, bio, website, location
            },
            loading,
            authenticated
        },
    } = props;

    const handleImageChange = (event) => {
        const image = event.target.files[0];
        const formDate = new FormData();
        formDate.append('image', image, image.name);
        props.uploadImage(formDate);
    };

    const handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };

    let profileMarkup = !loading ? (authenticated ? (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img className='profile-image' src={imageUrl} alt="profile"/>
                    <input hidden='hidden' type="file" id='imageInput' onChange={handleImageChange}/>
                    <Tooltip title='Edit profile picture' placement='top'>
                        <IconButton onClick={handleEditPicture} className='button'>
                            <EditIcon color='primary'></EditIcon>
                        </IconButton>
                    </Tooltip>
                </div>
                <hr/>
                <div className="profile-details">
                    <MuiLink component={Link} to={`/user/${handle}`} color='primary' variant='h5'>
                        @{handle}
                    </MuiLink>
                    <hr/>
                    {bio && <Typography variant='body2'>{bio}</Typography>}
                    <hr/>
                    {location && (
                        <Fragment>
                            <LocationOn color='primary' /> <span>{location}</span>
                            <hr/>
                        </Fragment>
                    )}
                    {website && (
                        <Fragment>
                            <LinkIcon color='primary'/>
                            <a href={website} target='_blank' rel='noopener noreferrer'>
                                {' '}{website}
                            </a>
                            <hr/>
                        </Fragment>
                    )}
                    <CalendarToday color='primary'/>{' '}
                    <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                </div>
            </div>
        </Paper>
    ) : (
        <Paper className={classes.paper}>
            <Typography variant='body2' align='center'>
                No profile found, please login again
            </Typography>
            <div className={classes.buttons}>
                <Button variant='contained' color='primary' component={Link} to='/login'>Login</Button>
                <Button variant='contained' color='secondary' component={Link} to='/signup'>Signup</Button>
            </div>
        </Paper>
    )) : (<p>Loading...</p>);

    return (
        profileMarkup
    );
};

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
};

const mapActionsToProps = { logoutUser, uploadImage };

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));