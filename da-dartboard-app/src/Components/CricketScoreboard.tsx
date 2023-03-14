import {
  mdiHexagonOutline,
  mdiHexagonSlice3,
  mdiHexagonSlice6,
  mdiLanDisconnect,
} from "@mdi/js";
import Icon from "@mdi/react";
import {
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { State } from "boardgame.io";
import { Client } from "boardgame.io/dist/types/src/client/client";
import { FunctionComponent } from "react";
import { DartsGameCricketState } from "../Games/DartsGame";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "1.5vh",
  },
  padding: "5px",
  [theme.breakpoints.up("sm")]: {
    padding: "10px",
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

export const CricketScoreboard: FunctionComponent<{
  gameState: State<DartsGameCricketState>;
  client: ReturnType<typeof Client<any>>;
}> = (props) => {
  return (
    <Grid item xs={12} lg={6}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell align="center">15</StyledTableCell>
              <StyledTableCell align="center">16</StyledTableCell>
              <StyledTableCell align="center">17</StyledTableCell>
              <StyledTableCell align="center">18</StyledTableCell>
              <StyledTableCell align="center">19</StyledTableCell>
              <StyledTableCell align="center">20</StyledTableCell>
              <StyledTableCell align="center">Bull</StyledTableCell>
              <StyledTableCell align="center">Score</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {props.client.matchData
              ?.filter((matchData) =>
                props.gameState.G.playOrder.includes(matchData.id.toString())
              )
              .map((matchData) => (
                <StyledTableRow
                  style={
                    props.gameState?.ctx.currentPlayer ===
                    matchData.id.toString()
                      ? {
                          boxShadow: "inset 0px 0px 35px -7px #00BAFF",
                        }
                      : undefined
                  }
                >
                  <StyledTableCell component="th" scope="row">
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
                    {matchData.name ? matchData.name : `Player ${matchData.id}`}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getSectionIcon(
                      props.gameState?.G.phaseData?.playerData[
                        matchData.id.toString()
                      ].sectionsHit[15]
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getSectionIcon(
                      props.gameState?.G.phaseData?.playerData[
                        matchData.id.toString()
                      ].sectionsHit[16]
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getSectionIcon(
                      props.gameState?.G.phaseData?.playerData[
                        matchData.id.toString()
                      ].sectionsHit[17]
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getSectionIcon(
                      props.gameState?.G.phaseData?.playerData[
                        matchData.id.toString()
                      ].sectionsHit[18]
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getSectionIcon(
                      props.gameState?.G.phaseData?.playerData[
                        matchData.id.toString()
                      ].sectionsHit[19]
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getSectionIcon(
                      props.gameState?.G.phaseData?.playerData[
                        matchData.id.toString()
                      ].sectionsHit[20]
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getSectionIcon(
                      props.gameState?.G.phaseData?.playerData[
                        matchData.id.toString()
                      ].sectionsHit[25]
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontWeight: "bold" }}>
                    {
                      props.gameState?.G.phaseData?.playerData[
                        matchData.id.toString()
                      ].score
                    }
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
