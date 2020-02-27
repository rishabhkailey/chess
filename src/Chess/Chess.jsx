import React,{Component} from 'react'
import './chess.css'
import getValidMoves from './moves'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndo , faRedo } from '@fortawesome/free-solid-svg-icons'

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
            attack: [],
            activePlayer: false,// flase for black and true for white
            redoStack: [],
            undoStack: []
        }
        this.undo = this.undo.bind(this)
        this.redo = this.redo.bind(this)
    }
    
    
    redo() {
        let {undoStack , redoStack , activePlayer} = this.state
        if(redoStack.length === 0) {
            return
        }
        let topIndex = redoStack.length - 1
        let {piece , old_pos} = redoStack[topIndex]
        
        // saving old values for undo stack
        let r1 = piece.r , c1 = piece.c , old_first_move1 = piece.old_first_move

        // we are changing in the original reference (so changes will be reflected in the game) 
        piece.r = old_pos.r;
        piece.c = old_pos.c;
        piece.firstMove = old_pos.old_first_move

        redoStack.splice(topIndex,1)
        undoStack.push({piece , old_pos: {r: r1 , c: c1}})

        this.setState({undoStack , redoStack , activePlayer: !activePlayer , possibleMoves: [], attack: [] , selected: null})
    }


    undo() {
        let {undoStack , redoStack , activePlayer} = this.state
        if(undoStack.length === 0) {
            return
        }
        let topIndex = undoStack.length - 1
        let {piece , old_pos , old_first_move} = undoStack[topIndex]
        
        // saving the old values for redo stack
        let r1 = piece.r , c1 = piece.c , old_first_move1 = piece.old_first_move

        // we are changing in the original reference (so changes will be reflected in the game) 
        piece.r = old_pos.r;
        piece.c = old_pos.c;
        piece.firstMove = old_first_move

        undoStack.splice(topIndex,1)
        redoStack.push({piece , old_pos: {r: r1 , c: c1} , old_first_move: old_first_move1})

        this.setState({undoStack , redoStack , activePlayer: !activePlayer , possibleMoves: [], attack: [] , selected: null})
    }


    initialiseGame() {
        let white = {}
        let black = {}
        let whitepawn = []
        let blackpawn = []

        for(let i=0 ; i<8 ; i++) {
            whitepawn.push({r: 1 , c: i, firstMove: true, isAlive: true, move: 'down'})
            blackpawn.push({r: 6, c: 7-i ,firstMove: true, isAlive: true, move: 'up'})
        }
        black.pawn = blackpawn
        white.pawn = whitepawn
        
        black.rook = [{r: 7, c: 0, firstMove: true, isAlive: true},{r: 7, c: 7, firstMove: true, isAlive: true}]
        white.rook = [{r: 0, c: 0, firstMove: true, isAlive: true},{r: 0, c: 7, firstMove: true, isAlive: true}]

        black.knight = [{r: 7, c: 1, firstMove: true, isAlive: true},{r: 7, c: 6, firstMove: true, isAlive: true}]
        white.knight = [{r: 0, c: 1, firstMove: true, isAlive: true},{r: 0, c: 6, firstMove: true, isAlive: true}]

        black.bishop = [{r: 7, c: 2, firstMove: true, isAlive: true},{r: 7, c: 5, firstMove: true, isAlive: true}]
        white.bishop = [{r: 0, c: 2, firstMove: true, isAlive: true},{r: 0, c: 5, firstMove: true, isAlive: true}]

        black.queen = [{r: 7, c: 3, firstMove: true, isAlive: true}]
        white.queen = [{r: 0, c: 3, firstMove: true, isAlive: true}]

        black.king = [{r: 7, c: 4, firstMove: true, isAlive: true}]
        white.king = [{r: 0, c: 4, firstMove: true, isAlive: true}]

        

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

        this.setState({Board,white,black,possibleMoves: [],attack: []})
    }
    componentDidMount() {
        this.initialiseGame()
    }
    
    gameover(winner) {
        if(winner) {
            alert('white won')
        }
        else {
            alert('black won')
        }
        this.initialiseGame()
    }

    move(piece,newBoard) {
        ////console.log(piece)
        // we will not show the moves of non active player 
        if(piece.white !== this.state.activePlayer)
            return
        let moves = getValidMoves(piece,newBoard)
        this.setState({selected: piece, possibleMoves: moves.possibleMoves, attack: moves.attack})
    }

    changePosition(r,c) {
        let {selected,activePlayer,undoStack} = this.state
        // here selected = piece (object reference) so we change selected {r,c} it will change the value of piece inside white , black (but will not rerender so we need to do this.setState but do not change the reference of selected)
        
        // use piece to get info like curr position
        let stackElement = {piece: selected , old_pos: {r: selected.r , c: selected.c} , old_first_move: selected.firstMove}
        undoStack.push(stackElement)

        selected.r = r
        selected.c = c
        selected.firstMove = false
        ////console.log('rerender called')
        this.setState({selected, possibleMoves: [], attack: [],activePlayer: !activePlayer,undoStack})
    }

    eliminate(block) {
        let {white,black,selected,activePlayer} =  this.state

        // block , selected are refrences of original object, so changes will be reflected in the game
        block.piece.isAlive = false
        let {r,c} = block.piece
        selected.r = r
        selected.c = c

        if(block.piece.pieceName === 'king') {
            this.gameover(!block.piece.white)
        } 
        else
            this.setState({white, black, selected: null, activePlayer: !activePlayer, possibleMoves: [], attack: []})
    
    }
    render() {
        //console.log('rerendered')
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
            //console.log(piece,white[piece])
            white[piece].forEach((pos) => {
                if(!pos.isAlive)
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
                if(!pos.isAlive) 
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

        let empty = <div className='piece'></div>

        let display = newBoard.map((row,index1) => {
            let displayRow = row.map((block,index2) => {
                let color = 'black'
                if(block.color) {
                    color = 'white'
                }
                let piece =  empty
                let onClick = null
                if(block.piece && block.piece.player  && block.piece.pieceName) {
                    piece = <img src={'/images/'+block.piece.player+"_"+block.piece.pieceName+'.png'} className = 'piece'></img>
                    onClick = () => this.move(block.piece,newBoard)
                }

                if(block.highlight) {
                    return <div className='block highlight' onClick={()=>{this.changePosition(index1,index2)}} key={index1*8+index2} style={{backgroundColor: color}}>
                        {empty}
                    </div>
                }
                else if(block.attack) {
                    return <div className='block attack' key={index1*8+index2} onClick={()=> {this.eliminate(block)}} style={{backgroundColor: color}}>{piece}</div>
                }
                else
                    return <div className='block' key={index1*8+index2} onClick={onClick} style={{backgroundColor: color}}>{piece}</div>
            })
            return <div key={index1} className = 'row'>{displayRow}</div>
        })
    return <div className = 'outside-container'>
        {display}
        <div className='row'>
            <button className = 'button' onClick={this.undo}><FontAwesomeIcon icon={faUndo} / ></button>
            <button className = 'button' onClick={this.redo}><FontAwesomeIcon icon={faRedo} / ></button>
        </div>
    </div>
    }

}
export default Chess