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
    if (!user) { res.send('“UNAUTHORIZED”') };
    tweets.push(req.body);
    res.send('OK');
});

app.get('/tweets', (req, res) => {
    tweetsToSend = tweets.slice(-10);
    if (tweetsToSend.lenght > 0) { tweetsToSend.forEach(tweet => { tweet.push(user.avatar) }) };
    res.send(tweetsToSend);
});

const port = 5000;
app.listen(port, () => console.log(`Running server on port ${port}`));