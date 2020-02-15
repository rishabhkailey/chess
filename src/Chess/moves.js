// white above
// black down

const bishop = (block) => {
    let moves = []
    let {r,c} = block
    if(block.white) {
        moves.push({r: r+1, c})
        if(block.firstMove) {
            moves.push({r: r+2, c})
        }
    }
    else {
        moves.push({r: r-1, c})
        if(block.firstMove) {
            moves.push({r: r-2, c})
        }
    }
    return moves
}

const getValidMoves = (block) => {

    switch(block.pieceName) {
        case 'Bishops':
            return bishop(block);
            break;;
        default:
            return []
    }
}

export default getValidMoves
