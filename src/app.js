import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

let user;
let tweets = [];

app.post('/sign-up', (req, res) => {
    user = req.body;
    res.send('OK');
    return;
});

app.post('/tweets', (req, res) => {
    if (!user) {
        res.status(401);
        res.send('UNAUTHORIZED');
        return;
    }
    tweets.push(req.body);
    res.status(200);
    res.send('OK');
    return;
});

app.get('/tweets', (req, res) => {
    // let tweetsToSend = tweets.slice(-10);
    // if (tweetsToSend.lenght > 0) {
    //     tweetsToSend.forEach(tweet => { tweet['avatar'] = user.avatar });
    // };
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