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
            message = getRandomArrayItem(resp.responses);
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

function getRandomArrayItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function appendFooter(message) {
    //Get a random footer source text.
    let signatureText = getRandomArrayItem(responses.footer.signatures);
    let sourceText = getRandomArrayItem(responses.footer.sourceCodeTexts);
    let issuesText = getRandomArrayItem(responses.footer.issuesTexts);

    return message + `
*****
${signatureText}

[${sourceText}](${process.env.GITHUB_SOURCE_URL}) ^| [${issuesText}](${process.env.GITHUB_ISSUES_URL})`;
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
