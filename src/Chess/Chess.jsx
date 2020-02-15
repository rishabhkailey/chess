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
            highlight: []
        }
    }
    componentDidMount() {
        let white = {}
        let black = {}
        let whiteBishops = []
        let blackBishops = []
        for(let i=0 ; i<8 ; i++) {
            whiteBishops.push({r: 1 , c: i, firstMove: true, move: 'down'})
            blackBishops.push({r: 6, c: 7-i ,firstMove: true, move: 'up'})
        }
        black.Bishops =blackBishops
        white.Bishops = whiteBishops
        
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
    
    move(piece) {
        console.log(piece)
        let moves = getValidMoves(piece)
        this.setState({selected: piece, highlight: moves})
    }

    changePosition(r,c) {
        let {selected} = this.state
        // here selected = piece (object reference) so we change selected {r,c} it will change the value of piece inside white , black (but will not rerender so we need to do this.setState but do not change the reference of selected)
        selected.r = r
        selected.c = c
        selected.firstMove = false
        this.setState({selected, highlight: []})
    }

    render() {

        let {Board,white,black,highlight} = this.state
        
        // we can not change object in our state as it will effect its value even without setState as reference of object inside object will be same e.g white.bishops = null it will change this.state.bishops as both .bishops refer to same memory
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
            white[piece].forEach((pos) => {
                let {r,c} = pos
                pos.pieceName = piece
                pos.player = 'white'
                pos.white = true
                newBoard[r][c].piece = pos
            })
        }
        for(let piece in black) {
            black[piece].forEach((pos) => {
                let {r,c} = pos
                pos.pieceName = piece
                pos.player = 'black'
                pos.white = false
                newBoard[r][c].piece = pos
            })
        }

        highlight.forEach((pos) => {
            let {r,c} = pos
            newBoard[r][c].highlight = true
        })

        let display = newBoard.map((row,index1) => {
            let displayRow = row.map((block,index2) => {
                let color = 'black'
                if(block.color) {
                    color = 'white'
                }
                let piece =  null
                if(block.piece && block.piece.player  && block.piece.pieceName) {
                    piece = <img src={block.piece.pieceName+"_"+block.piece.player+'.svg'} onClick={() => this.move(block.piece)} className = 'piece'></img>
                }
                if(block.highlight) {
                    return <div className='block highlight' onClick={()=>{this.changePosition(index1,index2)}} key={index1*8+index2} style={{backgroundColor: color}}></div>
                }
            return <div className='block' key={index1*8+index2} style={{backgroundColor: color}}>{piece}</div>
            })
            return <div key={index1} className = 'row'>{displayRow}</div>
        })
    return <div style={{margin: 'auto'}}>
        {display}
    </div>
    }
}
export default Chess