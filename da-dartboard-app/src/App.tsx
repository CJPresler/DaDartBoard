import React, { useMemo, useState } from 'react';
import './App.css';
import { Client } from 'boardgame.io/react'
import { generateCredentials, P2P } from '@boardgame.io/p2p'
import { Dartboard } from './Boards/Dartboard';
import { CricketGame } from './Games/Cricket';
import { CopyBtn } from './Components/CopyBtn';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'

const queryParameters = new URLSearchParams(window.location.search);
const joinGameParamter = queryParameters.get("joinGame");

const uuid = () => Math.round(Math.random() * 1e16).toString(32);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const matchID = useMemo(() => joinGameParamter ? joinGameParamter : uuid(), []);
  const isHost = useMemo(() => joinGameParamter ? false : true, []);
  const joinURL = useMemo(() => `${window.location}${isHost ? `?joinGame=${matchID}` : ''}`, [matchID, isHost]);
  const [error, setError] = useState<null | string>(null);

  const credentials = useMemo(() => generateCredentials(), []);

  const GameView = useMemo(() =>
    Client({
      game: CricketGame,
      board: Dartboard,
      multiplayer: P2P({
        isHost,
        onError: (e) => {
          setError(e.type);
        }
      }),
      debug: true
    }), [isHost]
  )

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
    <div className="App">
      <div>
        <div className="game-frame">
          <GameView {...{ playerID: isHost ? '0' : '1', matchID, credentials }} />
        </div>
        {error && (
          <p className="error">
            PeerJS Error: <code>{error}</code>
          </p>
        )}
        <CopyBtn value={joinURL}>Copy share URL</CopyBtn>
        {isHost && <p>This is the match host.</p>}
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
