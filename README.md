# Anakin Bot
A reddit bot that responds to movie quotes from comments in [/r/PrequelMemes](https://www.reddit.com/r/PrequelMemes). It uses [**Regular Expressions**](https://en.wikipedia.org/wiki/Regular_expression) to influence the comments to create... Memes.

### Conditions
In [responses.json](responses.json) defines all of the possible comments to look for and defines arrays of possible responses to said comments. The bot will look for a key phrase using a regular expression and will pick a random response upon finding one.

The bot will also keep track of what comments it has sent and will perform additional checks to common replies such as `"Good bot"` or `"Bad bot"`.

### Example
Here is an example regular expression:

```
(did you|have you) ever heard? the (.*) of (.*)\?$
```

To satisfy this condition, a comment will look like this:

>Did you ever hear the ... of ...?

*Note: Almost all of the regular expressions end with `$`, this denotes that the comment must **end with** the phrase. It just ensures that the bot is responding in the right context.*

## Contributing
- Check the project issues for any jobs that need help.
- Feel free to fork the project and make a pull request with some nice new features. We can never have too many comment responses.
- Submit an issue if you have an idea for a comment response and are not sure how to implement it or if you have any other issue with the bot.

## Testing
If you are submitting a pull request, please run the tests first (`npm test`) and ensure that they are all successful. If you are adding a major new feature, please write tests as well.

## License
[MIT](LICENSE)