/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ScoreBoard from "./component/ScoreBoard";

const width = 8;
const blank = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/blank.png?raw=true';
const blueCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/blue-candy.png?raw=true';
const greenCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/green-candy.png?raw=true';
const orangeCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/orange-candy.png?raw=true';
const purpleCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/purple-candy.png?raw=true';
const redCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/red-candy.png?raw=true';
const yellowCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/yellow-candy.png?raw=true';
const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy];

const RandomColor = () => {
  let randomColor = Math.floor(Math.random() * candyColors.length);
  return candyColors[randomColor];
}

const App = () => {
  const [colorMatrix, setColorMatrix] = useState([]);
  const [candyBeingDragged, setCandyBeingDragged] = useState(null);
  const [candyBeingReplaced, setCandyBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  // Columns
  const checkForColumnOfFour = () => {
    // check all cells except for last 3 rows
    let totalCells = width * width - 3 * width;
    for (let cellIdx = 0; cellIdx < totalCells; cellIdx++) {
      const columnOfFour = [cellIdx, cellIdx + width, cellIdx + 2 * width, cellIdx + 3 * width];
      const decidedColor = colorMatrix[cellIdx];
      const isBlank = colorMatrix[cellIdx] === blank;

      if (columnOfFour.every(cell => colorMatrix[cell] === decidedColor) && !isBlank) {
        setScoreDisplay(score => score + 4);
        columnOfFour.forEach(cell => colorMatrix[cell] = blank);
        return true;
      }
    }
  }

  const checkForColumnOfThree = () => {
    // check all cells except for last 2 rows
    let totalCells = width * width - 2 * width;
    for (let cellIdx = 0; cellIdx < totalCells; cellIdx++) {
      const columnOfThree = [cellIdx, cellIdx + width, cellIdx + 2 * width];
      const decidedColor = colorMatrix[cellIdx];
      const isBlank = colorMatrix[cellIdx] === blank;

      if (columnOfThree.every(cell => colorMatrix[cell] === decidedColor) && !isBlank) {
        setScoreDisplay(score => score + 3);
        columnOfThree.forEach(cell => colorMatrix[cell] = blank);
        return true;
      }
    }
  }

  // Rows
  const checkForRowOfFour = () => {
    // check all cells except for last 3 columns
    for (let rowIdx = 0; rowIdx < width; rowIdx++) {
      for (let colIdx = 0; colIdx < width - 3; colIdx++) {
        const cellIdx = rowIdx * width + colIdx;
        const rowOfFour = [cellIdx, cellIdx + 1, cellIdx + 2, cellIdx + 3];
        const decidedColor = colorMatrix[cellIdx];
        const isBlank = colorMatrix[cellIdx] === blank;

        if (rowOfFour.every(cell => colorMatrix[cell] === decidedColor) && !isBlank) {
          setScoreDisplay(score => score + 4);
          rowOfFour.forEach(cell => colorMatrix[cell] = blank);
          return true;
        }
      }
    }
  }

  const checkForRowOfThree = () => {
    // check all cells except for last 2 columns
    for (let rowIdx = 0; rowIdx < width; rowIdx++) {
      for (let colIdx = 0; colIdx < width - 2; colIdx++) {
        const cellIdx = rowIdx * width + colIdx;
        const rowOfThree = [cellIdx, cellIdx + 1, cellIdx + 2];
        const decidedColor = colorMatrix[cellIdx];
        const isBlank = colorMatrix[cellIdx] === blank;

        if (rowOfThree.every(cell => colorMatrix[cell] === decidedColor) && !isBlank) {
          setScoreDisplay(score => score + 3);
          rowOfThree.forEach(cell => colorMatrix[cell] = blank);
          return true;
        }
      }
    }
  }

  const MoveIntoSquareBelow = () => {
    // move the square into the square below. Check for all row except the last row
    const totalCells = width * width - width;

    for (let cellIdx = 0; cellIdx < totalCells; cellIdx++) {
      const isFirstRow = cellIdx < width;

      if (isFirstRow && colorMatrix[cellIdx] === blank) {
        colorMatrix[cellIdx] = RandomColor();
      }

      if (colorMatrix[cellIdx + width] === blank) {
        colorMatrix[cellIdx + width] = colorMatrix[cellIdx];
        colorMatrix[cellIdx] = blank;
      }
    }
  }

  const handleDragStart = (event) => {
    setCandyBeingDragged(event.target);
  }

  const handleDragEnd = () => {
    const candyBeingReplacedIdx = parseInt(candyBeingReplaced.getAttribute('data-id'));
    const candyBeingDraggedIdx = parseInt(candyBeingDragged.getAttribute('data-id'));

    const validMoves = [
      candyBeingDraggedIdx - 1,       // left
      candyBeingDraggedIdx + 1,       // right
      candyBeingDraggedIdx - width,   // up
      candyBeingDraggedIdx + width    // down
    ];

    // return invalid moves
    if (!validMoves.includes(candyBeingReplacedIdx)) return;

    // swap the two candies
    colorMatrix[candyBeingReplacedIdx] = candyBeingDragged.getAttribute('src');
    colorMatrix[candyBeingDraggedIdx] = candyBeingReplaced.getAttribute('src');

    // check for match
    const isAColumnOfFour = checkForColumnOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree) {
      setCandyBeingDragged(null);
      setCandyBeingReplaced(null);
    } else {
      // revert the swap
      colorMatrix[candyBeingReplacedIdx] = candyBeingReplaced.getAttribute('src');
      colorMatrix[candyBeingDraggedIdx] = candyBeingDragged.getAttribute('src');

      setColorMatrix([...colorMatrix]);
    }
  }

  const handleDrop = (event) => {
    setCandyBeingReplaced(event.target)
  }

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let boardIdx = 0; boardIdx < width * width; boardIdx++) {
      randomColorArrangement.push(RandomColor());
    }

    setColorMatrix(randomColorArrangement);
  }

  useEffect(() => { createBoard(); }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();

      MoveIntoSquareBelow();

      setColorMatrix([...colorMatrix]);
    }, 50);

    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    MoveIntoSquareBelow,
    colorMatrix
  ]);

  return (
    <div className="app">
      <div className="game">
        {
          colorMatrix.map((candyColor, idx) => {
            return (
              <img
                key={idx}
                alt={candyColor}
                src={candyColor}
                data-id={idx}
                draggable={true}
                onDragStart={handleDragStart}
                onDragOver={e => e.preventDefault()}
                onDragEnter={e => e.preventDefault()}
                onDragLeave={e => e.preventDefault()}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              />
              // <span key={idx}>
              //   <p>{idx}</p>
              // </span>
            );
          })
        }
      </div>

      <ScoreBoard score={scoreDisplay} />
    </div>
  );
}

export default App;
