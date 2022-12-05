import React from 'react'

function generateGrid(rows, columns, mapper) {
    return Array(rows)
        .fill()
        .map(() =>
            Array(columns)
                .fill()
                .map(mapper)
        )
}

function Grid({ grid, handleClick }) {
    return (
        <>
            <div style={{ display: 'inline-block' }}>
                <div
                    style={{

                        backgroundColor: '#000',
                        display: 'grid',
                        gridTemplateRows: `repeat(${grid.length}, 1fr)`,
                        gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
                        gridGap: 2,
                    }}
                >
                    {grid.map((row, rowIdx) =>
                        row.map((cell, colIdx) => (

                            <Cell handleClick={handleClick} row={rowIdx} col={colIdx} key={`${colIdx}-${rowIdx}`} cell={cell} />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

const cellStyle = {
    backgroundColor: '#fff',
    height: 75,
    width: 75,
    fontSize: "3em",
    textAlign: "center"
}

function Cell({ cell, handleClick, row, col }) {
    return <div id='cell' className='items-center' onClick={(e) => handleClick(e, row, col)} style={cellStyle}>{cell}</div>
}

const newTicTacToeGrid = () => generateGrid(3, 3, () => null)
// Simple way to deeply clone an array or object 
//this is technique to deep cloning the object of object with unknow depth without
const clone = x => JSON.parse(JSON.stringify(x))

// An enum for the next turn in our game
const NEXT_TURN = {
    O: 'X',
    X: 'O',
}

const getInitialState = () => ({
    grid: newTicTacToeGrid(),
    status: "running",
    turn: 'X',
})

//nice way to use reduce
const flatten = array => array.reduce((acc, cur) => {
    console.log({acc,cur})
    return [...acc, ...cur]}, [])

function checkForWin(flatGrid) {

    const [nw, n, ne, w, c, e, sw, s, se] = flatGrid

    return (
        checkThree(nw, n, ne) ||
        checkThree(w, c, e) ||
        checkThree(sw, s, se) ||
        checkThree(nw, w, sw) ||
        checkThree(n, c, s) ||
        checkThree(ne, e, se) ||
        checkThree(nw, c, se) ||
        checkThree(ne, c, sw)
    )
}

const reducer = (state, action) => {
    // console.log({ state, action })
    switch (action.type) {
        case 'RESET': {
            return getInitialState()
        }
        case 'CLICK': {
            const { x, y } = action.payload
            const nextState = clone(state)
            const { grid, turn } = nextState

            if (grid[x][y]) {
                return state
            }

            grid[x][y] = turn
            const flatGrid = flatten(grid)
            
            console.log(flatGrid)
            if (checkForWin(flatGrid)) {
                nextState.status = "success"
                return nextState
            }

            nextState.turn = NEXT_TURN[turn]


            return nextState
        }

        default:
            return state
    }
}
const checkThree = (a, b, c) => {
    if (!a || !b || !c) return false
    return a === b && b === c
}



const GAME_STATUS_TEXT = {
    running: () => null,
    success: turn => `${turn} won!`,
}

function Game() {

    const [state, dispatch] = React.useReducer(reducer, getInitialState())

    const { grid, turn, status } = state
    // console.log({ turn, status })
    const handleClick = (e, x, y) => {
        dispatch({ type: 'CLICK', payload: { x, y } })
    }
    const handleBtnClick = () => {
        dispatch({ type: "RESET" })
    }
    return (<>

        <div className="flex flex-col items-center justify-center">
            <div className='flex items-center mb-12'>
                <div>Next turn: {turn}</div>
                <div className='ml-4'>{GAME_STATUS_TEXT[status](turn)}</div>
                <div className='p-4'>
                    <button onClick={handleBtnClick} className='bg-blue-300 px-4 py-2 rounded-md border border-blue-900 hover:opacity-75'>reset</button></div>
            </div>
            <Grid grid={grid} handleClick={handleClick} />
        </div>
    </>)

}


export default Game