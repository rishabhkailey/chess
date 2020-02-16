import React,{Component} from 'react'
import './chess.css'
import getValidMoves from './moves'

class Chess extends Component {
    constructor(props) {
        super(props)
        this.state = {
            white : {

            },
            black : {

            },
            Board : [],
            possibleMoves: [],
            attack: []
        }
    }
    componentDidMount() {
        let white = {}
        let black = {}
        let whitepawn = []
        let blackpawn = []

        for(let i=0 ; i<8 ; i++) {
            whitepawn.push({r: 1 , c: i, firstMove: true, move: 'down'})
            blackpawn.push({r: 6, c: 7-i ,firstMove: true, move: 'up'})
        }
        black.pawn = blackpawn
        white.pawn = whitepawn
        
        black.rook = [{r: 7, c: 0, firstMove: true},{r: 7, c: 7, firstMove: true}]
        white.rook = [{r: 0, c: 0, firstMove: true},{r: 0, c: 7, firstMove: true}]

        black.knight = [{r: 7, c: 1, firstMove: true},{r: 7, c: 6, firstMove: true}]
        white.knight = [{r: 0, c: 1, firstMove: true},{r: 0, c: 6, firstMove: true}]

        black.bishop = [{r: 7, c: 2, firstMove: true},{r: 7, c: 5, firstMove: true}]
        white.bishop = [{r: 0, c: 2, firstMove: true},{r: 0, c: 5, firstMove: true}]

        black.queen = [{r: 7, c: 3, firstMove: true}]
        white.queen = [{r: 0, c: 3, firstMove: true}]

        black.king = [{r: 7, c: 4, firstMove: true}]
        white.king = [{r: 0, c: 4, firstMove: true}]

        

        let color = true // white , black = false
        let Board = []
        for(let i=0 ; i<8 ; i++) {
            let c = color
            let row = []

            for(let j=0 ; j<8 ; j++) {    
                row.push({r: i, c: j, color: c})
                c = !c
            }
            
            color = !color
            Board.push(row)
        }

        this.setState({Board,white,black})
    }
    
    move(piece,newBoard) {
        console.log(piece)
        let moves = getValidMoves(piece,newBoard)
        this.setState({selected: piece, possibleMoves: moves.possibleMoves, attack: moves.attack})
    }

    changePosition(r,c) {
        let {selected} = this.state
        // here selected = piece (object reference) so we change selected {r,c} it will change the value of piece inside white , black (but will not rerender so we need to do this.setState but do not change the reference of selected)
        selected.r = r
        selected.c = c
        selected.firstMove = false
        console.log('rerender called')
        this.setState({selected, possibleMoves: [], attack: []})
    }
    eliminate(block) {
        //eliminate block and change position of select to this block
        
        let {white,black,selected} =  this.state

        if(block.piece.white) {
            let piece = block.piece
            let index = -1
            white[piece.pieceName].forEach((pos,currIndex) => {
                if(!pos)
                    return
                let {r,c} = pos
                if(r === piece.r && c === piece.c) {
                    index = currIndex
                    return
                }
            })
            // selected = reference of piece so it is changing the original object
            selected.r = piece.r
            selected.c = piece.c
            // after delete arr will still have that index but it will be undefined 
            delete white[piece.pieceName][index]
            white[piece.pieceName][index] = null
        }
        else {
            let piece = block.piece
            let index = -1
            console.log(piece.pieceName,black[piece.pieceName])
            black[piece.pieceName].forEach((pos,currIndex) => {
                if(!pos)
                    return
                let {r,c} = pos
                if(r === piece.r && c === piece.c) {
                    index = currIndex
                    return
                }
            })
            // selected = reference of piece so it is changing the original object
            selected.r = piece.r
            selected.c = piece.c
            // after delete arr will still have that index but it will be undefined 
            delete black[piece.pieceName][index]
            black[piece.pieceName][index] = null
        }
        this.setState({white, black, selected: null, possibleMoves: [], attack: []})
    }
    render() {
        console.log('rerendered')
        let {Board,white,black,possibleMoves,attack} = this.state
        
        // we can not change object in our state as it will effect its value even without setState as reference of object inside object will be same e.g white.pawns = null it will change this.state.pawns as both .pawns refer to same memory
        // it is also send as an argument to move fxn (to check attacks (positoin of opponents piece is required))
        let newBoard = []

        Board.forEach((row) => {
            let newRow = []
            row.forEach((pos) => {
                let {r,c,color} = pos
                newRow.push({r,c,color})
            })
            newBoard.push(newRow)
        })
        for(let piece in white) {
            console.log(piece,white[piece])
            white[piece].forEach((pos) => {
                if(!pos)
                    return
                let {r,c} = pos
                pos.pieceName = piece
                pos.player = 'white'
                pos.white = true
                newBoard[r][c].piece = pos
            })
        }
        for(let piece in black) {
            black[piece].forEach((pos) => {
                if(!pos) 
                    return
                let {r,c} = pos
                pos.pieceName = piece
                pos.player = 'black'
                pos.white = false
                newBoard[r][c].piece = pos
            })
        }

        possibleMoves.forEach((pos) => {
            let {r,c} = pos
            newBoard[r][c].highlight = true
        })

        attack.forEach((pos) => {
            let {r,c} = pos
            newBoard[r][c].attack = true
        })

        let display = newBoard.map((row,index1) => {
            let displayRow = row.map((block,index2) => {
                let color = 'black'
                if(block.color) {
                    color = 'white'
                }
                let piece =  null
                let onClick = null
                if(block.piece && block.piece.player  && block.piece.pieceName) {
                    piece = <img src={'/images/'+block.piece.player+"_"+block.piece.pieceName+'.png'} className = 'piece'></img>
                    onClick = () => this.move(block.piece,newBoard)
                }

                if(block.highlight) {
                    return <div className='block highlight' onClick={()=>{this.changePosition(index1,index2)}} key={index1*8+index2} style={{backgroundColor: color}}></div>
                }
                else if(block.attack) {
                    return <div className='block attack' key={index1*8+index2} onClick={()=> {this.eliminate(block)}} style={{backgroundColor: color}}>{piece}</div>
                }
                else
                    return <div className='block' key={index1*8+index2} onClick={onClick} style={{backgroundColor: color}}>{piece}</div>
            })
            return <div key={index1} className = 'row'>{displayRow}</div>
        })
    return <div style={{margin: 'auto'}}>
        {display}
    </div>
    }
}
export default Chess