import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { TicTacToeState } from '../Games/TicTacToe';
import { Ctx } from 'boardgame.io';

const getWinner = (ctx: Ctx): string | null => {
  if (!ctx.gameover) return null;
  if (ctx.gameover.draw) return 'Draw';
  return `Player ${ctx.gameover.winner} wins!`;
};

interface TicTacToeProps extends BoardProps<TicTacToeState> {}

export const TicTacToeBoard = ({ G, ctx, moves }: TicTacToeProps) => {
  let winner = getWinner(ctx);

  return (
    <main>
      <div
        style={{
          display: 'grid',
          gridTemplate: 'repeat(3, 3rem) / repeat(3, 3rem)',
          gridGap: '0.3em',
          margin: 'auto',
          width: 'fit-content',
        }}
      >
        {G.cells.map((cell, index) => (
          <button
            key={index}
            onClick={() => moves.clickCell(index)}
            disabled={cell !== null}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && <p>{winner}</p>}
    </main>
  );
};
