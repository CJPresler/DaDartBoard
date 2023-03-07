import { MoveFn, TurnConfig } from "boardgame.io";
import {
  CreateSegment,
  Segment,
  SegmentID,
} from "../Utillities/DartboardUtilities";

// Data that is specific to a player
export interface CommonPlayerData {
  dartThrows: Segment[][]; // Dart throws per turn
}

export interface CommonGameState<PlayerDataType extends CommonPlayerData> {
  players: Record<string, PlayerDataType>;
  lastHit: Segment | undefined;
  turn: number;
  winner?: string;
}

export const commonDartHit: MoveFn<CommonGameState<CommonPlayerData>> = (
  state,
  segment: Segment
) => {
  // Record the throw as long as it was a valid segment
  if (segment.Section <= 25) {
    state.G.players[state.ctx.currentPlayer].dartThrows[0].push(segment);
    state.G.lastHit = segment;
  }
};

export const commonTurn: <GameState extends CommonGameState<CommonPlayerData>>(
  createInitialState: (numPlayers: number) => GameState
) => TurnConfig<GameState> = (createInitialState) => {
  return {
    minMoves: 0,
    onEnd: (state) => {
      // update the player dartThrows
      const playerData = state.G.players[state.ctx.currentPlayer];

      // Add misses for any throws not registered by the end of the turn
      for (let i = playerData.dartThrows[0].length; i < 3; i++) {
        playerData.dartThrows[0].push(CreateSegment(SegmentID.MISS));
      }

      // New up a new array for current throws and insert it at the beginning
      playerData.dartThrows = [[], ...playerData.dartThrows];

      // Reset the lastHit
      state.G.lastHit = undefined;

      // Rev the turn count
      state.G.turn++;
    },

    stages: {
      gameOver: {
        moves: {
          rematch: (state) => {
            // Reset the game state values to their initial values (you can't replace the whole state object)
            Object.assign(state.G, createInitialState(state.ctx.numPlayers));
            // winner is underfined initially so it needs to be manually reset
            state.G.winner = undefined;

            // reduce the turn count by one, as the next endTurn will bump it by one
            state.G.turn = 0;

            // Set the first player as the active player not in any stage
            state.events.endTurn({ next: "0" });
            state.events.setActivePlayers([]);
          },
        },
      },
    },
  };
};
