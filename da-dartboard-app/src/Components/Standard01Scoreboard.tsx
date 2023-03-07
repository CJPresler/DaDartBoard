import { mdiLanDisconnect } from "@mdi/js";
import Icon from "@mdi/react";
import { Grid } from "@mui/material";
import { Client, ClientState } from "boardgame.io/dist/types/src/client/client";
import { FunctionComponent } from "react";
import { Standard01State } from "../Games/Standard01";

export const Standard01Scoreboard: FunctionComponent<{
  gameState: ClientState<Standard01State>;
  client: ReturnType<typeof Client<any>>;
}> = (props) => {
  return (
    <Grid container item xs={12} lg={6}>
      {Array.from(Array(props.gameState?.ctx.numPlayers).keys()).map((row) => (
        <Grid
          item
          xs={6}
          style={
            props.gameState?.ctx.currentPlayer === row.toString()
              ? {
                  boxShadow: "inset 0px 0px 35px -7px #00BAFF",
                }
              : undefined
          }
        >
          {!props.client?.matchData?.at(row)?.isConnected && (
            <Icon
              path={mdiLanDisconnect}
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginRight: 5,
              }}
              size={1}
              color="#ED3737"
            />
          )}
          <h2>
            {props.client?.matchData?.at(row)?.name
              ? props.client?.matchData?.at(row)?.name
              : `Player ${row + 1}`}
          </h2>
          <h2>{props.gameState?.G.players[row.toString()].score}</h2>
        </Grid>
      ))}
    </Grid>
  );
};
