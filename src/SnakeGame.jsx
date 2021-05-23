import React from 'react'
import './SnakeGame.css'
import GameOver from './GameOver.jsx'
import SnakeGame1 from './NewAi.jsx'
import GridBlock from'./gridBlock.jsx'
const tweenState = require('react-tween-state')


//main
class App extends React.Component {
  
  render() {

    return (
      <div>
        <SnakeGame 
     
        />
  
      </div>
    )
  }
}

// var tween = React.createClass({
//   mixins: [tweenState.Mixin],
//   getInitialState: function() {
//     return {left: 0};
//   },
//   handleClick: function() {
//     this.tweenState('left', {
//       easing: tweenState.easingTypes.easeInOutQuad,
//       duration: 500,
//       endValue: this.state.left === 0 ? 400 : 0
//     });
//   },
//   render: function() {
//     var style = {
//       position: 'absolute',
//       width: 50,
//       height: 50,
//       backgroundColor: 'lightblue',
//       left: this.getTweeningValue('left')
//     };
//     return <div style={style} onClick={this.handleClick} />;
//   }
// });
class SnakeGame extends React.Component {
  constructor(props) {
    super(props)
    // this.handleKeyDownAi = this.handleKeyDownAi.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.colorSwap = this.colorSwap.bind(this)
    this.lockOn = this.lockOn.bind(this)
    this.state = {
      sidelength: 0,
      gridNum: 0,
      snakeGlobal: [],
      freeleft: true,
      freeright:true,
      freeup:true,
      freedown:true,
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      colors:[this.getRandomColor(),this.getRandomColor(),this.getRandomColor()],
      colorBody: [],
      index: 0,
      locked: false,
      width: 0,
      height: 0,
      blockWidth: 0,
      blockHeight: 0,
      gameLoopTimeout: 149,
      timeoutId: 0,
      startSnakeSize: 0,
      snake: [],
      snakeHead: [],
      apple: {},
      di: [],
      direction: 'right',
      directionChanged: false,
      isGameOver: false,
      snakeColor: this.props.appleColor || this.getRandomColor(),
      appleColor: this.props.appleColor || this.getRandomColor(),
      diColor: 'gray',
      score: 0,
      highScore: Number(localStorage.getItem('snakeHighScore')) || 0,
      newHighScore: false,
    }
  }

  componentDidMount() {

    this.initGame()
    window.addEventListener('keydown', this.colorSwap)
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keydown', this.lockOn)
    this.gameLoop()
  }
  // componentDidUpdate(prevProps, prevState){
  // if(prevState !== this.state) {
  //   this.handleKeyDownAi()
  //   return
  // }
  //   }

  initGame() {
    // Game size initialization
    let multi = 5
    let percentageWidth = this.props.percentageWidth || 50
    let width = Math.ceil(1200)
      // document.getElementById('GameBoard').parentElement.offsetWidth *
      
    width -= width % 30
    // if (width < 30) width = 30
    let height = ((width / 3)*2)
    let blockWidth = Math.ceil(((width / 30)/ multi))
    let blockHeight = Math.ceil(((height / 20)/ multi))
    let gridNum = 15
    // snake initialization
    let startSnakeSize = this.props.startSnakeSize || 2
    let snake = []
    let colorBody = []
    let Xpos = width / 2
    let Ypos = height / 2
    let snakeHead = { Xpos: Math.ceil(width / 2), Ypos: Math.ceil(height / 2) }
    let colorHead = this.state.colors[this.state.index]
    colorBody.push(colorHead)
    snake.push(snakeHead)
    for (let i = 1; i < startSnakeSize; i++) {
      Xpos -= blockWidth
      let snakePart = { Xpos: Xpos, Ypos: Ypos }
      let colorPart = this.state.colors[this.state.index]
      colorBody.push(colorPart)
      snake.push(snakePart)
    }

    
    // apple position initialization
    let appleXpos =
      Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
      blockWidth
    let appleYpos =
      Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
      blockHeight
    while (appleYpos === snake[0].Ypos) {
      appleYpos =
        Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight
    }

    function CalcSize (){
      var number = gridNum; // Example-Number
     
      var area = height * width;
      var elementArea = parseInt(area / number);
  
      // Calculate side length if there is no "spill":
      var sideLength = parseInt(Math.sqrt(elementArea));
  
      // We now need to fit the squares. Let's reduce the square size 
      // so an integer number fits the width.
      var numX = Math.ceil(width/sideLength);
      sideLength = width/numX;
      while (numX <= number) {
          // With a bit of luck, we are done.
          if (Math.floor(height/sideLength) * numX >= number) {
              // They all fit! We are done!
              return sideLength;
          }
          // They don't fit. Make room for one more square i each row.
          numX++;
          sideLength = width/numX;
      }
      // Still doesn't fit? The window must be very wide
      // and low.
      sideLength = height;
      return sideLength;
  }
const sideLength = CalcSize()
    this.setState({
      gridNum,
      sideLength,
      width,
      height,
      blockWidth,
      blockHeight,
      startSnakeSize,
      colorBody,
      snake,
      apple: { Xpos: appleXpos, Ypos: appleYpos },
    })
  }
 
