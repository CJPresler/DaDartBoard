import React, {
  ChangeEvent,
  FormEvent,
  Fragment,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import { Client } from "boardgame.io/client";
import { generateCredentials, P2P } from "@boardgame.io/p2p";
import { CricketBoard } from "./Boards/CricketBoard";
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
  Snackbar,
  Alert,
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
  const [toastMessage, setToastMessage] = useState<string>();

  const joinURL = useMemo(
    () =>
      `${window.location.origin}${window.location.pathname}?matchID=${gameConfig.matchID}`,
    [gameConfig]
  );
  const [error, setError] = useState<null | string>(null);
  const [addPlayer, setAddPlayer] = useState(false);

  const [activeClient, setActiveClient] =
    useState<ReturnType<typeof Client<CricketState>>>();

  const clients = useRef<ReturnType<typeof Client<CricketState>>[]>([]);

  // Manage the client
  const switchToActiveClient = useCallback(() => {
    if (!activeClient && clients.current.length > 0) {
      setActiveClient(clients.current[0]);
      return;
    }

    if (activeClient && !activeClient.getState()?.isActive) {
      // This client isn't active check all registered clients and swap if one is active
      clients.current.every((client) => {
        if (client.playerID === activeClient.getState()?.ctx.currentPlayer) {
          setActiveClient(client);

          // Break early as we found the next client
          return false;
        }

        // Keep searching
        return true;
      });
    }
  }, [activeClient]);

  const handleFormSubmission = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (gameConfig.playerName && !addPlayer) {
        window.localStorage.setItem("playerName", gameConfig.playerName);
      }

      const client = AutoJoinClient<CricketState>({
        game: CricketGame,
        numPlayers: gameConfig.numPlayers,
        playerID: gameConfig.isHost && !addPlayer ? "0" : undefined,
        matchID: gameConfig.matchID,
        credentials,
        multiplayer: P2P({
          playerName: gameConfig.playerName
            ? gameConfig.playerName
            : gameConfig.isHost && !addPlayer
              ? "Host"
              : "Guest",
          isHost: gameConfig.isHost && !addPlayer,
          onError: (e) => {
            setError(e.type);
          },
        }),
        debug: false,
      });

      client.start();

      clients.current.push(client);
      switchToActiveClient();
      setAddPlayer(false);

      if (gameConfig.isHost && !addPlayer) {
        navigator.clipboard.writeText(joinURL).then(() => {
          setToastMessage("Share link copied to clipboard");
        });
      }
    },
    [gameConfig, joinURL, addPlayer, switchToActiveClient]
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
        {(!activeClient || addPlayer) && (
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
                defaultValue={!addPlayer ? gameConfig.playerName : ""}
                onChange={(e) => handleFormChange(e)}
                fullWidth
                label="Name"
                name="playerName"
                autoFocus
              />
              {gameConfig.isHost && !addPlayer && (
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
                {gameConfig.isHost && !addPlayer ? "Create game" : "Join game"}
              </Button>
            </Box>
          </Box>
        )}
        {activeClient && !addPlayer && (
          <div>
            <div className="game-frame">
              <CricketBoard client={activeClient} gameStateChanged={switchToActiveClient} />
            </div>
            {error && (
              <p className="error">
                PeerJS Error: <code>{error}</code>
              </p>
            )}
            <CopyBtn value={joinURL}>Copy share URL</CopyBtn>
            <Button type="button" onClick={() => setAddPlayer(true)}>Add local player</Button>
            {gameConfig.isHost && <p>You are the host</p>}
          </div>
        )}
      </div>
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={3000}
        onClose={() => setToastMessage(undefined)}
      >
        <Alert severity="success">{toastMessage}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
