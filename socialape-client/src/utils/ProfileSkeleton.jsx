import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import NoImg from '../images/no-img.png';

// MUI
import Paper from '@material-ui/core/Paper';

// MUI icons
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = (theme) => ({
    ...theme.general,
    handle: {
        height: 20,
        backgroundColor: theme.palette.primary.main,
        width: 60,
        margin: '0 auto 7px auto'
    },
    fullLine: {
        height: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: '100%',
        marginBottom: 10
    },
    halfLine: {
        height: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: '50%',
        marginBottom: 10
    }
});

const ProfileSkeleton = props => {
    const { classes } = props;
    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className='image-wrapper'>
                    <img src={NoImg} alt='profile' className='profile-image'/>
                </div>
                <hr/>
                <div className='profile-details'>
                    <div className={classes.handle}></div>
                    <hr/>
                    <div className={classes.fullLine}></div>
                    <div className={classes.fullLine}></div>
                    <hr/>
                    <LocationOn color='primary'></LocationOn><span>Location</span>
                    <hr/>
                    <LocationOn color='primary'></LocationOn>https://website.com
                    <hr/>
                    <CalendarToday color='primary'></CalendarToday>Joined date
                </div>
            </div>
        </Paper>
    );
};

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileSkeleton);