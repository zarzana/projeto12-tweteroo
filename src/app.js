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
});

app.post('/tweets', (req, res) => {
    if (!user) {
        res.status(401);
        res.send('UNAUTHORIZED');
    };
    tweets.push(req.body);
    res.status(200);
    res.send('OK');
});

app.get('/tweets', (req, res) => {
    let tweetsToSend = tweets.slice(-10);
    if (tweetsToSend.lenght > 0) {
        tweetsToSend.forEach(tweet => { tweet['avatar'] = user.avatar });
    };
    res.status(200);
    res.send(tweetsToSend);
});

const port = 5000;
app.listen(port, () => console.log(`Running server on port ${port}`));