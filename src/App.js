import { useEffect, useState } from "react";

const width = 8;
const candyColors = [
  'blue',
  'red',
  'green',
  'yellow',
  'orange',
  'purple'
];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);

  // Columns
  const checkForColumnOfFour = () => {
    for (let cellIdx = 0; cellIdx < 39; cellIdx++) {
      const columnOfFour = [cellIdx, cellIdx + width, cellIdx + 2 * width, cellIdx + 3 * width];
      const decidedColor = currentColorArrangement[cellIdx];

      if (columnOfFour.every(cell => currentColorArrangement[cell] === decidedColor)) {
        columnOfFour.forEach(cell => currentColorArrangement[cell] = 'black');
      }
    }
  }

  const checkForColumnOfThree = () => {
    for (let cellIdx = 0; cellIdx < 47; cellIdx++) {
      const columnOfThree = [cellIdx, cellIdx + width, cellIdx + 2 * width];
      const decidedColor = currentColorArrangement[cellIdx];

      if (columnOfThree.every(cell => currentColorArrangement[cell] === decidedColor)) {
        columnOfThree.forEach(cell => currentColorArrangement[cell] = 'black');
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
        rowOfFour.forEach(cell => currentColorArrangement[cell] = 'black');
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
        rowOfThree.forEach(cell => currentColorArrangement[cell] = 'black');
      }
    }
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

      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);

    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
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
                alt={`${candyColor}-${idx}`}
                style={{ backgroundColor: candyColor }}
              />
            );
          })
        }
      </div>
    </div>
  );
}

export default App;
