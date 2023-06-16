import { Howl } from "howler";
import dartHitSound from "../../Assets/Sounds/dartHit.mp3";
import dartHitErrorSound from "../../Assets/Sounds/dartHitError.mp3";
import switchPlayerSound from "../../Assets/Sounds/switchPlayer.mp3";
import gruntBDaySound from "../../Assets/Sounds/gruntBDay.mp3";

const dartHitHowl = new Howl({ src: [dartHitSound], volume: 0.3 });
const dartHitErrorHowl = new Howl({ src: [dartHitErrorSound], volume: 0.3 });
const switchPlayerHowl = new Howl({ src: [switchPlayerSound], volume: 2 });
const gruntBDayHowl = new Howl({ src: [gruntBDaySound], volume: 0.3 });

export enum Sound {
  DartHit,
  DartHitError,
  SwitchPlayer,
  GruntBDay,
}

export function PlaySound(sound: Sound): void {
  switch (sound) {
    case Sound.DartHit:
      dartHitHowl.play();
      break;
    case Sound.DartHitError:
      dartHitErrorHowl.play();
      break;
    case Sound.SwitchPlayer:
      switchPlayerHowl.play();
      break;
    case Sound.GruntBDay:
      gruntBDayHowl.play();
      break;
    default:
      return;
  }
}
