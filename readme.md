# Connect 4 interview assignment

Play now on Glitch [https://conscious-thistle.glitch.me/](https://conscious-thistle.glitch.me/)

## Run locally

```
yarn install
yarn start
```

Navigate browser to `localhost:3000`. Open second tab to start game.

## Implementation

I used an ExpressJS scaffold for the project structure and socket.io library for real-time communication. Connect4 implementation and socket server lives in `/server` and the browser React client is in `/client`. 

## Persistence

Games are persisted to an append only log in a file. Before persisting, games
are serialized to a 42 character text representation of the board. It would be
straightforward to use a database table with a character field in its place.