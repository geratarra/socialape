import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import Post from '../components/Post';
import Profile from '../components/Profile';

const Home = () => {
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        axios
            .get('/posts')
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    let recentPostsMarkup = posts ? (
        posts.map(post => {
            return <Post key={post.postId} post={post}/>
        })
    ) : <p>Loading...</p>;

    return (
        <Grid container spacing={10}>
            <Grid item sm={8} xs={12}>
                {recentPostsMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                <Profile></Profile>
            </Grid>
        </Grid>
    );
};

export default Home;