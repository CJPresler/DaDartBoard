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

export const TicTacToeBoard = (state: TicTacToeProps) => {
  let winner = getWinner(state.ctx);

  return (
    <main>
      <h3>{state.isActive ? "Your Turn" : "Oponents Turn"}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplate: 'repeat(3, 3rem) / repeat(3, 3rem)',
          gridGap: '0.3em',
          margin: 'auto',
          width: 'fit-content',
        }}
      >
        {state.G.cells.map((cell, index) => (
          <button
            key={index}
            onClick={() => state.moves.clickCell(index)}
            disabled={cell !== null}
          >
            {cell}
          </button>
        ))}
      </div>
      <button className="cta" onClick={()=>state.events.endTurn?.()}>
          End Turn
      </button>
      <button className="cta" onClick={state.undo}>
          Undo
      </button>

      {winner && <p>{winner}</p>}
    </main>
  );
};
