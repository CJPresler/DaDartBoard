import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Client } from "boardgame.io/client";
import { Segment, SegmentID } from "../Utillities/DartboardUtilities";
import {
  Button,
  styled,
  ButtonGroup,
  Grid,
  Container,
  Stack,
} from "@mui/material";
import { Icon } from "@mdi/react";
import { mdiBluetooth, mdiBluetoothConnect, mdiArrowProjectile } from "@mdi/js";
import { Granboard } from "../Utillities/Granboard";
import { ClientState } from "boardgame.io/dist/types/src/client/client";
import Confetti from "react-confetti";
import { Dartboard } from "../Components/Dartboard";
import { CricketScoreboard } from "../Components/CricketScoreboard";
import { Standard01Scoreboard } from "../Components/Standard01Scoreboard";
import {
  DartsGameCricketState,
  DartsGameStandard01State,
  DartsGameState,
} from "../Games/DartsGame";
import { State } from "boardgame.io";
import {
  DartsGamePhases,
  DartsGameTypes,
} from "../Games/Utilities/DartsGameUtilities";
import { GameConfig } from "../Components/GameConfig";

const DartboardContainer = styled(Container)(({ theme }) => ({
  maxWidth: "500px",
  // Match [lg, ∞)
  [theme.breakpoints.up("lg")]: {
    maxWidth: "1000px",
  },
}));

interface DartsGameProps {
  gameStateChanged?: (state: ClientState<any>) => void;
  client: ReturnType<typeof Client<DartsGameState>> | undefined;
}

export const DartsGameBoard = (props: DartsGameProps) => {
  const [gameState, setGameState] = useState<ClientState<DartsGameState>>();

  const [granboard, setGranboard] = useState<Granboard>();

  useEffect(() => {
    if (!props.client) {
      return;
    }

    const unsubscribe = props.client.subscribe((state) => {
      setGameState(state);
      props.gameStateChanged?.(state);
    });

    // Update the current state
    setGameState(props.client.getState());
    props.gameStateChanged?.(props.client.getState());

    return () => {
      unsubscribe();
    };
  }, [props]);

  const onSegmentHit = useCallback(
    (segment: Segment) => {
      if (!props.client) {
        return;
      }

      if (segment.ID === SegmentID.RESET_BUTTON) {
        // The reset button is a special case and is used to end the turn
        props.client.events.endTurn?.();
        return;
      }
      props.client.moves.dartHit(segment);
    },
    [props.client]
  );

  return (
    <Container id="dartboard" maxWidth="xl">
      <Stack spacing={2}>
        {(!props.client || !props.client.playerID || !gameState) && (
          <h2>Loading...</h2>
        )}
        {props.client && props.client.playerID && gameState && (
          <Fragment>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              columnSpacing={4}
            >
              {gameState.G.gamePhase !== DartsGamePhases.GameConfig && (
                <Grid item xs={12} lg={6}>
                  {gameState.G.winner && (
                    <Fragment>
                      <Confetti />
                      <h3>{`${
                        props.client.matchData?.at(parseInt(gameState.G.winner))
                          ?.name ?? `Player ${gameState.G.winner}`
                      } Wins!`}</h3>
                    </Fragment>
                  )}
                  {!gameState.G.winner && (
                    <h2>
                      {`${
                        gameState?.ctx.currentPlayer
                          ? props.client.matchData?.at(
                              parseInt(gameState.ctx.currentPlayer)
                            )?.name ?? "Oponnent"
                          : "Oponnent"
                      }'s Turn`}
                    </h2>
                  )}

                  <DartboardContainer style={{ position: "relative" }}>
                    <Dartboard
                      borderGlow={gameState.isActive}
                      highlightSegmentShortName={gameState.G.lastHit?.ShortName}
                      onSegmentClicked={onSegmentHit}
                    />
                    <Button
                      className="cta"
                      sx={{ position: "absolute", top: 0, right: 0 }}
                      onClick={async () => {
                        setGranboard(
                          await Granboard.ConnectToBoard(onSegmentHit)
                        );
                      }}
                    >
                      <Icon
                        path={granboard ? mdiBluetoothConnect : mdiBluetooth}
                      />
                    </Button>
                    <h3
                      style={{ position: "absolute", top: -5, left: 0 }}
                    >{`Round ${Math.ceil(
                      gameState.G.turn / gameState.G.playOrder.length
                    )}`}</h3>
                    <Grid
                      container
                      justifyContent={"space-evenly"}
                      style={{ fontWeight: "bolder", fontSize: "2.5vh" }}
                    >
                      {Array.from(Array(3).keys()).map((i) => (
                        <Grid item>
                          {gameState?.G.commonPlayerData[
                            gameState?.ctx.currentPlayer
                          ].dartThrows[0][i]?.ShortName ? (
                            <div style={{ height: 54 }}>
                              {
                                gameState?.G.commonPlayerData[
                                  gameState?.ctx.currentPlayer
                                ].dartThrows[0][i]?.ShortName
                              }
                            </div>
                          ) : (
                            <Icon path={mdiArrowProjectile} size="40" />
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  </DartboardContainer>
                  <Container maxWidth="md">
                    <ButtonGroup
                      variant="outlined"
                      aria-label="outlined button group"
                    >
                      {gameState.G.gamePhase === DartsGamePhases.InGame && (
                        <Fragment>
                          <Button
                            className="cta"
                            onClick={() => props.client?.events.endTurn?.()}
                          >
                            End Turn
                          </Button>
                          <Button className="cta" onClick={props.client.undo}>
                            Undo
                          </Button>
                        </Fragment>
                      )}
                      {gameState.G.gamePhase === DartsGamePhases.GameOver && (
                        <Button
                          className="cta"
                          onClick={() => props.client?.moves.rematch?.()}
                        >
                          Rematch
                        </Button>
                      )}
                    </ButtonGroup>
                  </Container>
                </Grid>
              )}
              {gameState.G.gamePhase !== DartsGamePhases.GameConfig && (
                <Fragment>
                  {gameState.G.gameType === DartsGameTypes.Cricket && (
                    <CricketScoreboard
                      gameState={gameState as State<DartsGameCricketState>}
                      client={props.client}
                    />
                  )}
                  {gameState.G.gameType === DartsGameTypes.Standard01 && (
                    <Standard01Scoreboard
                      gameState={gameState as State<DartsGameStandard01State>}
                      client={props.client}
                    />
                  )}
                </Fragment>
              )}
              {gameState.G.gamePhase === DartsGamePhases.GameConfig && (
                <GameConfig client={props.client} gameState={gameState} />
              )}
            </Grid>
          </Fragment>
        )}
      </Stack>
    </Container>
  );
};
