const { db } = require('../utils/admin');

exports.getPosts = (req, res) => {
    console.log('Route: /posts\nMethod: get');

    db
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let posts = [];
            data.forEach(doc => {
                posts.push({
                    postId: doc.id,
                    ...doc.data()
                });
            });
            return res.json(posts);
        })
        .catch(err => {
            console.error(err);
        });
};

exports.postPost = (req, res) => {
    console.log('Route: /posts\nMethod: post');

    const newPost = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    };

    db
        .collection('posts')
        .add(newPost)
        .then(doc => {
            res.json({ message: `Document: ${doc.id} created successfully` })
        })
        .catch(err => {
            res.status(500).json({ error: 'Something went wrong' });
            console.error(err);
        });
};

exports.getPost = (req, res) => {
    let postData = {};
    
    db.doc(`/posts/${req.params.postId}`)
        .get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(400).json({ error: 'Post not found' });
            }

            postData = doc.data();
            postData.postId = doc.id;
            
            return db.collection('comments')
                .orderBy('createdAt', 'desc')
                .where('postId', '==', req.params.postId)
                .get();
        })
        .then(data => {
            postData.comments = [];
            data.forEach(doc => {
                postData.comments.push(doc.data());
            });
            return res.json(postData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

exports.commentOnPost = (req, res) => {
    
};