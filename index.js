require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

const reddit = new Snoowrap({
    userAgent: 'anakin-reply-bot',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

const client = new Snoostorm(reddit);

const stream = client.CommentStream({
    subreddit: 'PrequelMemes',
    results: 100
});

const replyText = `Is it possible to learn this power?`;
const lookFor = `i thought not. it's not a story the jedi would tell you. it's a sith legend. darth plagueis was a dark lord of the sith, so powerful and so wise he could use the force to influence the midichlorians to create life... he had such a knowledge of the dark side that he could even keep the ones he cared about from dying. the dark side of the force is a pathway to many abilities some consider to be unnatural. he became so powerful... the only thing he was afraid of was losing his power, which eventually, of course, he did. unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. it's ironic he could save others from death, but not himself.`;

stream.on('comment', c => {
    if (c.body.toLowerCase().indexOf(lookFor) === -1)
        return;

    console.log(`Found message, responding...`);
    
    c.reply(replyText)
    .then(resp => {
        console.log(`Responded to message (${resp.id})`);
    })
    .catch(err => {
        console.error(err);
    });
});