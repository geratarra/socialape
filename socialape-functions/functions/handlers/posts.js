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

    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
    }

    const newPost = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString()
    };

    db
        .collection('posts')
        .add(newPost)
        .then(doc => {
            const postRes = newPost;
            postRes.postId = doc.id;
            res.json(postRes)
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

// Add comment on post
exports.commentOnPost = (req, res) => {
    if (req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty' });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        postId: req.params.postId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/posts/${req.params.postId}`).get()
        .then(doc => {
            if (!doc.exists) return res.status(404).json({ error: 'Post not found' });

            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            db.collection('comments').add(newComment);
        })
        .then(() => {
            return res.json(newComment);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Something went wrong' });
        });
};

// Like a post
exports.likePost = (req, res) => {
    const likeDocument = db
        .collection('/likes')
        .where('userHandle', '==', req.user.handle)
        .where('postId', '==', req.params.postId).limit(1);

    const postDocument = db.doc(`/posts/${req.params.postId}`);

    let postData;

    postDocument.get()
        .then(doc => {
            if (doc.exists) {
                postData = doc.data();
                postData.postId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Post not found' });
            }
        })
        .then(data => {
            if (data.empty) {
                return db.collection('likes')
                    .add({
                        postId: req.params.postId,
                        userHandle: req.user.handle
                    })
                    .then(() => {
                        postData.likeCount++;
                        return postDocument.update({
                            likeCount: postData.likeCount
                        })
                    })
                    .then(() => {
                        return res.json(postData);
                    });
            } else {
                return res.status(400).json({ error: 'Post already liked ' });
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err.code });
        });
};

// Unlike a post
exports.unlikePost = (req, res) => {
    const likeDocument = db
        .collection('/likes')
        .where('userHandle', '==', req.user.handle)
        .where('postId', '==', req.params.postId).limit(1);

    const postDocument = db.doc(`/posts/${req.params.postId}`);

    let postData;

    postDocument.get()
        .then(doc => {
            if (doc.exists) {
                postData = doc.data();
                postData.postId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Post not found' });
            }
        })
        .then(data => {
            if (data.empty) {
                return res.status(400).json({ error: 'Post not liked ' });
            } else {
                return db
                    .doc(`/likes/${data.docs[0].id}`)
                    .delete()
                    .then(() => {
                        postData.likeCount = postData.likeCount > 0 ? --postData.likeCount : postData.likeCount;
                        return postDocument
                            .update({ likeCount: postData.likeCount });
                    })
                    .then(() => {
                        return res.json(postData);
                    });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}

// Delete post
exports.deletePost = (req, res) => {
    const document = db.doc(`/posts/${req.params.postId}`);
    document.get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Post not found' });
            }

            if (doc.data().userHandle !== req.user.handle) {
                return res.status(403).json({ error: 'Unauthorized' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            return res.json({ message: 'Post deleted successfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};