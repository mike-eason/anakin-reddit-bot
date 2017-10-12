const responses = require('./responses.json');

const groupMatchRegex = /\$(\d*)/gi;

function extractMessage(comment, resp) {
    let regex = new RegExp(resp.pattern, 'gi');
    let matches = regex.exec(comment.body);
    let message = null;

    if (matches && matches.length > 0) {
        //if we get to here then we can extract a response. 
        //Pick a random response to send back.
        if (resp.responses)
            message = resp.responses[Math.floor(Math.random() * resp.responses.length)];
        else
            message = resp.response;

        //Check if the message contains a group match keyword, i.e $0, $1 ect.
        //A $ symbol followed by a number indicates the matching group to add to the text.
        let groupMatch = groupMatchRegex.exec(message);

        //Go through each match and extract the group from the original message.
        while(groupMatch != null) {
            let identifier = groupMatch[0];
            let index = parseInt(groupMatch[1]);

            if (Number.isNaN(index))
                break;

            let origGroup = matches[index + 1].trim(); //returns captured group (...) in regex

            message = message.replace(identifier, origGroup);

            groupMatch = groupMatchRegex.exec(message);
        }
    }

    //Check if the message contains any keywords.
    if (message && message.indexOf('$username') > -1) {
        message = message.replace('$username', comment.author.name);
    }

    if (message)
        message = appendFooter(message);

    return message;
}

function appendFooter(message) {
    return message + `
*****
^[Source](https://github.com/mike-eason/anakin-reddit-bot) ^| ^[Issues](https://github.com/mike-eason/anakin-reddit-bot/issues)`;
}

module.exports = {

    extractReply(comment, prevCommentIds = []) {
        //make sure we're not replying to ourselves.
        if (comment.author.name === process.env.REDDIT_USER)
            return null;
    
        let message;
        
        if (prevCommentIds.includes(comment.parent_id)) {
            //This comment is a reply to one of ours, check for a reply.
            for(let i = 0; i < responses.replies.length; i++) {
                let resp = responses.replies[i];
                message = extractMessage(comment, resp);
    
                if (message)
                    return message;
            }
        }
    
        //if we get to here then check if the comment contains one of
        //our key phrases and send back a response.
        for(let i = 0; i < responses.messages.length; i++) {
            let resp = responses.messages[i];
            let message = extractMessage(comment, resp);
    
            if (message)
                return message;
        }
    
        return null;
    }

};