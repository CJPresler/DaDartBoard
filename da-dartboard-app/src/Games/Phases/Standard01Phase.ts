import { PhaseMap } from "boardgame.io";
import { INVALID_MOVE, TurnOrder } from "boardgame.io/core";
import {
  CreateSegment,
  Segment,
  SegmentID,
} from "../../Utillities/DartboardUtilities";
import { DartsGameConfig, DartsGameState } from "../DartsGame";
import {
  commonDartHit,
  commonTurnEnd,
  DartsGamePhases,
  DartsGameTypes,
} from "../Utilities/DartsGameUtilities";

export interface Standard01PlayerData {
  score: number;
}

export interface Standard01GameConfig extends DartsGameConfig {
  startingScore: number;
}

export interface Standard01PhaseData {
  playerData: Record<string, Standard01PlayerData>;
}

export const standard01Phase: PhaseMap<DartsGameState> = {
  [DartsGameTypes.Standard01]: {
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
      state.G.gameType = DartsGameTypes.Standard01;
      const playerData: Record<string, Standard01PlayerData> = {};
      state.G.gameConfig.playOrder.forEach((playerID) => {
        playerData[playerID] = {
          score: 501,
        };
      });

      state.G.phaseData = { playerData };
    },
    moves: {
      dartHit: {
        move: (state, segment: Segment) => {
          if (
            state.G.gameType !== DartsGameTypes.Standard01 ||
            !state.G.phaseData
          ) {
            // We shouldn't get into this state as the phaseData should be initialized in the phase onBegin
            console.error("phaseData is empty for this player");
            return INVALID_MOVE;
          }

          // Limit dart throws to 3 per move
          if ((state.ctx.numMoves ?? 0) > 2) {
            return INVALID_MOVE;
          }

          // Check that the segment is not a special segment above 25 (such as the reset button)
          if (segment.Section > 25) {
            return undefined;
          }

          const playerState =
            state.G.phaseData.playerData[state.ctx.currentPlayer];
          const commonPlayerState =
            state.G.commonPlayerData[state.ctx.currentPlayer];

          // Check if the player isn't out of turns, but is out of throws due to a bust
          if (commonPlayerState.dartThrows[0].length >= 3) {
            return undefined;
          }

          commonDartHit(state, segment);

          const newScore = playerState.score - segment.Value;

          if (newScore >= 0) {
            // Only count the hit if it does not bring the new score below zero
            playerState.score = newScore;

            // Check if they've won
            if (newScore === 0) {
              state.G.winner = state.ctx.currentPlayer;
              state.events.endPhase();
            }
          } else {
            // The player has busted. Add misses for any remaining throws
            for (let i = commonPlayerState.dartThrows[0].length; i < 3; i++) {
              commonPlayerState.dartThrows[0].push(
                CreateSegment(SegmentID.MISS)
              );
            }
          }
        },
        undoable: true,
      },
    },
  },
};
