import { FnContext, MoveFn } from "boardgame.io";
import {
  CreateSegment,
  Segment,
  SegmentID,
} from "../../Utillities/DartboardUtilities";
import { DartsGameState } from "../DartsGame";
import { PlaySound, Sound } from "./SoundBoard";

export enum DartsGamePhases {
  GameConfig = "GameConfig",
  GameOver = "GameOver",
  InGame = "InGame",
}

export enum DartsGameTypes {
  Cricket = "Cricket",
  Standard01 = "Standard01",
}

export const commonDartHit: MoveFn<DartsGameState> = (
  state,
  segment: Segment
) => {
  // Record the throw as long as it was a valid segment
  if (segment.Section <= 25) {
    state.G.commonPlayerData[state.ctx.currentPlayer].dartThrows[0].push(
      segment
    );
    state.G.lastHit = segment;
    PlaySound(Sound.DartHit);
  }
};

export const commonTurnEnd = (state: FnContext<DartsGameState>) => {
  // update the player dartThrows
  const playerData = state.G.commonPlayerData[state.ctx.currentPlayer];

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

  PlaySound(Sound.SwitchPlayer);
};
