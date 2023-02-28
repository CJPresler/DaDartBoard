import React, {
  ChangeEvent,
  FormEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./App.css";
import { Client } from "boardgame.io/client";
import { generateCredentials, P2P } from "@boardgame.io/p2p";
import { Dartboard } from "./Boards/Dartboard";
import { CricketGame, CricketState } from "./Games/Cricket";
import { CopyBtn } from "./Components/CopyBtn";
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  Typography,
  TextField,
  Button,
  Box,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { AutoJoinClient } from "./Utillities/AutoJoinClient";

// Request to keep the device alive so the game doesn't disconnect
(navigator as any)?.wakeLock.request();

const queryParameters = new URLSearchParams(window.location.search);
const uuid = () => Math.round(Math.random() * 1e16).toString(32);
const credentials = generateCredentials();

const gameConfigDefaultValues = {
  matchID: queryParameters.get("matchID") ?? uuid(),
  isHost: !queryParameters.get("matchID"),
  playerName: window.localStorage.getItem("playerName"),
  numPlayers: parseInt(window.localStorage.getItem("numPlayers") ?? "2"),
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [gameConfig, setGameConfig] = useState(gameConfigDefaultValues);

  const joinURL = useMemo(
    () =>
      `${window.location.origin}${window.location.pathname}?matchID=${gameConfig.matchID}`,
    [gameConfig]
  );
  const [error, setError] = useState<null | string>(null);

  const [client, setClient] =
    useState<ReturnType<typeof Client<CricketState>>>();

  // Manage the client
  useEffect(() => {
    if (client) {
      return () => {
        client.stop();
      };
    }
  }, [client]);

  const handleFormSubmission = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (gameConfig.playerName) {
        window.localStorage.setItem("playerName", gameConfig.playerName);
      }

      const client = AutoJoinClient<CricketState>({
        game: CricketGame,
        numPlayers: gameConfig.numPlayers,
        playerID: gameConfig.isHost ? "0" : undefined,
        matchID: gameConfig.matchID,
        credentials,
        multiplayer: P2P({
          playerName: gameConfig.playerName
            ? gameConfig.playerName
            : gameConfig.isHost
            ? "Host"
            : "Guest",
          isHost: gameConfig.isHost,
          onError: (e) => {
            setError(e.type);
          },
        }),
        debug: false,
      });

      client.start();

      setClient(client);
    },
    [gameConfig]
  );

  const handleFormChange = useCallback(
    (event: ChangeEvent<any> | SelectChangeEvent) => {
      const { name, value } = event.target;
      setGameConfig({
        ...gameConfig,
        [name]: value,
      });
    },
    [gameConfig]
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        {!client && (
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Welcome! Pick a name to get started.
            </Typography>
            <Box
              component="form"
              onSubmit={handleFormSubmission}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                defaultValue={gameConfig.playerName}
                onChange={(e) => handleFormChange(e)}
                fullWidth
                label="Name"
                name="playerName"
                autoFocus
              />
              {gameConfig.isHost && (
                <Fragment>
                  <InputLabel id="numPlayerLabel">Number of Players</InputLabel>
                  <Select
                    name="numPlayers"
                    value={gameConfig.numPlayers.toString()}
                    label="Number of Players"
                    labelId="numPlayerLabel"
                    onChange={handleFormChange}
                    fullWidth
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                  </Select>
                </Fragment>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {gameConfig.isHost ? "Create game" : "Join game"}
              </Button>
            </Box>
          </Box>
        )}
        {client && (
          <div>
            <div className="game-frame">
              <Dartboard client={client} />
            </div>
            {error && (
              <p className="error">
                PeerJS Error: <code>{error}</code>
              </p>
            )}
            <CopyBtn value={joinURL}>Copy share URL</CopyBtn>
            {gameConfig.isHost && <p>You are the host</p>}
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
