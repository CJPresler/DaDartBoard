import { PhaseMap } from "boardgame.io";
import { DartsGameState } from "../DartsGame";
import {
  DartsGamePhases,
  DartsGameTypes,
} from "../Utilities/DartsGameUtilities";

export const gameConfigPhase: PhaseMap<DartsGameState> = {
  [DartsGamePhases.GameConfig]: {
    start: true, // Start in the game config mode
    next: (state) => {
      // We should calculate what phase to go into next
      return state.G.gameType;
    },
    turn: {
      activePlayers: { all: "allPlay" },
    },
    onBegin: (state) => {
      state.G.gamePhase = DartsGamePhases.GameConfig;
    },
    moves: {
      start: {
        move: (state) => {
          state.events.endPhase();
        },
      },
      setGameType: {
        move: (state, gameType: DartsGameTypes) => {
          state.G.gameType = gameType;
        },
      },
    },
  },
};
