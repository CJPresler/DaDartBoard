import React, { useCallback, useMemo, useState } from 'react';
import './App.css';
import { Segment } from './Utillities/DartboardUtilities';
import { Client } from 'boardgame.io/react'
import { generateCredentials, P2P } from '@boardgame.io/p2p'
import { Granboard } from './Utillities/Granboard';
import { Dartboard } from './Boards/Dartboard';
import { CricketGame } from './Games/Cricket';
import { CopyBtn } from './Components/CopyBtn';
import { Button, ThemeProvider, CssBaseline, createTheme } from '@mui/material'

const queryParameters = new URLSearchParams(window.location.search);
const joinGameParamter = queryParameters.get("joinGame");

const uuid = () => Math.round(Math.random() * 1e16).toString(32);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [/*unused*/, setDarboard] = useState<Granboard>();
  const [lastSegmentHit, setLastSegmentHit] = useState<Segment>();
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

  const onSegmentHit = useCallback((segment: Segment) => {
    setLastSegmentHit(segment);
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
    <div className="App">
      <Button variant='contained' onClick={async () => { setDarboard(await Granboard.ConnectToBoard(onSegmentHit)) }}>Connect to Dartboard</Button>
      <h2>{lastSegmentHit?.LongName}</h2>
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
