const functions = require('firebase-functions');
const express = require('express');
const app = express();

const {getAllScreams,
        addScream,
        getScream,
        commentOnScream,
        likeScream,
        unlikeScream,
        deleteScream} = require('./handlers/screams')
const {signup, login, uploadImage, addUserDetails, getAuthenticatedUser} = require('./handlers/users');
const {FBAuth} = require('./util/fbAuth');

// Scream router
app.get('/screams', getAllScreams);

// add a acream
app.post('/scream', FBAuth, addScream);

// get a scream
app.get('/screams/:screamId', getScream);

// comment
app.post('/scream/:screamId/comment', FBAuth, commentOnScream)

// like a scream
app.post('/scream/:screamId/likeScream', FBAuth, likeScream);

// like a scream
app.post('/scream/:screamId/unlikeScream', FBAuth, unlikeScream);

// delete a scream.
app.post('/screams/:screamId/delete', FBAuth, deleteScream)



// signup route
app.post('/signup', signup);

// login
app.post('/login', login);

// upload user image
app.post('/user/image', FBAuth, uploadImage);

// add user detail
app.post('/user', FBAuth, addUserDetails);

//get authenticate user
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.region('europe-west1').https.onRequest(app);