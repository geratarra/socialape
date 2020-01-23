const { db, admin } = require('../utils/admin');
const firebaseConfig = require('../utils/config');
const firebase = require('firebase');
const { validateSignupData, validateLoginData, reduceUserDetail } = require('../utils/validators');

firebase.initializeApp(firebaseConfig);

// Log in handler
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token })
        })
        .catch(err => {
            console.error(err);
            // auth/wrong-password
            // auth/user-not-found
            return res.status(403).json({ general: 'Wrong credentials, please try again' });
        });
};

// Sign up handler
exports.signup = (req, res) => {
    console.log('Route: /signup\nMethod: post');

    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const { valid, errors } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);

    const noImg = 'np-img.png';

    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'this handle is already taken' });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
                    .then(data => {
                        userId = data.user.uid;
                        return data.user.getIdToken();
                    })
                    .then(_token => {
                        token = _token;
                        const userCredentials = {
                            handle: newUser.handle,
                            email: newUser.email,
                            createdAt: new Date().toISOString(),
                            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
                            userId
                        };
                        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
                    })
                    .then(() => {
                        return res.status(201).json({ token });
                    })
                    .catch(err => {
                        console.error(err);
                        if (err.code === 'auth/email-already-in-use') {
                            return res.status(400).json({ email: 'Email is already in use' });
                        } else {
                            return res.status(500).json({ general: 'Something went wrong, please try again' });
                        }
                    });
            }
        });
};

// Get own user details
exports.getAuthenticatedUser = (req, res) => {
    console.log('Route: /user getAuthenticatedUser');

    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data();
                return db.collection('likes').where('userHandle', '==', req.user.handle).get();
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return db.collection('notifications').where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'desc').limit(10).get();
        })
        .then(data => {
            userData.notifications = [];
            data.forEach(doc => {
                userData.notifications.push({
                    ...doc.data(),
                    notificationId: doc.id
                });
            });
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// Add user details
exports.addUserDetails = (req, res) => {
    console.log('Route: /user');

    let userDetails = reduceUserDetail(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Details added successfully' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// Profile image upload handler
exports.uploadImage = (req, res) => {
    console.log('Route: /user/image');

    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busBoy = new BusBoy({ headers: req.headers });

    let imageFileName, imageToBeUploaded = {};

    busBoy.on('file', (fieldName, file, fileName, encoding, mimetype) => {
        console.log(fieldName);
        console.log(fileName);
        console.log(mimetype);

        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted' });
        }

        const splitFileName = fileName.split('.');
        const imageExtension = splitFileName[splitFileName.length - 1];
        imageFileName = `${Math.round(Math.random() * 1000000000)}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimetype };
        file.pipe(fs.createWriteStream(filePath));
    });

    busBoy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
                return db.doc(`/users/${req.user.handle}`)
                    .update({ imageUrl });
            })
            .then(() => {
                return res.json({ message: 'Image uploaded successfully' });
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ error: err.code });
            });
    });

    busBoy.end(req.rawBody);
};

// Get any user's details
exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.user = doc.data();
                return db.collection('posts')
                    .where('userHandle', '==', req.params.handle)
                    .orderBy('createdAt', 'desc')
                    .get();
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        })
        .then(data => {
            userData.posts = [];
            data.forEach(doc => {
                userData.posts.push({
                    ...doc.data(),
                    postId: doc.id
                });
            });
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });
    batch.commit()
        .then(() => { return res.json({ message: 'Notifications marked read' }); })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};