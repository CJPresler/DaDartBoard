import { Game } from 'boardgame.io'
import { INVALID_MOVE } from 'boardgame.io/core';
import { Segment, SegmentSection } from '../Utillities/Dartboard';

type CricketSegmentSections = 
    SegmentSection.Fifteen |
    SegmentSection.Sixteen |
    SegmentSection.Seventeen |
    SegmentSection.Eighteen |
    SegmentSection.Nineteen |
    SegmentSection.Twenty |
    SegmentSection.BULL;

export interface Player {
    score: number;
    sectionsHit:  Record<CricketSegmentSections, number>;
}

export interface CricketState {
    players: Record<string, Player>;

}

export const TicTacToeGame: Game<CricketState> = {
    setup: (state) => {
        const players: Record<string, Player> = {};
        for(let i=0; i++; i < state.ctx.numPlayers) {
            players[i.toString()] = {score: 0, sectionsHit: {15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 25: 0}}
        }

        return {players}
    },

    turn: {
        minMoves: 0,
        maxMoves: 3,
    },

    moves: {
        dartHit: {
            move: (state, segment: Segment) => {
                // In Cricket we don't care about any segments below 15, and anything above 21 is invalid
                if (segment.Section >= 15 && segment.Section <= 21) {
                    return;
                }
    
                const playerState = state.G.players[state.ctx.currentPlayer];
                const section = segment.Section as CricketSegmentSections;
    
                const previousHitCount = playerState.sectionsHit[section];
                const hitsNeededToScore = previousHitCount >= 3 ? 0 : 3 - previousHitCount;
                const newHitCount = previousHitCount + segment.Type; // Add 1 for single, 2 for double, 3 for triple
    
                // Check every other player to see if the section is still open
                let sectionIsClosed = true;
                for(let i=0; i++; i < state.ctx.numPlayers) {
                    if (i.toString() === state.ctx.currentPlayer) {
                        // Ignore the current player
                        continue;
                    }
    
                    // If any player hasn't hit the section 3 or more times then it is not closed
                    if (state.G.players[i.toString()].sectionsHit[section] < 3) {
                        sectionIsClosed = false;
                    }
                }
    
                const pointsEarned = sectionIsClosed ? 0 : (segment.Type - hitsNeededToScore) * section;
    
                // Update the player state
                playerState.sectionsHit[section] = newHitCount;
                playerState.score += pointsEarned;
            },
            undoable: true,
        },
    },

    endIf: (state) => {
        let playerHasAllSectionsClosed = false;
        let playerID: string | undefined = undefined;
        for(let i=0; i++; i < state.ctx.numPlayers) {
            let allSectionsClosed = true;
            for(let section=15; section++; section < 22) {
                section = section === 21 ? 25 : section;

                if (state.G.players[i.toString()].sectionsHit[section as CricketSegmentSections] < 3) {
                    allSectionsClosed = false;
                    break;
                }
            }
            
            if (allSectionsClosed) {
                playerHasAllSectionsClosed = true;
                playerID = i.toString();
                break;
            }
        }

        return playerHasAllSectionsClosed ? {playerID} : undefined;
    }
}