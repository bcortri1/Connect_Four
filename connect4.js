/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  for (let i = 0; i < HEIGHT; i++) {
    board.push(new Array(WIDTH).fill(null));
    //board.push(Array.from({ length: WIDTH }))
  }
};

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  //"htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');
  // Creates top table row element
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Creates top table data/cell elements ids of X
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Creates remaining rows and cells with y-x ids
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const piece = document.createElement("div");
  const targetCell = document.getElementById(`${y}-${x}`);
  piece.classList.add("piece");
  // if (currPlayer === 1) {
  //   piece.classList.add("p1");
  // }
  // else {
  //   piece.classList.add("p2");
  // };

  piece.classList.add(`p${currPlayer}`);
  targetCell.append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
  document.querySelector('#column-top').removeEventListener("click", handleClick);
  setTimeout(function(){alert(msg)},800);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (!y) {
    return;
  }

  // place piece in board and add to HTML table
  // Updates in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // Check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // Checks if the top row is full which would end in a Tie
  if (board[0].every((val) => val !== null)) {
    endGame("It's a TIE!");
  }

  // switch currPlayer 1 <-> 2
  // if (currPlayer === 1) {
  //   currPlayer = 2;
  // }
  // else {
  //   currPlayer = 1;
  // }

  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // Iterates through each dimension of the array getting horizontals, verticals, and diagonals. Will return true if valid win is found
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
