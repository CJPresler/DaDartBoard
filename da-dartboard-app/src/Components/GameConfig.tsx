import { mdiAccount } from "@mdi/js";
import Icon from "@mdi/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { Client, ClientState } from "boardgame.io/dist/types/src/client/client";
import { FunctionComponent } from "react";
import { DartsGameState } from "../Games/DartsGame";

export const GameConfig: FunctionComponent<{
  gameState: ClientState<DartsGameState>;
  client: ReturnType<typeof Client<any>>;
}> = (props) => {
  return (
    <Grid container item xs={12} lg={6}>
      <Grid container item xs={12} columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          <h2>Players</h2>
        </Grid>
        {props.client.matchData
          ?.filter((matchData) => matchData.isConnected)
          .map((matchData) => (
            <Grid item xs={3}>
              <Card elevation={2}>
                <CardContent>
                  <Icon
                    path={mdiAccount}
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginRight: 5,
                    }}
                    size="50"
                  />
                  <h2>
                    {matchData.name ? matchData.name : `Player ${matchData.id}`}
                  </h2>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
      <Grid item xs={12}>
        <Box
          component="form"
          width="100%"
          onSubmit={(event) => {
            event.preventDefault();
            props.client.moves.start(props.client.matchData);
          }}
          noValidate
          sx={{ mt: 1 }}
        >
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="gameTypeLabel">Game</InputLabel>
            <Select
              value={props.gameState?.G.gameType}
              label="Game"
              labelId="gameTypeLabel"
              fullWidth
              disabled={!props.gameState?.isActive}
              onChange={(event) => {
                props.client?.moves.setGameType(event.target.value);
              }}
            >
              <MenuItem value={"Cricket"}>Cricket</MenuItem>
              <MenuItem value={"Standard01"}>Standard01</MenuItem>
            </Select>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="medium"
              sx={{ mt: 3, mb: 2 }}
              disabled={!props.gameState?.isActive}
            >
              Start Game
            </Button>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  );
};
