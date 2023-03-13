import { FilteredMetadata, PhaseMap } from "boardgame.io";
import { TurnOrder } from "boardgame.io/core";
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
      order: TurnOrder.RESET,
      activePlayers: { all: "allPlay" },
    },
    onBegin: (state) => {
      state.G.gamePhase = DartsGamePhases.GameConfig;
    },
    moves: {
      start: {
        move: (state, matchData: FilteredMetadata) => {
          // Only put the connected players into the game
          state.G.gameConfig.playOrder = matchData
            .filter((seat) => seat.isConnected)
            .map((seat) => String(seat.id));

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
