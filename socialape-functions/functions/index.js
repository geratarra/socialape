const functions = require('firebase-functions');
const app = require('express')();
const {
    getPosts,
    postPost,
    getPost,
    commentOnPost,
    unlikePost,
    likePost,
    deletePost
} = require('./handlers/posts');
const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser
} = require('./handlers/users');
const FBAuth = require('./utils/fbAuth');

// Posts routes
app.get('/posts', getPosts);
app.post('/post', FBAuth, postPost);
app.get('/post/:postId', getPost);
app.delete('/post/:postId', FBAuth, deletePost);
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unlikePost);
app.post('/post/:postId/comment', FBAuth, commentOnPost);

// Users route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);