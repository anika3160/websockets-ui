# RSSchool NodeJS websocket task Battleship
> Full Battleship-style game with a WebSocket backend and bundled UI under `/front`. Static HTTP server + TS WebSocket server, no external DB required.

## Installation

1. Clone/download repo
2. `npm install`

## Usage

**Development**

`npm run start:dev`

* App served @ `http://localhost:8181` with nodemon (WS on `ws://localhost:3000`)

**Production**

`npm run start:build`

* App served @ `http://localhost:8181` without nodemon

---

**All commands**

Command | Description
--- | ---
`npm run start:dev` | App served @ `http://localhost:8181` with nodemon
`npm run build` | Transpile TypeScript to `build/`

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.

---

## How to start a game

1. Open `http://localhost:8181` in a browser and register.
2. Multiplayer: one user creates a room, the second joins it, both place ships & play.
3. Single player: click the “Single Play” button — the bot joins automatically and the battle starts right away.
