import { useState } from "react";

const MainBoard = () => {

  const TURNS = { x: "x", o: "o",};
  const [board, setBoard] = useState (() => {
    const boardFromStorage = window.localStorage.getItem("board")
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState (() => {
    const turnFromStorage = window.localStorage.getItem("turn")
    return turnFromStorage ?? TURNS.x
  })

  const [winner, setWinner] = useState(null)
  const winnerCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ]
  const checkWinner = (boardToCheck) => {
    for(const combo of winnerCombos) {
      const [a,b,c] = combo
      if(boardToCheck[a] && boardToCheck[a] === boardToCheck[b] && boardToCheck[a] === boardToCheck[c])
      {
        return boardToCheck[a]
      }
    }
    return null
  }

  
  const updateBoard = (index) => {
    const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x
    if(board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard, newTurn)
    window.localStorage.setItem("board", JSON.stringify(newBoard))
    window.localStorage.setItem("turn", newTurn)
    const newWinner = checkWinner(newBoard)
    if(newWinner){
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
    setTurn(newTurn)}
    
    const resetGame = () => {
      setBoard(Array(9).fill(null));
      setTurn(TURNS.x)
      setWinner(null)

      window.localStorage.removeItem("board")
      window.localStorage.removeItem("turn")
    }

        
    const checkEndGame = (newBoard) => {
      return newBoard.every((square) =>  square != null)
    }
    
    const Square = ({ children, isSelected, updateBoard, index }) => {
      const className = `square ${isSelected ? "is-selected" : ""}`;
      const handleCLick = () => {
        updateBoard(index)
      }
      return <div className={className} onClick={handleCLick}>{children}</div>;
    };
    
    return (
      <>
      <main className="board">
        <h1>Ta-Te-Ti</h1>
        <button onClick={resetGame}>Volver a empezar</button>
        <section className="game">
          {board.map((square, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {square}
              </Square>
            );
          })}
        </section>
        <section className="turn">
          <Square isSelected={turn === TURNS.x}>{TURNS.x}</Square>
          <Square isSelected={turn === TURNS.o}>{TURNS.o}</Square>
        </section>
          {winner != null && (
            <section className="winner">
              <div className="text">
                <h2>
                  {winner === false ? "Empate" : "Ganò"}
                </h2>

                <header className="win">
                  {winner && <Square>{winner}</Square>}
                </header>


                <footer>
                  <button onClick={resetGame}>Volver a jugar</button>
                </footer>
              </div>
        </section>
          )}
      </main>
    </>
  );
};

export default MainBoard;
