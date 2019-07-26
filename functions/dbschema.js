let db = {
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createAt: '2019-03-15T11:46:01.018Z',
            likeCountL: 5,
            commentCount: 2
        }
    ],

    comments: [
        {
            userHandle: 'giang',
            screamId: 'FVob7mOBw5eVt89tZcHQ',
            body: 'nice scream ape',
            createAt: '2019-07-22T10:30:41.806Z',
        }
    ],

    users: [
        {
            createAt: '2019-07-22T10:30:41.806Z',
            email: 'ntg@gmail.com',
            handle: 'giang',
            imageUrl: 'https:firebasestorage.googleapis.com/v0/b/socialape-4ec96.appspot.com/o/45284046555.60736.jpg?alt=media',
            userId: 'gZmrIyL1Uwbdh9zXO7RF9jHRAgi1',
            bio: 'hello my name is ngo thanh giang',
            website: 'https:localhost:8080',
            location: 'ha noi - viet nam'
        }
    ]
}

const userDetails = {
    credentials: {
        createAt: '2019-07-22T10:30:41.806Z',
        email: 'ntg@gmail.com',
        handle: 'giang',
        imageUrl: 'https:firebasestorage.googleapis.com/v0/b/socialape-4ec96.appspot.com/o/45284046555.60736.jpg?alt=media',
        userId: 'gZmrIyL1Uwbdh9zXO7RF9jHRAgi1',
        bio: 'hello my name is ngo thanh giang',
        website: 'https:localhost:8080',
        location: 'ha noi - viet nam'
    },
    likes: [
        {
            userHandle: "user",
            screamId: "FVob7mOBw5eVt89tZcHQ"
        },
        {
            userHandle: "user",
            screamId: "ryHbpztEyWsk9pakuLLO"
        }
    ]
}