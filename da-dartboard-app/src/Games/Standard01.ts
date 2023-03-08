import { Game } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import {
  CreateSegment,
  Segment,
  SegmentID,
} from "../Utillities/DartboardUtilities";
import {
  commonDartHit,
  CommonGameState,
  CommonPlayerData,
  commonTurn,
} from "./CommonGameLogic";

// Data that is specific to a player
export interface Player extends CommonPlayerData {
  score: number;
}

// Overall game state
export interface Standard01State extends CommonGameState<Player> {}

function createInitialState(
  numPlayers: number,
  startingScore: number
): Standard01State {
  const players: Record<string, Player> = {};
  for (let i = 0; i < numPlayers; i++) {
    players[i.toString()] = {
      score: 501, // hardcode to 501 for now
      dartThrows: [[]],
    };
  }

  return { gameType: "Standard01", players, lastHit: undefined, turn: 1 };
}

export const Standard01Game: (
  startingScore: number
) => Game<Standard01State> = (startingScore) => {
  return {
    name: "DaDartboardGames",
    setup: (state) => {
      return createInitialState(state.ctx.numPlayers, startingScore);
    },

    moves: {
      dartHit: {
        move: (state, segment: Segment) => {
          // Limit dart throws to 3 per move
          if ((state.ctx.numMoves ?? 0) > 2) {
            return INVALID_MOVE;
          }

          // Check that the segment is not a special segment above 25 (such as the reset button)
          if (segment.Section > 25) {
            return undefined;
          }

          const playerState = state.G.players[state.ctx.currentPlayer];

          // Check if the player isn't out of turns, but is out of throws due to a bust
          if (playerState.dartThrows[0].length >= 3) {
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
              state.events.setActivePlayers({ all: "gameOver" });
            }
          } else {
            // The player has busted. Add misses for any remaining throws
            for (let i = playerState.dartThrows[0].length; i < 3; i++) {
              playerState.dartThrows[0].push(CreateSegment(SegmentID.MISS));
            }
          }
        },
        undoable: true,
      },
    },

    turn: {
      ...commonTurn<Standard01State>((numPlayers) =>
        createInitialState(numPlayers, startingScore)
      ),
    },
  };
};
