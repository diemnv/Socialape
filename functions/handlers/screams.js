const {db} = require('../util/admin')
module.exports.getAllScreams = (req, res) => {
    db.collection('screams').get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push(
                    {
                        id: doc.id,
                        body: doc.data().body,
                        userHandle: doc.data().userHandle,
                        createAt: doc.data().createAt
                    }
                    );
            })
            return res.json(screams);
        })
        .catch(err => {
            console.error(err);
        })    
}

module.exports.addScream = (req, res) => {
    if(req.method !== 'POST') {
        return res.status(400).json({error: 'Method not allowed'});
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.userImage,
        createAt: new Date().toISOString(),
        likeCount : 0,
        commentCount: 0
    };

    db.collection('screams')
        .add(newScream)
        .then(doc => {
            newScream.id = doc.id;
            res.json(newScream)
        })
        .catch(err => {
            res.status(500).json({error: 'something went wrong'});
            console.error(err);
        })
}

module.exports.getScream = (req, res) => {
    let screamData = {};
    db.doc(`/screams/${req.params.screamId}`)
        .get()
        .then((doc) => {
            if(!doc.exists) {
                return res.status(404).json({error: "Scream not found"});
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db
                .collection('comments')
                .orderBy('createAt', 'desc')
                .where('screamId', '==', req.params.screamId)
                .get();
        })
        .then((data) => {
            screamData.comment = [];
            data.forEach((doc) => {
                screamData.comment.push(doc.data());
            })
            return res.status(200).json(screamData);
        })
        .catch((err) => {
            return res.status(500).json({error: err.code});
        })
}

module.exports.commentOnScream = (req, res) => {
    if('' == req.body.body)  {
        return res.status(400).json({message: "the comment is invalid"});
    }
    const comment = {
        body: req.body.body,
        createAt: new Date().toISOString(),
        userImage: req.user.userImage,
        userHandle: req.user.handle
    }

    const screamId = req.params.screamId;
    db.doc(`/screams/${screamId}`).get()
    .then((doc) => {
        if(!doc.exists) {
            return res.status(404).json({error: 'scream not found'});
        }
        comment.screamId = doc.id;
        return db.collection('comments').add(comment);
    })
    .then(() => {
        return res.status(200).json(comment);
    })
    .catch(err => {
        return res.status(500).json({error: err.code});
    })
    
}

module.exports.likeScream = (req, res) => {
    let scream;
    db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc => {
        if(!doc.exists) {
            return res.status(400).json({error: "scream not found"});
        }
        scream = doc.data();
        scream.id = doc.id;
        return db.collection('likes')
            .where('screamId', '==', req.params.screamId)
            .where('userHandle', '==', req.user.handle).limit(1).get();
    })
    .then((data) => {
        if(data.empty) {
            return db.collection('likes')
            .add({screamId: scream.id, userHandle: req.user.handle})
            .then(()=> {
                scream.likeCount ++;
                return db.doc(`/screams/${scream.id}`).update({likeCount: scream.likeCount});
            })
            .then((doc) => {
                // console.log(doc.data());
                return res.status(200).json(scream);
            })
        } else {
            return res.status(400).json({error: 'the scream alredy liked'});
        }
    })
    .catch(err => {
        return res.status(500).json({error: err.code});
    })
}

module.exports.unlikeScream = (req, res) => {
    db.collection('likes').where('screamId', '==', req.params.screamId).where('userHandle', '==', req.user.handle).get()
    .then(data => {
        if(data.empty) {
            return res.status(400).json({error: 'you did not like this scream before'});
        }
        return db.collection('likes').doc(data.docs[0].id).delete()
        .then(() => {
            db.doc(`/screams/${req.params.screamId}`).get().then(doc => {
                if(!doc.exists) {
                    return res.status(404).json({error: "scream not found"});
                }
                let scream = doc.data();
                scream.id = doc.id;
                db.doc(`/screams/${req.params.screamId}`).update({likeCount: scream.likeCount - 1})
                .then(() => {
                    scream.likeCount --;
                    return res.status(200).json(scream);
                })
            })
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: err.code});
    })

}

module.exports.deleteScream = (req, res) => {
    
}