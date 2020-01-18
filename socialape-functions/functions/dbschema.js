const db = {
    users: [
        {
            userId: '786adsa678das897da8976sd',
            email: 'email@email.com',
            handle: 'users',
            createdAt: '2020-01-15T00:16:18.265Z',
            imageUrl: 'image/gsdjhadshgja/asdasa',
            bio: 'Hello, my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'london, UK'
        }
    ],
    posts: [
        {
            userHandle: 'user',
            body: 'This is a sample post',
            createdAt: '2020-01-15T00:16:18.265Z',
            likeCount: 5,
            commentCount: 3
        }
    ],
    comments: [
        {
            userHandle: 'user',
            postId: 'gjkhgjkhg3gdfs',
            body: 'This is a comment',
            createdAt: '2020-01-15T00:16:18.265Z'
        }
    ]
};

const userDetails = {
    // Redux data
    credentials: {
        userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2019-03-15T10:59:52.798Z',
        imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
        bio: 'Hello, my name is user, nice to meet you',
        website: 'https://user.com',
        location: 'Lonodn, UK'
    },
    likes: [
        {
            userHandle: 'user',
            screamId: 'hh7O5oWfWucVzGbHH2pa'
        },
        {
            userHandle: 'user',
            screamId: '3IOnFoQexRcofs5OhBXO'
        }
    ]
};
