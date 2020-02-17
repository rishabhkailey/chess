// white above
// black down

const check = (r,c) => {
    if(r<8 && r>=0 && c<8 && c>=0) {
        return true
    }
    return false
}

const knight = (block,Board) => {
    let movement = [{r: 2, c: 1},{r: 2, c: -1},{r: 1, c: 2}, {r: 1 ,c: -2},{r: -2, c: 1},{r: -2, c: -1},{r: -1, c: 2}, {r: -1 ,c: -2}]
    let {r,c} = block
    let possibleMoves = []
    let attack = []
    
    movement.forEach((move) => {
        let r1,c1
        r1 = r + move.r
        c1 = c + move.c
        if(!check(r1,c1))
            return
        
        if(!Board[r1][c1].piece){
            possibleMoves.push({r: r1 ,c: c1})
        }
        else if(Board[r1][c1].piece.white !== block.white) {
            attack.push({r: r1, c: c1})
        }
    })
    return {possibleMoves,attack}
}

const rook = (block,Board) => {
    let possibleMoves = []
    let attack = []
    let {r,c} = block

    let moves = [{r: 1, c: 0} , {r: -1, c: 0} , {r: 0, c: 1} , {r: 0, c: -1}]
    moves.forEach((move) => {
        let r1 = r + move.r
        let c1 = c + move.c

        while(check(r1,c1)) {
            if(!Board[r1][c1].piece) {
                possibleMoves.push({r: r1, c: c1})
            }
            else {
                // opposite color
                if(Board[r1][c1].piece.white !== block.white) {
                    attack.push({r: r1, c: c1})
                }
                break;
            }
            r1 = r1 + move.r
            c1 = c1 + move.c
        }
    })
    return {possibleMoves , attack}
}

const bishop = (block,Board) => {
    let {r,c} = block
    let possibleMoves = []
    let attack = []
    
    let moves = [{r: 1, c: 1} , {r: 1, c: -1} , {r: -1, c: 1} , {r: -1, c: -1}]
    moves.forEach((move) => {
        let r1 = r + move.r
        let c1 = c + move.c

        while(check(r1,c1)) {
            if(!Board[r1][c1].piece) {
                possibleMoves.push({r: r1, c: c1})
            }
            else {
                // opposite color
                if(Board[r1][c1].piece.white !== block.white) {
                    attack.push({r: r1, c: c1})
                }
                break;
            }
            r1 = r1 + move.r
            c1 = c1 + move.c
        }
    })
    return {possibleMoves , attack}
}

const queen = (block,Board) => {
    let move1 = rook(block,Board)
    let move2 = bishop(block,Board)
    let possibleMoves = move1.possibleMoves
    let attack = move1.attack

    move2.possibleMoves.forEach((move)=>{
        possibleMoves.push(move)
    })

    move2.attack.forEach((atk) => {
        attack.push(atk)
    })
    return {possibleMoves , attack}
}

const king = (block,Board) => {
    let possibleMoves = []
    let attack = []
    let {r,c} = block

    let moves = [{r: 1, c: 0} , {r: 1, c: 1} , {r: 1, c: -1} ,{r: -1, c: 0} , {r: -1, c: 1} , {r: -1, c: -1} ,{r: 0, c: 0} , {r: 0, c: 1} , {r: 0, c: -1}]
    moves.forEach((move) => {
        let r1 = r + move.r
        let c1 = c + move.c

        if(!check(r1,c1))
            return
        
        if(!Board[r1][c1].piece)
            possibleMoves.push({r: r1, c: c1})
        else if(block.white !== Board[r1][c1].piece.white) {
            attack.push({r: r1, c: c1})
        }
    })

    return {possibleMoves , attack}
}

const getValidMoves = (block,Board) => {

    console.log(block.pieceName)
    switch(block.pieceName) {
        case 'pawn':
            //no need of break we are returning the value here
            return pawn(block,Board);
        case 'knight':
            return knight(block,Board);
        case 'rook':
            return rook(block,Board);
        case 'bishop':
            return bishop(block,Board);
        case 'queen':
            return queen(block,Board);
        case 'king':
            return king(block,Board);
        default:
            return []
    }
}


const pawn = (block,Board) => {
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

export default getValidMoves
