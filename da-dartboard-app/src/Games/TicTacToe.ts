import { Game } from 'boardgame.io'
import { INVALID_MOVE } from 'boardgame.io/core';

export interface TicTacToeState {
    cells: (null | string)[];
}

// Return true if `cells` is in a winning configuration.
function IsVictory(cells: (null | string)[]) {
    const positions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    const isRowComplete = (row: number[]) => {
        const symbols = row.map(i => cells[i]);
        return symbols.every(i => i !== null && i === symbols[0]);
    };

    return positions.map(isRowComplete).some(i => i === true);
}
  
// Return true if all `cells` are occupied.
function IsDraw(cells: (null | string)[]) {
    return cells.filter(c => c === null).length === 0;
}

export const TicTacToeGame: Game<TicTacToeState> = {
    setup: () => ({
        cells: Array(9).fill(null)
    }),

    turn: {
        minMoves: 1,
    },

    moves: {
        clickCell: {
            move: (state, id: number) => {
                // If the space was already occupied or a move has allready occured in this turn it is invalid
                if (state.G.cells[id] !== null || (state.ctx.numMoves ?? 0) > 0) {
                    return INVALID_MOVE;
                }
                state.G.cells[id] = state.ctx.currentPlayer;
            },
            undoable: true,
        },
    },

    endIf: (state) => {
        if (IsVictory(state.G.cells)) {
            return { winner: state.ctx.currentPlayer };
        }

        if (IsDraw(state.G.cells)) {
            return { draw: true };
        }
    },

    disableUndo: false,
}