import { Game } from "boardgame.io";
import { Segment } from "../Utillities/DartboardUtilities";
import { cricketPhase, CricketPhaseData } from "./Phases/CricketPhase";
import { DartsGameConfig, gameConfigPhase } from "./Phases/GameConfigPhase";
import { gameOverPhase } from "./Phases/GameOverPhase";
import { standard01Phase, Standard01PhaseData } from "./Phases/Standard01Phase";
import {
  DartsGamePhases,
  DartsGameTypes,
} from "./Utilities/DartsGameUtilities";

// Data that is specific to a player
export interface PlayerData {
  dartThrows: Segment[][]; // Dart throws per turn
}

interface DartsGameBaseState {
  gamePhase: DartsGamePhases;
  gameType: DartsGameTypes;
  phaseData?: unknown;
  gameConfig: DartsGameConfig;
  playOrder: string[];
  startingPlayerIndex: number;
  commonPlayerData: Record<string, PlayerData>;
  lastHit: Segment | undefined;
  turn: number;
  winner?: string;
}

export interface DartsGameCricketState extends DartsGameBaseState {
  gameType: DartsGameTypes.Cricket;
  phaseData?: CricketPhaseData;
}

export interface DartsGameStandard01State extends DartsGameBaseState {
  gameType: DartsGameTypes.Standard01;
  phaseData?: Standard01PhaseData;
}

export type DartsGameState = DartsGameCricketState | DartsGameStandard01State;

export function createInitialState(numPlayers: number): DartsGameState {
  // Setup the common game state
  const players: Record<string, PlayerData> = {};
  for (let i = 0; i < numPlayers; i++) {
    players[i.toString()] = {
      dartThrows: [[]],
    };
  }

  return {
    gamePhase: DartsGamePhases.GameConfig,
    gameType: DartsGameTypes.Cricket,
    gameConfig: { randomStart: true, standard01Score: 501 },
    playOrder: [],
    startingPlayerIndex: 0,
    commonPlayerData: players,
    lastHit: undefined,
    turn: 1,
  };
}

export const DartsGame: Game<DartsGameState> = {
  name: "DaDartboardGames",
  setup: (state) => {
    return createInitialState(state.ctx.numPlayers);
  },

  phases: {
    ...gameConfigPhase,
    ...gameOverPhase,
    ...cricketPhase,
    ...standard01Phase,
  },
};
