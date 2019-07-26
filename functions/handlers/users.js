const {db, admin} = require('../util/admin');
const {config} = require('../util/config');
const firebase = require('firebase');
const {validateSingupData, validateLoginData, reducerUserDetails} = require('../util/validators')

firebase.initializeApp(config);

module.exports.signup = (req, res) => {

    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    const {valid, errors} = validateSingupData(newUser);
    if(!valid) {
        return res.status(400).json({errors});
    }

    let tok;
    let userId;

    db.doc(`/users/${newUser.handle}`).get().then(doc => {
        if(doc.exists) {
            return res.status(400).json({handle: 'this handle is already taken'})
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    }).then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    }).then(token => {
        tok = token;
        let noImg = 'blank-profile.png';
        const userCredential = {
            handle: newUser.handle,
            email: newUser.email,
            createAt: new Date().toISOString(),
            imageUrl: `https:firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredential);
    }).then(() => {
        return res.status(201).json({token: tok});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({error: err.code});
    })

}

module.exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password : req.body.password
    }
    
    const {valid, errors} = validateLoginData(user);
    if(!valid) {
        return res.status(400).json({errors});
    }
    
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(tocken => {
        return res.json({tocken});
    })
    .catch(err => {
        if(err.code ==='auth/wrong-password') {
            return res.status(403).json({general: "password is incorrect"});
        } else {
            return res.status(500).json({error: err.code});
        }
    })

}

module.exports.addUserDetails = (req, res) => {
    let userDetails = reducerUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(() => {
        return res.status(200).json({message: 'details added successfully'});
    })
    .catch((err) => {
        return res.status(500).json({error: err.code});
    })
}

module.exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
        if(doc.exists) {
            userData.credentials = doc.data();
            return db
                .collection('likes')
                .where('userHandle', '==', req.user.handle) 
                .get();
        }
    })
    .then((data) => {
        userData.like = [];
        data.forEach((doc) => {
            userData.like.push(doc.data());
        });
        return res.json(userData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: err.code});
    })
}

module.exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os= require('os');
    const fs = require('fs');

    const busboy = new BusBoy({headers: req.headers});

    let imageFileName;
    let imageTobeUpload;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

        if('image/jpeg' !== mimetype && 'image/png' !== mimetype) {
            return res.status(400).json({error: 'wrong file type submited'});
        }
        //my.image.png
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.random() *  100000000000}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageTobeUpload = {filePath, mimetype};

        file.pipe(fs.createWriteStream(filePath));
    });

    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageTobeUpload.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageTobeUpload.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https:firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({imageUrl});
        })
        .then(() => {
            return res.json({message: 'image uploaded successfully'})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code});
        })
    })

    busboy.end(req.rawBody);
}