  gameLoop() {
    let timeoutId = setTimeout(() => {
      if (!this.state.isGameOver) {
        this.moveSnake()
        let snakeHead = this.state.snake[0]
        this.tryToEatSnake()
        this.tryToEatApple()
        if(this.state.locked){
          this.handleKeyDown(16)
        }
        
        this.setState({ directionChanged: false, snakeHead })
      }

      this.gameLoop()
    }, this.state.gameLoopTimeout)

    this.setState({ timeoutId })
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId)
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  resetGame() {
    let width = this.state.width
    let height = this.state.height
    let blockWidth = this.state.blockWidth
    let blockHeight = this.state.blockHeight
    let apple = this.state.apple

    // snake reset
    let snake = []
    let Xpos = width / 2
    let Ypos = height / 2
    let snakeHead = { Xpos: width / 2, Ypos: height / 2 }
    snake.push(snakeHead)
    for (let i = 1; i < this.state.startSnakeSize; i++) {
      Xpos -= blockWidth
      let snakePart = { Xpos: Xpos, Ypos: Ypos }
      snake.push(snakePart)
    }

    // apple position reset
    apple.Xpos =
      Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
      blockWidth
    apple.Ypos =
      Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
      blockHeight
    while (this.isAppleOnSnake(apple.Xpos, apple.Ypos)) {
      apple.Xpos =
        Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
        blockWidth
      apple.Ypos =
        Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight
    }

    this.setState({
      snake,
      apple,
      direction: 'right',
      directionChanged: false,
      isGameOver: false,
      gameLoopTimeout: 50,
      snakeColor: this.getRandomColor(),
      appleColor: this.getRandomColor(),
      score: 0,
      newHighScore: false,
    })
  }

