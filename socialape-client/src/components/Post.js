import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

// MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const Link = require("react-router-dom").Link;

const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};

const Post = (props) => {
    const { classes, post: { body, createdAt, userImage, userHandle } } = props;
    dayjs.extend(relativeTime);

    return (
        <Card className={classes.card}>
            <CardMedia
                image={userImage}
                title="Profile image"
                className={classes.image} />
            <CardContent className={classes.content}>
                <Typography component={Link} to={`/users/${userHandle}`} variant='h5' color='primary'>{userHandle}</Typography>
                <Typography variant='body2' color='textSecondary'>{dayjs(createdAt).fromNow()}</Typography>
                <Typography variant='body1'>{body}</Typography>
            </CardContent>
        </Card>
    );
};

export default withStyles(styles)(Post);