/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

const width = 8;
const blank = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/blank.png?raw=true';
const blueCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/blue-candy.png?raw=true';
const greenCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/green-candy.png?raw=true';
const orangeCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/orange-candy.png?raw=true';
const purpleCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/purple-candy.png?raw=true';
const redCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/red-candy.png?raw=true';
const yellowCandy = 'https://github.com/kubowania/candy-crush-reactjs/blob/main/src/images/yellow-candy.png?raw=true';
const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  // Columns
  const checkForColumnOfFour = () => {
    for (let cellIdx = 0; cellIdx <= 39; cellIdx++) {
      const columnOfFour = [cellIdx, cellIdx + width, cellIdx + 2 * width, cellIdx + 3 * width];
      const decidedColor = currentColorArrangement[cellIdx];

      if (columnOfFour.every(cell => currentColorArrangement[cell] === decidedColor)) {
        columnOfFour.forEach(cell => currentColorArrangement[cell] = blank);
        return true;
      }
    }
  }

  const checkForColumnOfThree = () => {
    for (let cellIdx = 0; cellIdx <= 47; cellIdx++) {
      const columnOfThree = [cellIdx, cellIdx + width, cellIdx + 2 * width];
      const decidedColor = currentColorArrangement[cellIdx];

      if (columnOfThree.every(cell => currentColorArrangement[cell] === decidedColor)) {
        columnOfThree.forEach(cell => currentColorArrangement[cell] = blank);
        return true;
      }
    }
  }

  // Rows
  const checkForRowOfFour = () => {
    for (let cellIdx = 0; cellIdx < 64; cellIdx++) {
      const rowOfFour = [cellIdx, cellIdx + 1, cellIdx + 2, cellIdx + 3];
      const decidedColor = currentColorArrangement[cellIdx];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63];

      if (notValid.includes(cellIdx)) continue;

      if (rowOfFour.every(cell => currentColorArrangement[cell] === decidedColor)) {
        rowOfFour.forEach(cell => currentColorArrangement[cell] = blank);
        return true;
      }
    }
  }

  const checkForRowOfThree = () => {
    for (let cellIdx = 0; cellIdx < 64; cellIdx++) {
      const rowOfThree = [cellIdx, cellIdx + 1, cellIdx + 2];
      const decidedColor = currentColorArrangement[cellIdx];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

      if (notValid.includes(cellIdx)) continue;

      if (rowOfThree.every(cell => currentColorArrangement[cell] === decidedColor)) {
        rowOfThree.forEach(cell => currentColorArrangement[cell] = blank);
        return true;
      }
    }
  }

  const MoveIntoSquareBelow = () => {
    for (let cellIdx = 0; cellIdx < 55; cellIdx++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(cellIdx);

      if (isFirstRow && currentColorArrangement[cellIdx] === blank) {
        let randomColor = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[cellIdx] = candyColors[randomColor];
      }

      if (currentColorArrangement[cellIdx + width] === blank) {
        currentColorArrangement[cellIdx + width] = currentColorArrangement[cellIdx];
        currentColorArrangement[cellIdx] = blank;
      }
    }
  }

  const handleDragStart = (event) => {
    setSquareBeingDragged(event.target);
  }

  const handleDragEnd = () => {
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if (squareBeingReplacedId && validMove && (isARowOfThree || isARowOfFour || isAColumnOfThree || isAColumnOfFour)) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');

      setCurrentColorArrangement([...currentColorArrangement]);
    }
  }

  const handleDrop = (event) => {
    setSquareBeingReplaced(event.target)
  }

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let boardIdx = 0; boardIdx < width * width; boardIdx++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }

    setCurrentColorArrangement(randomColorArrangement);
  }

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();

      MoveIntoSquareBelow();

      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);

    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    MoveIntoSquareBelow,
    currentColorArrangement
  ]);

  return (
    <div className="app">
      <div className="game">
        {
          currentColorArrangement.map((candyColor, idx) => {
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
            );
          })
        }
      </div>
    </div>
  );
}

export default App;
