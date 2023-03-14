import { mdiAccount } from "@mdi/js";
import Icon from "@mdi/react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { Client, ClientState } from "boardgame.io/dist/types/src/client/client";
import { ChangeEvent, FunctionComponent, useCallback } from "react";
import { DartsGameState } from "../Games/DartsGame";
import { DartsGameTypes } from "../Games/Utilities/DartsGameUtilities";

export const GameConfig: FunctionComponent<{
  gameState: ClientState<DartsGameState>;
  client: ReturnType<typeof Client<any>>;
}> = (props) => {
  const handleFormChange = useCallback(
    (event: ChangeEvent<any> | SelectChangeEvent) => {
      const { name, value } = event.target;
      if (!props.gameState) {
        return;
      }

      if (name === "gameType") {
        // If the gameType is changing set that specifically
        props.client.moves.setGameConfig(value, props.gameState.G.gameConfig);
      } else if (event.target.checked !== undefined) {
        // Checkbox's don't use the "value" property they use the "checked" property
        props.client.moves.setGameConfig(props.gameState.G.gameType, {
          ...props.gameState?.G.gameConfig,
          [name]: event.target.checked,
        });
      } else {
        // Otherwise update the overal gameConfig
        props.client.moves.setGameConfig(props.gameState.G.gameType, {
          ...props.gameState?.G.gameConfig,
          [name]: value,
        });
      }
    },
    [props.client.moves, props.gameState]
  );

  return (
    <Grid container item xs={12} sm={10} md={8} lg={6}>
      <Grid container item xs={12} columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          <h2>Current Players</h2>
        </Grid>
        {props.client.matchData
          ?.filter((matchData) => matchData.isConnected)
          .map((matchData) => (
            <Grid item xs={6} sm={4} md={3}>
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
          <Stack spacing={2}>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="gameTypeLabel">Game</InputLabel>
              <Select
                value={props.gameState?.G.gameType}
                name="gameType"
                label="Game"
                labelId="gameTypeLabel"
                fullWidth
                disabled={!props.gameState?.isActive}
                onChange={handleFormChange}
              >
                <MenuItem value={"Cricket"}>Cricket</MenuItem>
                <MenuItem value={"Standard01"}>'01</MenuItem>
              </Select>
            </FormControl>
            {props.gameState?.G.gameType === DartsGameTypes.Standard01 && (
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="standard01ScoreLabel">
                  Starting Score
                </InputLabel>
                <Select
                  value={props.gameState?.G.gameConfig.standard01Score.toString()}
                  name="standard01Score"
                  label="Starting Score"
                  labelId="standard01ScoreLabel"
                  fullWidth
                  disabled={!props.gameState?.isActive}
                  onChange={handleFormChange}
                >
                  <MenuItem value={"301"}>301</MenuItem>
                  <MenuItem value={"501"}>501</MenuItem>
                  <MenuItem value={"701"}>701</MenuItem>
                </Select>
              </FormControl>
            )}

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.gameState?.G.gameConfig.randomStart}
                    name="randomStart"
                    onChange={handleFormChange}
                  />
                }
                label="Random Start"
              />
            </FormGroup>

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
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};
