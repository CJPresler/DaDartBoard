import { PhaseMap } from "boardgame.io";
import { INVALID_MOVE, TurnOrder } from "boardgame.io/core";
import { Segment, SegmentSection } from "../../Utillities/DartboardUtilities";
import { DartsGameState } from "../DartsGame";
import {
  commonDartHit,
  commonTurnEnd,
  DartsGamePhases,
  DartsGameTypes,
} from "../Utilities/DartsGameUtilities";

export type CricketSegmentSections =
  | SegmentSection.Fifteen
  | SegmentSection.Sixteen
  | SegmentSection.Seventeen
  | SegmentSection.Eighteen
  | SegmentSection.Nineteen
  | SegmentSection.Twenty
  | SegmentSection.BULL;

export interface CricketPlayerData {
  score: number;
  sectionsHit: Record<CricketSegmentSections, number>;
}

export interface CricketPhaseData {
  playerData: Record<string, CricketPlayerData>;
}

export const cricketPhase: PhaseMap<DartsGameState> = {
  [DartsGameTypes.Cricket]: {
    turn: {
      order: {
        ...TurnOrder.RESET,
        playOrder: (context) => context.G.gameConfig.playOrder,
      },
      onEnd: commonTurnEnd,
    },
    next: DartsGamePhases.GameOver,
    onBegin: (state) => {
      state.G.gamePhase = DartsGamePhases.InGame;
      state.G.gameType = DartsGameTypes.Cricket;

      const playerData: Record<string, CricketPlayerData> = {};
      state.G.gameConfig.playOrder.forEach((playerID) => {
        playerData[playerID] = {
          score: 0,
          sectionsHit: { 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 25: 0 },
          // Near victory start
          // sectionsHit: { 15: 3, 16: 3, 17: 3, 18: 3, 19: 3, 20: 3, 25: 0 },
        };
      });

      state.G.phaseData = { playerData };
    },
    moves: {
      dartHit: {
        move: (state, segment: Segment) => {
          if (
            state.G.gameType !== DartsGameTypes.Cricket ||
            !state.G.phaseData
          ) {
            // We shouldn't get into this state as the phaseData should be initialized in the phase onBegin
            console.error("phaseData is empty for this player");
            return INVALID_MOVE;
          }

          // If the space was already occupied or a move has allready occured in this turn it is invalid
          if ((state.ctx.numMoves ?? 0) > 2) {
            return INVALID_MOVE;
          }

          commonDartHit(state, segment);

          // In Cricket we don't care about any segments below 15, and anything above 21 is invalid
          if (segment.Section < 15 || segment.Section > 25) {
            return undefined;
          }

          const playerState =
            state.G.phaseData.playerData[state.ctx.currentPlayer];
          const section = segment.Section as CricketSegmentSections;

          const previousHitCount = playerState.sectionsHit[section];
          const hitsNeededToScore =
            previousHitCount >= 3 ? 0 : 3 - previousHitCount;
          const newHitCount = previousHitCount + segment.Type; // Add 1 for single, 2 for double, 3 for triple

          // Check every other player to see if the section is still open
          let sectionIsClosed = true;

          state.G.gameConfig.playOrder.forEach((playerID) => {
            if (
              playerID === state.ctx.currentPlayer ||
              state.G.gameType !== DartsGameTypes.Cricket ||
              !state.G.phaseData
            ) {
              // Ignore the current player
              return;
            }

            // If any player hasn't hit the section 3 or more times then it is not closed
            if (
              state.G.phaseData.playerData[playerID].sectionsHit[section] < 3
            ) {
              sectionIsClosed = false;
            }
          });

          const pointsEarned =
            sectionIsClosed || newHitCount < 3
              ? 0
              : (segment.Type - hitsNeededToScore) * section;

          // Update the player state
          playerState.sectionsHit[section] = newHitCount;
          playerState.score += pointsEarned;

          // Check for the game over condition
          let allSectionsClosed = true;
          for (let section = 15; section < 22; section++) {
            section = section === 21 ? 25 : section;

            if (
              state.G.phaseData.playerData[state.ctx.currentPlayer].sectionsHit[
                section as CricketSegmentSections
              ] < 3
            ) {
              allSectionsClosed = false;
              break;
            }
          }

          let hasHighestScore = true;
          if (allSectionsClosed) {
            state.G.gameConfig.playOrder.every((playerID) => {
              if (
                playerID === state.ctx.currentPlayer ||
                state.G.gameType !== DartsGameTypes.Cricket ||
                !state.G.phaseData
              ) {
                // Ignore the current player
                return true;
              }

              // If any other player has a higher score then the current player does not have the highest score
              if (
                state.G.phaseData.playerData[playerID].score >
                state.G.phaseData.playerData[state.ctx.currentPlayer].score
              ) {
                hasHighestScore = false;
                return false;
              }

              // Keep iterating
              return true;
            });
          }

          if (allSectionsClosed && hasHighestScore) {
            state.G.winner = state.ctx.currentPlayer;
            state.events.endPhase();
          }
        },
        undoable: true,
      },
    },
  },
};
