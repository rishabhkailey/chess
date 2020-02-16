// white above
// black down

const bishop = (block,Board) => {
    let possibleMoves = []
    let attack = []
    let {r,c} = block
    if(block.white) {
        if(r+1<8 && !Board[r+1][c].piece) {
            possibleMoves.push({r: r+1, c})
            // inside if because if first move not possible then 2nd also (cannot jump)
            if(r+2<8 && block.firstMove && !Board[r+2][c].piece) {
                possibleMoves.push({r: r+2, c})
            }
        }
        // if opponent piece is present diagonaly
        if(r+1 < 8 && c+1 < 8 && Board[r+1][c+1].piece && !Board[r+1][c+1].piece.white) {
            attack.push({r: r+1,c: c+1})
        }
        if(r+1 < 8 && c-1 >= 0 && Board[r+1][c-1].piece && !Board[r+1][c-1].piece.white) {
            attack.push({r: r+1, c: c-1})
        }
    }
    else {
        if(r-1 >= 0 && !Board[r-1][c].piece){
            possibleMoves.push({r: r-1, c})
            if(r-2 >= 0 && block.firstMove && !Board[r-2][c].piece) {
                possibleMoves.push({r: r-2, c})
            }
        }
        if(r-1 >= 0 && c+1 < 8 && Board[r-1][c+1].piece && Board[r-1][c+1].piece.white) {
            attack.push({r: r-1,c: c+1})
        }
        if(r-1 >= 0 && c-1 >= 0 && Board[r-1][c-1].piece && Board[r-1][c-1].piece.white) {
            attack.push({r: r-1,c: c-1})
        }
    }
    return {possibleMoves , attack}
}

const getValidMoves = (block,Board) => {

    switch(block.pieceName) {
        case 'Bishops':
            //no need of break we are returning the value here
            return bishop(block,Board);
        default:
            return []
    }
}

export default getValidMoves
