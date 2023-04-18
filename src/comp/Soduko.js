import React, { useState } from "react";
import "./style.scss";

const Sudoku = () => {
  var initialBoard = [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0],
  ];
  const [boardt, setBoard] = useState(initialBoard);
  const [notes, setNotes] = useState("");
  const [filllevel, setFilllevel] = useState(5);

  function handleCellChange(row, col, value) {
    const newBoard = [...boardt];
    newBoard[row][col] = parseInt(value);
    setBoard(newBoard);
  }

  function isValidMove(board, row, col, value) {
    // Check if value exists in same row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === value) {
        return false;
      }
    }

    // Check if value exists in same column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === value) {
        return false;
      }
    }

    // Check if value exists in same 3x3 square
    const squareRow = Math.floor(row / 3) * 3;
    const squareCol = Math.floor(col / 3) * 3;

    for (let i = squareRow; i < squareRow + 3; i++) {
      for (let j = squareCol; j < squareCol + 3; j++) {
        if (board[i][j] === value) {
          return false;
        }
      }
    }

    return true;
  }
  function solveBoard(board) {
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        // If cell is empty, try placing numbers 1-9
        if (board[row][col] === 0) {
          for (let value = 1; value <= 9; value++) {
            if (isValidMove(board, row, col, value)) {
              board[row][col] = value;

              if (solveBoard(board)) {
                // Board is solved
                return true;
              } else {
                // Undo the current cell and try next value
                board[row][col] = 0;
              }
            }
          }

          // Tried all values without success, backtrack
          return false;
        }
      }
    }

    // End of board reached, board is solved
    return true;
  }

  function handlesolve() {
    handletest();
    console.log(solveBoard(boardt));
    console.log(boardt);
    showboard(boardt);
  }
  function handletest() {
    const newBoard = boardt.map((innerArray) => [...innerArray]);

    setNotes(solveBoard(newBoard) ? "solvable " : "unsolvable");
  }
  function showboard(board) {
    const newBoard = [...board];
    setBoard(newBoard);
  }

  function generateRandomSolvableBoard() {
    const board = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => 0)
    ); // create a 9x9 empty board
    board[0][0] = Math.floor(Math.random() * 9) + 1;
    board[Math.floor(Math.random() * 6) + 3][
      Math.floor(Math.random() * 6) + 3
    ] = Math.floor(Math.random() * 9) + 1;
    solveBoard(board);

    // replace some of the numbers with zeros randomly
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (Math.random() < 1 - filllevel / 10) {
          // 50% chance to replace with zero
          board[i][j] = 0;
        }
      }
    }

    console.log(board);
    setBoard(board);
  }

  return (
    <div className="game">
      <div className="board">
        {boardt.map((row, rowIndex) => (
          <div className="row-container" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="number"
                min="1"
                max="9"
                step="1"
                maxLength="1"
                onInput={(event) => {
                  event.target.value = event.target.value.at(-1);
                }}
                value={cell || ""}
                onChange={(event) => {
                  handleCellChange(rowIndex, colIndex, event.target.value);
                  console.log(event.target.value);
                }}
              />
            ))}
          </div>
        ))}
        <button onClick={handlesolve}>solve</button>
        <button
          onClick={() => {
            generateRandomSolvableBoard();
          }}
        >
          generate board
        </button>
        <span>Fill level :</span>
        <input
          type="number"
          min="1"
          max="9"
          step="1"
          maxLength="1"
          onInput={(event) => {
            let n = event.target.value.at(-1);
            event.target.value = n;
            setFilllevel(n);
          }}
        ></input>
        <span>*10%</span>
        <button
          onClick={() => {
            handletest();
          }}
        >
          Test Board
        </button>
        <div className="message">Notes: {notes}</div>
      </div>
    </div>
  );
};

export default Sudoku;
