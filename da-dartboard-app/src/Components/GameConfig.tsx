import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
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
      <Box
        component="form"
        width="100%"
        onSubmit={(event) => {
          event.preventDefault();
          props.client.moves.start();
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
            sx={{ mt: 3, mb: 2 }}
            disabled={!props.gameState?.isActive}
          >
            Start Game
          </Button>
        </FormControl>
      </Box>
    </Grid>
  );
};