  getRandomColor() {
    let hexa = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) color += hexa[Math.ceil(Math.random() * 16)]
    return color
  }

  moveSnake() {
    let snakeGlobal = this.state.snake.slice()
 
    function getDivs(){  
      let divs = document.getElementsByClassName('aiBlock')
   
      var arr = Array.prototype.slice.call( divs )
      
      let divsArr = Object.keys(divs)
      let divsVals = Object.values(divs)
      let global = []
      // if(divs[0][width] !==undefined){
      // arr.forEach((el)=>{
        for(let i = 0; i < arr.length; i++){
        
        let xpos = (Number.parseInt(arr[i].style.cssText.split(';')[2].split(' ')[2]))
        let ypos = (Number.parseInt(arr[i].style.cssText.split(';')[3].split(' ')[2]))

        snakeGlobal.push({Xpos: xpos, Ypos: ypos})
        // if(i> 6 && global[0].Xpos === global[i].Xpos && global[0].Ypos === global[i].Ypos) return
        // if(el[style] !== undefined) snakeGlobal.push({Xpos: el[style][cssText], Ypos: el[height]})
      // }
      
      }

      // snakeGlobal= [...new Set(snakeGlobal)]
     
    }
    getDivs()
    let snake = this.state.snake
    let colorBody = this.state.colorBody
    let previousPartX = this.state.snake[0].Xpos
    let previousPartY = this.state.snake[0].Ypos
    let previousColor = this.state.colorBody[0]
    let tmpPartX = previousPartX
    let tmpPartY = previousPartY
    let tmpColor = previousColor
    this.moveHead()
    for (let i = 1; i < snake.length; i++) {
      tmpPartX = snake[i].Xpos
      tmpPartY = snake[i].Ypos
      tmpColor = colorBody[i]
      snake[i].Xpos = previousPartX
      snake[i].Ypos = previousPartY
      colorBody[i] = previousColor
      previousPartX = tmpPartX
      previousPartY = tmpPartY
      previousColor = tmpColor
    }

    this.setState({ snake, colorBody, snakeGlobal })
  }

  tryToEatApple() {
    let snake = this.state.snake
    let apple = this.state.apple
    let width = this.state.width
    let height = this.state.height
    let blockWidth = this.state.blockWidth
    let blockHeight = this.state.blockHeight
    let newTail = { Xpos: apple.Xpos, Ypos: apple.Ypos }
    let highScore = this.state.highScore
    let newHighScore = this.state.newHighScore
    let gameLoopTimeout = this.state.gameLoopTimeout

    // if the snake's head is on an apple
    if (snake[0].Xpos === apple.Xpos && snake[0].Ypos === apple.Ypos) {
     

      // increase snake size
      snake.push(newTail)
      
      this.colorSwap('force')
      // create another apple
      apple.Xpos =
        Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
        blockWidth
      apple.Ypos =
        Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight
      while (this.isAppleOnSnake(apple.Xpos, apple.Ypos)) {
        apple.Xpos =
          Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
          blockWidth
        apple.Ypos =
          Math.ceil(
            Math.random() * ((height - blockHeight) / blockHeight + 1)
          ) * blockHeight
      }

      // increment high score if needed
      if (this.state.score === highScore) {
        highScore++
        localStorage.setItem('snakeHighScore', highScore)
        newHighScore = true
      }

      // decrease the game loop timeout
      if (gameLoopTimeout > 25) gameLoopTimeout -= 0.5

      this.setState({
        snake,
        apple,
        score: this.state.score + 1,
        highScore,
        newHighScore,
        gameLoopTimeout,
      })
    }
  }

  tryToEatSnake() {
    let snake = this.state.snake.slice()
    let snakeGlobal = this.state.snakeGlobal.slice()
    let colorBody = this.state.colorBody
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].Xpos === snake[i].Xpos && snake[0].Ypos === snake[i].Ypos ){
      if(colorBody[0] === colorBody[i]){
        this.setState({ isGameOver: true })
      }
    }
      }
      // console.log(snakeGlobal, snake)
      for (let i = 1; i < snakeGlobal.length; i++) {
      if(this.state.length>6){
        if(snake[0].Xpos === snakeGlobal[i].Xpos && snake[0].Ypos === snakeGlobal[i].Ypos){
          this.setState({ isGameOver: true })
        }
    }}
  }

  isAppleOnSnake(appleXpos, appleYpos) {
    let snake = this.state.snakeGlobal
    for (let i = 0; i < snake.length; i++) {
      if (appleXpos === snake[i].Xpos && appleYpos === snake[i].Ypos)
        return true
    }
    return false
  }

  moveHead() {
    // let snapCount = React.Children.toArray(this.props.children).filter((item) => item.props.className === 'aiBlock').length;
    // console.log(this.state.snakeGlobal,React.Children)
    switch (this.state.direction) {
      case 'left':
        this.moveHeadLeft()
        break
      case 'up':
        this.moveHeadUp()
        break
      case 'right':
        this.moveHeadRight()
        break
      default:
        this.moveHeadDown()
    }
  }

  moveHeadLeft() {
    let {freeleft, freeup, freeright, freedown} = true;
    let width = this.state.width
    let blockWidth = this.state.blockWidth
    let snake = this.state.snake
    let colorBody = this.state.colorBody
    colorBody[0]=this.state.colors[this.state.index]
    colorBody.pop()
    snake[0].Xpos =
      snake[0].Xpos <= 0 ? width - blockWidth : snake[0].Xpos - blockWidth
      let leftC = {Xpos: snake[0]['Xpos']-blockWidth, Ypos: snake[0]['Ypos']}
      if(leftC.Xpos <= 0) leftC.Xpos = width-blockWidth;
      let rightC = {Xpos: snake[0]['Xpos']+blockWidth, Ypos: snake[0]['Ypos']}
      let upC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']-this.state.blockHeight}
      let downC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']+this.state.blockHeight}
      snake.forEach((el) => {
        if(el['Ypos'] === leftC['Ypos']&& el['Xpos']=== leftC['Xpos']){ 
          freeleft = false}
          if(el['Ypos'] === upC['Ypos']&& el['Xpos']=== upC['Xpos']){
            freeup = false}
                if(el['Ypos'] === downC['Ypos']&& el['Xpos']=== downC['Xpos']){ 
                freedown = false}
        })
      this.setState({ snake, colorBody , left:leftC, down: downC, up:upC,  freeleft: freeleft, freeup:freeup, freedown:freedown})
  }

  moveHeadUp() {
    let {freeleft, freeup, freeright, freedown} = true;
    let height = this.state.height
    let blockHeight = this.state.blockHeight
    let snake = this.state.snake
    let colorBody = this.state.colorBody
    colorBody[0]=this.state.colors[this.state.index]
    colorBody.pop()
    snake[0].Ypos =
      snake[0].Ypos <= 0 ? height - blockHeight : snake[0].Ypos - blockHeight
      let leftC = {Xpos: snake[0]['Xpos']-blockHeight, Ypos: snake[0]['Ypos']}
      let rightC = {Xpos: snake[0]['Xpos']+blockHeight, Ypos: snake[0]['Ypos']}
      let upC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']-this.state.blockHeight}
      if(upC.Ypos <= 0) leftC.Ypos = height - blockHeight;
      let downC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']+this.state.blockHeight}
      snake.forEach((el) => {
        if(el['Ypos'] === upC['Ypos']&& el['Xpos']=== upC['Xpos']){ 
          freeup = false}
        if(el['Ypos'] === rightC['Ypos']&& el['Xpos']=== rightC['Xpos']){ 
          freeright = false}
          if(el['Ypos'] === leftC['Ypos']&& el['Xpos']=== leftC['Xpos']){ 
            freeleft = false}
      
            if(el['Ypos'] === downC['Ypos']&& el['Xpos']=== downC['Xpos']){ 
            freedown = false}
      })
    this.setState({ snake, colorBodyup:upC, right:rightC, freeleft: freeleft, freeup:freeup, freeright:freeright })
  }

  moveHeadRight() {
    let {freeleft, freeup, freeright, freedown} = true;
    let width = this.state.width
    let blockWidth = this.state.blockWidth
    let snake = this.state.snake
    let colorBody = this.state.colorBody
    colorBody[0]=this.state.colors[this.state.index]
    colorBody.pop()
    snake[0].Xpos =
      snake[0].Xpos >= width - blockWidth ? 0 : snake[0].Xpos + blockWidth
      let leftC = {Xpos: snake[0]['Xpos']-blockWidth, Ypos: snake[0]['Ypos']}
      let rightC = {Xpos: snake[0]['Xpos']+blockWidth, Ypos: snake[0]['Ypos']}
      if(rightC.Xpos >= width - blockWidth) rightC.Xpos = 0;
      let upC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']-this.state.blockHeight}
      let downC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']+this.state.blockHeight}
      snake.forEach((el) => {
        if(el['Ypos'] === rightC['Ypos']&& el['Xpos']=== rightC['Xpos']){ 
          freeright = false}
        if(el['Ypos'] === upC['Ypos']&& el['Xpos']=== upC['Xpos'] ){ 
          freeup = false}
            if(el['Ypos'] === downC['Ypos']&& el['Xpos']=== downC['Xpos']){ 
            freedown = false}
        }
        )
      this.setState({ snake, colorBodyright:rightC, down:downC, freeup:freeup, freedown:freedown,freeright:freeright })
  }

  moveHeadDown() {
    let {freeleft, freeup, freeright, freedown} = true;
    let height = this.state.height
    let blockHeight = this.state.blockHeight
    let snake = this.state.snake
    let colorBody = this.state.colorBody
    colorBody[0]=this.state.colors[this.state.index]
    colorBody.pop()
    snake[0].Ypos =
      snake[0].Ypos >= height - blockHeight ? 0 : snake[0].Ypos + blockHeight
      let leftC = {Xpos: snake[0]['Xpos']-blockHeight, Ypos: snake[0]['Ypos']}
      let rightC = {Xpos: snake[0]['Xpos']+blockHeight, Ypos: snake[0]['Ypos']}
      let upC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']-this.state.blockHeight}
      let downC = {Xpos: snake[0]['Xpos'], Ypos: snake[0]['Ypos']+this.state.blockHeight}
      if(downC.Ypos >= height - blockHeight) downC.Ypos = 0;
      snake.forEach((el) => {
        if(el['Ypos'] === rightC['Ypos']&& el['Xpos']=== rightC['Xpos']){ 
          freeright = false}
        if(el['Ypos'] === upC['Ypos']&& el['Xpos']=== upC['Xpos']){ 
          freeup = false}
            if(el['Ypos'] === downC['Ypos']&& el['Xpos']=== downC['Xpos']){ 
            freedown = false}
            if(el['Ypos'] === leftC['Ypos']&& el['Xpos']=== leftC['Xpos']){ 
              freeleft = false}
        })
      this.setState({ snake, colorBodyup:upC, down:downC, freeleft: freeleft, freeup:freeup, freedown:freedown,freeright:freeright })
  }

  

  lockOn (event){
    if(event.keyCode === 16){
      if(this.state.locked  === false){
        this.setState({
          locked: true
        })
      }
      else {this.setState({locked: false})}
    }
  }

  colorSwap(event) {
    if(event.keyCode === 32 || event === 'force'){
        if(this.state.index > this.state.colors.length - 2) this.setState({index: 0})
        else this.setState({index : this.state.index + 1,
        snakeColor: this.state.colors[this.state.index]})
    }

  }

  handleKeyDown(event) {
    // if spacebar is pressed to run a new game
    if (this.state.isGameOver && event.keyCode === 32) {
      this.resetGame()
      return
    }
    if (this.state.directionChanged) return

    if(this.state.locked){
  console.log('locked')
  
  if( this.state.snake[0].Xpos > this.state.apple.Xpos && this.state.snake[0].Ypos === this.state.apple.Ypos){
    this.goLeft()
    return
  }
  if( this.state.snake[0].Xpos === this.state.apple.Xpos && this.state.snake[0].Ypos > this.state.apple.Ypos){
    this.goUp()
    return
  }
  if( this.state.snake[0].Xpos < this.state.apple.Xpos && this.state.snake[0].Ypos === this.state.apple.Ypos){
    this.goRight()
    return
  }
  if( this.state.snake[0].Xpos === this.state.apple.Xpos && this.state.snake[0].Ypos < this.state.apple.Ypos){
    this.goDown()
    return
  }
  }

    switch (event.keyCode) {
      case 37:
      case 65:
        this.goLeft()
        break
      case 38:
      case 87:
        this.goUp()
        break
      case 39:
      case 68:
        this.goRight()
        break
      case 40:
      case 83:
        this.goDown()
        break
      default:
    }
    this.setState({ directionChanged: true })
  }

  goLeft() {
    let newDirection = this.state.direction === 'right' ? 'right' : 'left'
    this.setState({ direction: newDirection })
  }

  goUp() {
    let newDirection = this.state.direction === 'down' ? 'down' : 'up'
    this.setState({ direction: newDirection })
  }

  goRight() {
    let newDirection = this.state.direction === 'left' ? 'left' : 'right'
    this.setState({ direction: newDirection })
  }

  goDown() {
    let newDirection = this.state.direction === 'up' ? 'up' : 'down'
    this.setState({ direction: newDirection })
  }

  render() {
    let gridBlocks = []
    for (let i = 0; i <= 5; i++){
      let left = this.state.sideLength
        gridBlocks.push(
        <GridBlock
          key = {`gridblock + ${i}`}
          blockWidth = {this.state.blockWidth}
          blockHeight = {this.state.blockHeight}
          width = {this.state.blockWidth*9} 
          height = {this.state.blockHeight*9} 
          top = {this.state.blockHeight + ((this.state.blockHeight*9)*i)} 
          left = {this.state.blockWidth} 
          

       
          />)
          // left = {this.state.blockWidth + ((this.state.blockHeight*9)*i)} 
    }
    
    let snakes = []
    let snake = this.state.snake.slice()
    let snakeGlobal = this.state.snakeGlobal.slice()
    for(let i = 0; i < 0; i++){
snakes.push(<SnakeGame1 key = {'ai'+i}
        inc = {i}
        gameLoopTimeout = {this.state.gameLoopTimeout}
        apple = {this.state.apple}
        playerSnake = {snake}
        snakeGlobal = {snake.concat(snakeGlobal)}
        // handleKeyDown = {this.handleKeyDown}
        width = {this.state.width}
        height = {this.state.height}
        blockWidth= {this.state.blockWidth}
        blockHeight= {this.state.blockHeight}
        /> )}
        
    // Game over
    if (this.state.isGameOver) {
      return (
        <GameOver
          width={this.state.width}
          height={this.state.height}
          highScore={this.state.highScore}
          newHighScore={this.state.newHighScore}
          score={this.state.score}
        />
      )
    }
let i = -1
    return (
      <div
        id='GameBoard'
        style={{
          width: this.state.width,
          height: this.state.height,
          borderWidth: this.state.width / 50,
        }}>
          
          
          {snakes}
          {/* {gridBlocks} */}
          {/* {this.state.snakeGlobal.map((snakePart, index) => {
          i++
          
          return (
            <div>
            <div
              key={index}
              className='Block'
              style={{
                width: this.state.blockWidth,
                height: this.state.blockHeight,
                left: snakePart.Xpos,
                top: snakePart.Ypos,
                background: 'white',
                zIndex: `${i}`
              }}
            />
            
           </div>
          )
        })} */}
       
        {this.state.snake.map((snakePart, index) => {
          i++
          
          return (
            <div>
            <div
              key={index}
              inc = {index}
              className='Block'
              style={{
                width: this.state.blockWidth,
                height: this.state.blockHeight,
                left: snakePart.Xpos,
                top: snakePart.Ypos,
                background: this.state.colorBody[i],
                zIndex: `${i}`

              }}
            />
            
            <div
              
              className='assist'
              style={{
                position: 'absolute',
                zIndex: '-1',
                width: this.state.blockWidth,
                height: (this.state.height),
                left: this.state.snakeHead.Xpos,
                top: 0,
                // background: 'gray',
                opacity: .5,
                
              }}
            />
            <div
              
              className='assist'
              style={{
                position: 'absolute',
                zIndex: '-1',
                width: this.state.width,
                height: this.state.blockHeight,
                left: 0,
                top: this.state.snakeHead.Ypos,
                // background: 'gray',
                opacity: .5,
              }}
            />
            
           </div>
          )
        })}
{/* {this.state.di.map((snakePart)=>{
  
  return(
            <div
            
            className = 'block'
            style ={{
              width: this.state.blockWidth,
              height: this.state.blockHeight,
              left: snakePart.Xpos,
              top: snakePart.Ypos,
              background: this.state.diColor,
            }}
            />
  )}
)
        } */}
        <div
          className='Block'
          style={{
            width: this.state.blockWidth,
            height: this.state.blockHeight,
            left: this.state.apple.Xpos,
            top: this.state.apple.Ypos,
            background: this.state.appleColor,
          }}
        />
        
        <div id='Score' style={{ fontSize: this.state.width / 40 }}>
         {/* HIGH-SCORE: {this.state.highScore}&ensp;&ensp;&ensp;&ensp;SCORE:{' '} <div>LockedOn:{this.state.locked.toString()}</div> */}
         {/* global{JSON.stringify(this.state.snakeGlobal)}
         playersnake{JSON.stringify(this.state.snake)} */}
          {/* {this.state.score} */}
          width {this.state.width} height {this.state.height} blockwidth {this.state.blockWidth} blockHeight {this.state.blockHeight} sidelength {this.state.sideLength}
        </div>
        
      </div>
    )
  }
}

class AI extends React.Component {
   render() {
    return 
   }
  }
export default App
