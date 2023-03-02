import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Client } from "boardgame.io/client";
import {
  Segment,
  SegmentID,
} from "../Utillities/DartboardUtilities";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  tableCellClasses,
  ButtonGroup,
  Grid,
  ListItem,
  Container,
  Stack,
} from "@mui/material";
import { Icon } from "@mdi/react";
import {
  mdiHexagonOutline,
  mdiHexagonSlice3,
  mdiHexagonSlice6,
  mdiBluetooth,
  mdiBluetoothConnect,
  mdiLanDisconnect,
  mdiArrowProjectile,
} from "@mdi/js";
import { Granboard } from "../Utillities/Granboard";
import { CricketState } from "../Games/Cricket";
import { ClientState } from "boardgame.io/dist/types/src/client/client";
import Confetti from "react-confetti";
import { Dartboard } from "../Components/Dartboard";
import { fontSize } from "@mui/system";

const getSectionIcon = (hitCount: number | undefined) => {
  if (hitCount === 0) {
    return undefined;
  }

  const iconPath =
    hitCount === 1
      ? mdiHexagonOutline
      : hitCount === 2
        ? mdiHexagonSlice3
        : mdiHexagonSlice6;
  return <Icon path={iconPath} size={1} />;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface CricketBoardProps {
  client: ReturnType<typeof Client<CricketState>> | undefined;
}

export const CricketBoard = (props: CricketBoardProps) => {
  const [gameState, setGameState] = useState<ClientState<CricketState>>();

  const [granboard, setGranboard] = useState<Granboard>();

  useEffect(() => {
    if (!props.client) {
      return;
    }

    const unsubscribe = props.client.subscribe((state) => {
      setGameState(state);
    });

    // Update the current state
    setGameState(props.client.getState());

    return () => {
      unsubscribe();
    };
  }, [props.client]);

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
    <Container
      id="dartboard"
      maxWidth="md"
      style={{
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <Stack spacing={2}>
        {(!props.client || !props.client.playerID || !gameState) && (
          <h2>Loading...</h2>
        )}
        {props.client && props.client.playerID && gameState && (
          <Fragment>
            {gameState.G.winner && (
              <Fragment>
                <Confetti />
                <h3>{`${props.client.matchData?.at(parseInt(gameState.G.winner))
                  ?.name ?? `Player ${gameState.G.winner}`
                  } Wins!`}</h3>
              </Fragment>
            )}
            {!gameState.G.winner && (
              <h2>
                {gameState?.isActive
                  ? "Your Turn"
                  : `${gameState?.ctx.currentPlayer
                    ? props.client.matchData?.at(
                      parseInt(gameState.ctx.currentPlayer)
                    )?.name ?? "Oponnent"
                    : "Oponnent"
                  }'s Turn`}
              </h2>
            )}

            <div style={{ position: 'relative' }}>
              <Dartboard borderGlow={gameState.isActive} highlightSegmentShortName={gameState.G.lastHit?.ShortName} onSegmentClicked={onSegmentHit} />
              <Button
                className="cta"
                sx={{ position: "absolute", top: 0, right: 0 }}
                onClick={async () => {
                  setGranboard(await Granboard.ConnectToBoard(onSegmentHit));
                }}
              >
                <Icon path={granboard ? mdiBluetoothConnect : mdiBluetooth} />
              </Button>
              <h3
                style={{ position: "absolute", top: -5, left: 0 }}
              >{`Round ${Math.ceil(
                gameState.G.turn / gameState.ctx.numPlayers
              )}`}</h3>
            </div>
            <Grid item container justifyContent={"space-evenly"} style={{ fontWeight: 'bolder', fontSize: 25 }}>
              {Array.from(Array(3).keys()).map((i) => (
                <Grid item>
                  {gameState?.G.players[gameState?.ctx.currentPlayer]
                    .dartThrows[0][i]?.ShortName ?? (
                      <Icon path={mdiArrowProjectile} size="40" />
                    )}
                </Grid>
              ))}
            </Grid>
            <Container maxWidth="md">
              <ButtonGroup variant="outlined" aria-label="outlined button group">
                {gameState.G.winner && (
                  <Button
                    className="cta"
                    onClick={() => props.client?.moves.rematch?.()}
                  >
                    Rematch
                  </Button>
                )}
                {!gameState.G.winner && (
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
              </ButtonGroup>
            </Container>

            <Container maxWidth="md">
              <TableContainer
                component={Paper}
              >
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell align="right">15</StyledTableCell>
                      <StyledTableCell align="right">16</StyledTableCell>
                      <StyledTableCell align="right">17</StyledTableCell>
                      <StyledTableCell align="right">18</StyledTableCell>
                      <StyledTableCell align="right">19</StyledTableCell>
                      <StyledTableCell align="right">20</StyledTableCell>
                      <StyledTableCell align="right">Bull</StyledTableCell>
                      <StyledTableCell align="right">Score</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from(Array(gameState?.ctx.numPlayers).keys()).map(
                      (row) => (
                        <StyledTableRow style={gameState.ctx.currentPlayer === row.toString() ? { boxShadow: "inset 0px 0px 35px -7px #00BAFF" } : undefined}>
                          <StyledTableCell component="th" scope="row">
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
                            {props.client?.matchData?.at(row)?.name
                              ? props.client?.matchData?.at(row)?.name
                              : `Player ${row + 1}`}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {getSectionIcon(
                              gameState?.G.players[row.toString()].sectionsHit[15]
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {getSectionIcon(
                              gameState?.G.players[row.toString()].sectionsHit[16]
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {getSectionIcon(
                              gameState?.G.players[row.toString()].sectionsHit[17]
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {getSectionIcon(
                              gameState?.G.players[row.toString()].sectionsHit[18]
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {getSectionIcon(
                              gameState?.G.players[row.toString()].sectionsHit[19]
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {getSectionIcon(
                              gameState?.G.players[row.toString()].sectionsHit[20]
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {getSectionIcon(
                              gameState?.G.players[row.toString()].sectionsHit[25]
                            )}
                          </StyledTableCell>
                          <StyledTableCell
                            align="right"
                            sx={{ fontWeight: "bold" }}
                          >
                            {gameState?.G.players[row.toString()].score}
                          </StyledTableCell>
                        </StyledTableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </Fragment>
        )}
      </Stack>

    </Container>
  );
};
