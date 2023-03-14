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
import { generateCredentials, P2P } from "@boardgame.io/p2p";
import { DartsGameBoard } from "./Boards/DartsGameBoard";
import { CopyBtn } from "./Components/CopyBtn";
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  Typography,
  TextField,
  Button,
  Box,
  SelectChangeEvent,
  Snackbar,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import { AutoJoinClient } from "./Utillities/AutoJoinClient";
import { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
import { DartsGame } from "./Games/DartsGame";
import { DartsGamePhases } from "./Games/Utilities/DartsGameUtilities";

// Request to keep the device alive so the game doesn't disconnect
(navigator as any)?.wakeLock.request();

const queryParameters = new URLSearchParams(window.location.search);
const uuid = () => Math.round(Math.random() * 1e16).toString(32);
const credentials = generateCredentials();

type GameConfig = {
  matchID: string;
  playerName: string | null;
};

const gameConfigDefaultValues: GameConfig = {
  matchID: queryParameters.get("matchID") ?? uuid(),
  playerName: window.localStorage.getItem("playerName"),
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

  const [activeClient, setActiveClient] = useState<_ClientImpl<any>>();

  const clients = useRef<_ClientImpl<any>[]>([]);

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

      const client = AutoJoinClient<any>({
        game: DartsGame,
        numPlayers: 8,
        playerID: undefined,
        matchID: gameConfig.matchID,
        credentials,
        multiplayer: P2P({
          playerName: gameConfig.playerName ?? undefined,
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

      if (!addPlayer) {
        navigator.clipboard.writeText(joinURL).then(() => {
          setToastMessage("Share link copied to clipboard");
        });
      }

      window.history.replaceState(
        {},
        "",
        `${window.location.origin}${window.location.pathname}?matchID=${gameConfig.matchID}`
      );
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
      <div className="App content">
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
              {!addPlayer && (
                <TextField
                  margin="normal"
                  defaultValue={gameConfig.matchID}
                  onChange={(e) => handleFormChange(e)}
                  fullWidth
                  label="Match ID"
                  name="matchID"
                  autoFocus
                />
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Connect to Game
              </Button>
            </Box>
          </Box>
        )}
        {activeClient && !addPlayer && (
          <Fragment>
            <div className="game-frame">
              <DartsGameBoard
                client={activeClient}
                gameStateChanged={switchToActiveClient}
              />
            </div>
            {error && (
              <p className="error">
                PeerJS Error: <code>{error}</code>
              </p>
            )}
          </Fragment>
        )}
      </div>
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={3000}
        onClose={() => setToastMessage(undefined)}
      >
        <Alert severity="success">{toastMessage}</Alert>
      </Snackbar>
      <footer className="footer">
        {activeClient && !addPlayer && (
          <Stack
            direction="row"
            justifyContent="center"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
          >
            <CopyBtn value={joinURL}>Copy share URL</CopyBtn>
            <Button type="button" onClick={() => setAddPlayer(true)}>
              Add local player
            </Button>
            <Button
              type="button"
              disabled={!activeClient.getState()?.isActive}
              onClick={() =>
                activeClient.events.setPhase?.(DartsGamePhases.GameConfig)
              }
            >
              Reconfigure game
            </Button>
          </Stack>
        )}
      </footer>
    </ThemeProvider>
  );
}

export default App;
