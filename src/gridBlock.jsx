import React from 'react'
import './SnakeGame.css'

class GridBlock extends React.Component{

    render(){
        return (
            
           <div
            
          className = 'grid'
          style = {{
          width : this.props.width -this.props.blockWidth,
          height : this.props.height - this.props.blockHeight,
          top : this.props.top ,
          left : this.props.left ,
          border: `${8} solid rgb(255, 255, 255, .5)`
          }}
          />
          
        )
    }
}

export default GridBlock