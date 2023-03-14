import { PhaseMap } from "boardgame.io";
import { createInitialState, DartsGameState } from "../DartsGame";
import { DartsGamePhases } from "../Utilities/DartsGameUtilities";

export const gameOverPhase: PhaseMap<DartsGameState> = {
  [DartsGamePhases.GameOver]: {
    next: DartsGamePhases.GameConfig,
    turn: {
      activePlayers: { all: "allPlay" },
    },
    onBegin: (state) => {
      state.G.gamePhase = DartsGamePhases.GameOver;
    },
    moves: {
      rematch: (state) => {
        // Hold onto the game config during a rematch
        const gameType = state.G.gameType;
        const gameConfig = state.G.gameConfig;

        // Reset the game state values to their initial values (you can't replace the whole state object)
        Object.assign(state.G, createInitialState(state.ctx.numPlayers));
        // manually reset optional parameters
        state.G.winner = undefined;
        state.G.phaseData = undefined;

        state.G.gameType = gameType;
        state.G.gameConfig = gameConfig;

        // reduce the turn count by one, as the next endTurn will bump it by one
        state.G.turn = 0;

        // Set the first player as the active player not in any stage
        state.events.endPhase();
      },
    },
  },
};
