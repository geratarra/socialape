import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Post from '../components/post/Post';
import StaticProfile from '../components/post/StaticProfile';
import PostSkeleton from '../utils/PostSkeleton';
import ProfileSkeleton from '../utils/ProfileSkeleton';

// MUI
import Grid from '@material-ui/core/Grid';

// Redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

import axios from 'axios';

const User = (props) => {
    const [profile, setProfile] = useState(null);
    const [postId, setPostId] = useState(null);
    const { posts, loading } = props.data;

    
    const handle = props.match.params.handle;
    const postIdParam = props.match.params.postId;
    const getUserData = props.getUserData;
    useEffect(() => {
        if (postIdParam) setPostId(postIdParam);

        getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res => {
                setProfile(res.data.user);
            })
            .catch(err => console.error(err));
    }, [handle, postIdParam, getUserData]);

    const postsMarkup = loading ? (
        <PostSkeleton></PostSkeleton>
    ) : posts === null ? (
        <p>No posts from this user</p>
    ) : !postId ? (
        posts.map(post => <Post key={post.postId} post={post}></Post>)
    ) : (
        posts.map(post => {
            if (post.postId !== postId) {
                return <Post key={post.postId} post={post}></Post>
            } else { return <Post key={post.postId} post={post} openDialog></Post> }
        })
    );

    return (
        <Grid container spacing={10}>
            <Grid item sm={8} xs={12}>
                {postsMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                {profile === null ? (
                    <ProfileSkeleton></ProfileSkeleton>
                ) : (
                    <StaticProfile profile={profile}></StaticProfile>
                )}
            </Grid>
        </Grid>
    );
};

User.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
   data: state.data
});

export default connect(mapStateToProps, { getUserData })(User);