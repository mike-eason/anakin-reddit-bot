require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const messages = require('./messages');

const reddit = new Snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

const client = new Snoostorm(reddit);

const stream = client.CommentStream({
    subreddit: process.env.SUBREDDIT,
    results: 100
});

//Keep track of everything we have commented on, if we
//find a reply to one of our comments we can check for a reply.
let commentIds = []; //TODO: This technique could be better I suppose.

stream.on('comment', comment => {
    //Go through each possible response and look for a match.
    const reply = messages.extractReply(comment, commentIds);
    
    if (!reply)
        return;

    console.log(`Found message: ${comment.body}`);
    console.log(`Responding with: ${reply}`);
    
    comment.reply(reply)
    .then(resp => {
        console.log(`Responded to message.`);

        //Add the comment id to the array, we'll use it to
        //check if a user has replied to one of our comments.
        commentIds.push('t1_' + resp.id);
    })
    .catch(err => {
        console.error(err);
    });
});