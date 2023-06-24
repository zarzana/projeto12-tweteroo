import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

let user;
let tweets = [];

function validatePostReqBody(req, keys) {
    
    let checker = (arr, target) => target.every(v => arr.includes(v));

    if (!req.body.constructor == Object) {
        return false
    } else if (!checker(Object.keys(req.body), keys)) {
        return false
    } else {
        return true
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

app.post('/tweets', (req, res) => {
    if (!user) {
        res.status(401);
        res.send('UNAUTHORIZED');
        return;
    } else if (validatePostReqBody(req, ['username', 'tweet'])) {
        tweets.push(req.body);
        res.status(201);
        res.send('OK');
        return;
    } else {
        res.status(400);
        res.send('Todos os campos são obrigatórios!');
        return;
    }
});

app.get('/tweets', (req, res) => {
    let tweetsToSend = [];
    tweets.slice(-10).forEach(tweet => {
        let currentTweet = tweet;
        currentTweet['avatar'] = user.avatar;
        tweetsToSend.push(currentTweet);
    });
    res.status(200);
    res.send(tweetsToSend);
    return;
});

const port = 5000;
app.listen(port, () => console.log(`Running server on port ${port}`));