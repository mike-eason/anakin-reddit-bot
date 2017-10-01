# Anakin Bot
A stupid reddit bot that responds to movie quotes from comments in [/r/PrequelMemes](https://www.reddit.com/r/PrequelMemes).

## Installation

1. Create a **script** reddit application in the **apps** tab on [reddit preferences](https://www.reddit.com/prefs/).
2. Clone the repo and `npm install`.
3. Add a `.env` file with the following variables:

```
CLIENT_ID=...
CLIENT_SECRET=...
REDDIT_USER=...
REDDIT_PASS=...
```

- `CLIENT_ID` - The reddit app client ID.
- `CLIENT_SECRET` - The reddit app client secret key.
- `REDDIT_USER_AGENT` - The user agent to use for reddit API requests. (Just use your reddit app name)
- `REDDIT_USER` - The username the bot will be running on.
- `REDDIT_PASS` - The password for the reddit user.

Use `npm start` to start the bot and `npm test` to run tests.

## Contributing
Feel free to fork the project and make a pull request with some nice new features.

## License
[MIT](LICENSE)