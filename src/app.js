import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

let user;
let tweets = [];

function validatePostReqBody(req, keys) {

    let checkContent = (arr, target) => target.every(v => arr.includes(v));
    let checkString = (arr) => new Set(arr.map(x => typeof x)).size <= 1 && typeof arr[0] == 'string';
    let checkEmpty = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i]) { return false };
        };
        return true;
    };

    if (!req.body.constructor == Object) {
        return false;
    } else if (!checkContent(Object.keys(req.body), keys)) {
        return false;
    } else if (!checkString(Object.values(req.body))) {
        return false;
    } else if (!checkEmpty(Object.values(req.body))) {
        return false;
    } else {
        return true;
    }

}

app.post('/sign-up', (req, res) => {
    if (validatePostReqBody(req, ['username', 'avatar'])) {
        user = req.body;
        res.status(201);
        res.send('OK');
        return;
    } else {
        res.status(400);
        res.send('Todos os campos são obrigatórios!');
        return;
    };
});

// POST/TWEETS - OLD IMPLEMENTATION - USERNAME ON BODY
// app.post('/tweets', (req, res) => {
//     if (!user) {
//         res.status(401);
//         res.send('UNAUTHORIZED');
//         return;
//     } else if (validatePostReqBody(req, ['username', 'tweet'])) {
//         let tweet = req.body;
//         tweet['avatar'] = user.avatar;
//         tweets.push(req.body);
//         res.status(201);
//         res.send('OK');
//         return;
//     } else {
//         res.status(400);
//         res.send('Todos os campos são obrigatórios!');
//         return;
//     }
// });

app.post('/tweets', (req, res) => {
    if (!user) {
        res.status(401);
        res.send('UNAUTHORIZED');
        return;
    } else if (validatePostReqBody(req, ['tweet'])) {
        let tweet = req.body;
        if (req.header('user') != user.username) {
            res.status(401);
            res.send('UNAUTHORIZED');
            return;
        } else {
            tweet['avatar'] = user.avatar;
            tweet['username'] = user.username;
            tweets.push(req.body);
            res.status(201);
            res.send('OK');
            return;
        }
    } else {
        res.status(400);
        res.send('Todos os campos são obrigatórios!');
        return;
    }
});

app.get('/tweets', (req, res) => {
    const reversedTweets = [...tweets].reverse();
    if (req.query.page) {
        if (req.query.page < 1) {
            res.status(400);
            res.send('Informe uma página válida!')
        } else {
            res.status(200);
            res.send(reversedTweets.slice(req.query.page * 10 - 10, req.query.page * 10));
        };
    };
    res.status(200);
    res.send(reversedTweets.slice(0, 10));
    return;
});

app.get('/tweets/:username', (req, res) => {
    const username = req.params.username;
    let tweetsToSend = [];
    tweets.forEach(tweet => {
        if (tweet['username'] == username) { tweetsToSend.push(tweet) };
    });
    res.status(200);
    res.send(tweetsToSend);
    return;
});

const port = 5000;
app.listen(port, () => console.log(`Running server on port ${port}`));