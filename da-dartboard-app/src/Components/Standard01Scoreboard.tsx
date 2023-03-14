import { mdiLanDisconnect } from "@mdi/js";
import Icon from "@mdi/react";
import { Card, Grid } from "@mui/material";
import { State } from "boardgame.io";
import { Client } from "boardgame.io/dist/types/src/client/client";
import { FunctionComponent } from "react";
import { DartsGameStandard01State } from "../Games/DartsGame";

export const Standard01Scoreboard: FunctionComponent<{
  gameState: State<DartsGameStandard01State>;
  client: ReturnType<typeof Client<any>>;
}> = (props) => {
  return (
    <Grid container item xs={12} lg={6} spacing={2}>
      {props.client.matchData
        ?.filter((matchData) =>
          props.gameState.G.playOrder.includes(matchData.id.toString())
        )
        .map((matchData) => (
          <Grid item xs={6}>
            <Card
              style={
                props.gameState?.ctx.currentPlayer === matchData.id.toString()
                  ? {
                      boxShadow: "inset 0px 0px 35px -7px #00BAFF",
                    }
                  : undefined
              }
            >
              {!matchData.isConnected && (
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
                {matchData.name ? matchData.name : `Player ${matchData.id}`}
              </h2>
              <h2>
                {
                  props.gameState?.G.phaseData?.playerData[
                    matchData.id.toString()
                  ].score
                }
              </h2>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};
