import React from 'react'
import './SnakeGame.css'
import GameOver from './GameOver.jsx'
import NewSnake from './NewSnake.jsx'
// class App1 extends React.Component {
//   render() {
//     return (
//       <div>
        
//         <SnakeGame 
//         key = {500}
//         gameLoopTimeout = {this.props.gameLoopTimeout}
//         apple = {this.props.apple}
//         snakeGlobal = {this.props.snakeGlobal}
//         // handleKeyDown = {this.handleKeyDown}
//         width = {this.props.width}
//         height = {this.props.height}
//         blockWidth= {this.props.blockWidth}
//         blockHeight= {this.props.blockHeight}
//         />
        
//       </div>
//     )
//   }
// }

class SnakeGame1 extends React.PureComponent {
  constructor(props) {
    super(props)

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.inc = this.props.inc
   
    // this.moveCheck = this.moveCheck.bind(this)
    this.state = {
     
      prevnum: -1,
     
      left: 0,
      up: 0,
      right : 0,
      down : 0,
      freeleft:true,
      freeup:true,
      freeright :true,
      freedown : true,
      
      gameLoopTimeout: this.props.gameLoopTimeout,
      timeoutId: 0,
      startSnakeSize: 0,
      snake: [],
      snakeGlobal: [],
      snakeHead: [],
      apple: this.props.apple,
      di: [],
      direction: 'right',
      // 
   
      isGameOver: false,
      snakeColor: this.props.snakeColor || this.getRandomColor(),
      // snakeColor: 'red',
      appleColor: this.props.appleColor || this.getRandomColor(),
      diColor: 'gray',
 
 
    }
  }

 
  


   
 
  
  componentDidMount() {
    // clearTimeout(this.state.timeoutId)
  
    this.initGame()
    // this.handleKeyDown()
    // window.addEventListener('keydown', this.handleKeyDown)
    this.gameLoop()
    // this.moveCheck()
  }

  componentDidUpdate(prevProps, prevState){
  

    if(prevProps !== this.props){
 
      this.handleKeyDown()}
   
 
// clearInterval(this.gameLoop)
  }
  initGame() {
    // Game size initialization
    // let percentageWidth = this.props.percentageWidth || 40
    // let width =900*(percentageWidth/100)
      // document.getElementById('GameBoard').parentElement.offsetWidth *
      // (percentageWidth / 100)
    // width -= width % 30
    let width =this.props.width
    // if (width < 30) width = 30
    // let height = (width / 3) * 2
    let height = this.props.height
    // let blockWidth = width/30
    let blockWidth = this.props.blockWidth
    //width/30
    // let blockHeight = height/20
    let blockHeight = this.props.blockHeight
    //height/20
    let snakeGlobal = this.props.snakeGlobal
    // snake initialization
    let startSnakeSize = this.props.startSnakeSize || 100
    let snake = []
    let Xpos = width / 2 
    let Ypos = height / 2
    let snakeHead = { Xpos: Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth, Ypos: Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
      blockHeight}
    snake.push(snakeHead)
    for (let i = 1; i < startSnakeSize; i++) {
      Xpos -= blockWidth
      let snakePart = { Xpos: Xpos, Ypos: Ypos }
      snake.push(snakePart)
    }

    //Di initialization
      // let di = {
      //   Xpos: width / 2

      // }
    // apple position initialization
    // let appleXpos =
    //   Math.ceil(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
    //   blockWidth
    // let appleYpos =
    //   Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
    //   blockHeight
    // while (appleYpos === snake[0].Ypos) {
    //   appleYpos =
    //     Math.ceil(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
    //     blockHeight
    // }

    this.setState({
      width,
      height,
      blockWidth,
      blockHeight,
      startSnakeSize,
      snake,
      snakeGlobal,
      // apple: { Xpos: appleXpos, Ypos: appleYpos },
    })
  }
 

  gameLoop() {
    let timeoutId = setTimeout(() => {
      // if (!this.state.isGameOver) {
        // this.moveCheck()
        let left = true
        let up = true
        let right = true
        let down = true
        // this.handleKeyDown()
        
        this.moveSnake()
        let snakeHead = this.state.snake[0]
        this.tryToEatSnake()
        this.tryToEatApple()
        // this.setState({  snakeHead, down,
        //   up,
        //   })
        // //(this.state.snakeHead)
 
      // }

      this.gameLoop()
    }, this.state.gameLoopTimeout)
    

    this.setState({ directionChanged: false,timeoutId})
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId)
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  resetGame() {
    
    let width = this.props.width
    let height = this.props.height
    let blockWidth = this.props.blockWidth
    let blockHeight = this.props.blockHeight
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
      // 
      isGameOver: false,
      // gameLoopTimeout: 50,
      snakeColor: this.getRandomColor(),
      appleColor: this.getRandomColor(),
     
    })
  }

  getRandomColor() {
    let hexa = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) color += hexa[Math.ceil(Math.random() * 16)]
    return color
  }

  moveSnake() {
    
    let snake = this.state.snake
    
    let previousPartX = this.state.snake[0].Xpos
    let previousPartY = this.state.snake[0].Ypos
    let tmpPartX = previousPartX
    let tmpPartY = previousPartY
    if(!this.state.isGameOver)this.moveHead()
    for (let i = 1; i < snake.length; i++) {
      tmpPartX = snake[i].Xpos
      tmpPartY = snake[i].Ypos
      snake[i].Xpos = previousPartX
      snake[i].Ypos = previousPartY
      
      previousPartX = tmpPartX
      previousPartY = tmpPartY
    }
    // let di = this.state.snake
    // di[0].Xpos = this.state.snake[0].Xpos
    // di[0].Ypos = this.state.snake[0].Ypos


    this.setState({ snake  })
  }

  tryToEatApple() {
    let snake = this.state.snake
    let apple = this.state.apple

    // if the snake's head is on an apple
    if (snake[0].Xpos === apple.Xpos && snake[0].Ypos === apple.Ypos) {
      let width = this.props.width
      let height = this.props.height
      let blockWidth = this.props.blockWidth
      let blockHeight = this.props.blockHeight
      let newTail = { Xpos: apple.Xpos, Ypos: apple.Ypos }
     
      let gameLoopTimeout = this.props.gameLoopTimeout

      // increase snake size
      snake.push(newTail)

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
   

      // decrease the game loop timeout
      // if (gameLoopTimeout > 25) gameLoopTimeout -= 0.5

      this.setState({
        snake,
        apple,
     
    
        gameLoopTimeout,
      })
    }
  }

  tryToEatSnake() {
    let snake = this.state.snake
    let snakeGlobal = this.props.snakeGlobal
    for (let i = 0; i < snakeGlobal.length; i++) {
      if (snake[0].Xpos === snakeGlobal[i].Xpos && snake[0].Ypos === snakeGlobal[i].Ypos)
    
        this.setState({ isGameOver: true})
        return
    }
    for(let i = 1; i < snake.length; i++)
    if(snake[0].Xpos === snake[i].Xpos && snake[0].Ypos === snake[i].Ypos){
      this.setState({ isGameOver: true})
      return
    }
  }

  isAppleOnSnake(appleXpos, appleYpos) {
    let snake = this.state.snake
    for (let i = 0; i < snake.length; i++) {
      if (appleXpos === snake[i].Xpos && appleYpos === snake[i].Ypos)
        return true
    }
    return false
  }

  moveHead() {
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
      case 'down':
      
        this.moveHeadDown()
      default:
        this.handleKeyDown
    }
  }

  moveHeadLeft() {
    let blockHeight = this.props.blockHeight
    // this.setState({snakeGlobal: this.props.snakeGlobal})
    // this.moveCheck()
    // if(!this.state.directionChanged) return
    
   
    let width = this.props.width
    let blockWidth = this.props.blockWidth
    let snake = this.state.snake.slice()
    let player = this.props.playerSnake
    const snakeGlobal = player.concat(this.props.snakeGlobal)
    let freeleft = true
    let freeup = true
    let free
    let freedown = true
    
    snake[0].Xpos =
      snake[0].Xpos <= 0 ? width - blockWidth : snake[0].Xpos - blockWidth
      let leftC = {Xpos: snake[0].Xpos-blockWidth, Ypos: snake[0].Ypos}
      let rightC = {Xpos: snake[0].Xpos+blockWidth, Ypos: snake[0].Ypos}
      let upC = {Xpos: snake[0].Xpos, Ypos: snake[0].Ypos-blockHeight}
      let downC = {Xpos: snake[0].Xpos, Ypos: snake[0].Ypos+blockHeight}
let i = 0
    
      
       while(i<snakeGlobal.length && freeup){
        if(snakeGlobal[i].Ypos === upC.Ypos&& snakeGlobal[i].Xpos=== upC.Xpos){ 
          freeup = false
        }
          i++
       }
       while(i<snakeGlobal.length && freedown){
       if(snakeGlobal[i].Ypos === downC.Ypos&& snakeGlobal[i].Xpos=== downC.Xpos){ 
        freedown = false
      }
        i++
      }
      while(i<snakeGlobal.length && freeleft){
        if(snakeGlobal[i].Ypos === leftC.Ypos&& snakeGlobal[i].Xpos=== leftC.Xpos){ 
         freeleft = false
       }
       i++
    }     

    this.setState({ snake, left:leftC, down: downC, up:upC,  freeleft: freeleft, freeup:freeup, freedown:freedown })
   
    return
  }

  moveHeadUp() {
    let blockHeight = this.props.blockHeight
    // this.setState({snakeGlobal: this.props.snakeGlobal})
   
  
    let height = this.props.height
   
    let snake = this.state.snake.slice()
    let player = this.props.playerSnake
    const snakeGlobal = player.concat(this.props.snakeGlobal)
    let freeleft = true
    let freeup = true
    let freeright = true
    let freedown = true
    let blockWidth = this.props.blockWidth
    // let di = this.state.snake.slice()
    // if(!this.state.up) {
    //   this.handleKeyDown()
    // }
    snake[0].Ypos =
      snake[0].Ypos <= 0 ? height - blockHeight : snake[0].Ypos - blockHeight
      let leftC = {Xpos: snake[0].Xpos-blockWidth, Ypos: snake[0].Ypos}
      let rightC = {Xpos: snake[0].Xpos+blockWidth, Ypos: snake[0].Ypos}
      let upC = {Xpos: snake[0].Xpos, Ypos: snake[0].Ypos-this.props.blockHeight}
      let downC = {Xpos: snake[0].Xpos, Ypos: snake[0].Ypos+blockHeight}
 let i = 0
      while(i<snakeGlobal.length && freeright){
        if(snakeGlobal[i].Ypos === rightC.Ypos&& snakeGlobal[i].Xpos=== rightC.Xpos){ 
          freeright = false
        }
          i++
       }
       i = 0
       while(i<snakeGlobal.length && freeup){
        if(snakeGlobal[i].Ypos === upC.Ypos&& snakeGlobal[i].Xpos=== upC.Xpos){ 
          freeup = false
        }
          i++
       }
       while(i<snakeGlobal.length && freedown){
       if(snakeGlobal[i].Ypos === downC.Ypos&& snakeGlobal[i].Xpos=== downC.Xpos){ 
        freedown = false
      }
        i++
      }
      while(i<snakeGlobal.length && freeleft){
        if(snakeGlobal[i].Ypos === leftC.Ypos&& snakeGlobal[i].Xpos=== leftC.Xpos){ 
         freeleft = false
       }
       i++
    }     
    
          
          

      // //(upC.Xpos , snake[0].Xpos  snake[0].Ypos , upC.Ypos-this.props.blockHeight)
    this.setState({ snake, up:upC, right:rightC, left:leftC, freeleft: freeleft, freeup:freeup, freeright:freeright })
    
    // let currApple = this.state.apple
    // if(this.state.freeright &&currApple.Xpos>this.state.snake.slice()[0].Xpos && this.state.direction !== 'left' ) {
    //  this.goRight()
    //   return
    // }
    //      if(this.state.freedown &&currApple.Ypos>this.state.snake.slice()[0].Ypos  && this.state.direction !== 'up' ) {
    //      this.goDown()
    //        return
    //    }
    //    if(this.state.freeup &&currApple.Ypos<this.state.snake.slice()[0].Ypos && this.state.direction !== 'down' ) {
    //      this.goUp()
    //        return
    //    }
    //    if(this.state.freeleft &&currApple.Xpos<this.state.snake.slice()[0].Xpos && this.state.direction !== 'right'  ) {
    //      this.goLeft()
    //       return
    //   }
    return
  }

  moveHeadRight() {
    let blockHeight = this.props.blockHeight
    // this.setState({snakeGlobal: this.props.snakeGlobal})
    
   
    // this.moveCheck()
    // if(!this.state.directionChanged) return
    let width = this.props.width
    let blockWidth = this.props.blockWidth
    let snake = this.state.snake.slice()
    let player = this.props.playerSnake
    const snakeGlobal = player.concat(this.props.snakeGlobal)
    let freeleft = true
    let freeup = true
    let freeright = true
    let freedown = true
    
    snake[0].Xpos =
      snake[0].Xpos >= width - blockWidth ? 0 : snake[0].Xpos + blockWidth
      let leftC = {Xpos: snake[0].Xpos-blockWidth, Ypos: snake[0].Ypos}
      let rightC = {Xpos: snake[0].Xpos+blockWidth, Ypos: snake[0].Ypos}
      let upC = {Xpos: snake[0].Xpos, Ypos: snake[0].Ypos-blockHeight}
      let downC = {Xpos: snake[0].Xpos, Ypos: snake[0].Ypos+blockHeight}
   let i = 0;
   while(i<snakeGlobal.length && freeright){
    if(snakeGlobal[i].Ypos === rightC.Ypos&& snakeGlobal[i].Xpos=== rightC.Xpos){ 
      freeright = false
    }
      i++
   }
   i = 0
   while(i<snakeGlobal.length && freeup){
    if(snakeGlobal[i].Ypos === upC.Ypos&& snakeGlobal[i].Xpos=== upC.Xpos){ 
      freeup = false
    }
      i++
   }
   while(i<snakeGlobal.length && freedown){
   if(snakeGlobal[i].Ypos === downC.Ypos&& snakeGlobal[i].Xpos=== downC.Xpos){ 
    freedown = false
  }
    i++
  }
  while(i<snakeGlobal.length && freeleft){
    if(snakeGlobal[i].Ypos === leftC.Ypos&& snakeGlobal[i].Xpos=== leftC.Xpos){ 
     freeleft = false
   }
   i++
}     
        
          

    this.setState({ snake, up: upC, right:rightC, down:downC, freeup:freeup, freedown:freedown,freeright:freeright })
    // let currApple = this.state.apple
    // if(this.state.freeright &&currApple.Xpos===this.state.snake.slice()[0].Xpos && this.state.direction !== 'left' ) {
    //  //('goingright')
    //  this.goRight()
    //   return
    // }
    //      if(this.state.freedown &&currApple.Ypos>this.state.snake.slice()[0].Ypos  && this.state.direction !== 'up' ) {
    //      this.goDown()

    //        return
    //    }
    //    if(this.state.freeup &&currApple.Ypos<this.state.snake.slice()[0].Ypos && this.state.direction !== 'down' ) {
    //      this.goUp()
    //        return
    //    }
    //    if(this.state.freeleft &&currApple.Xpos===this.state.snake.slice()[0].Xpos && this.state.direction !== 'right'  ) {
    //      this.goLeft()
    //       return
    //   }
  }

  moveHeadDown() {
    let blockHeight = this.props.blockHeight

    // this.setState({snakeGlobal: this.props.snakeGlobal})
    let freeleft = true
    let freeup = true
    let freeright = true
    let freedown = true
    let height = this.props.height
    let snake = this.state.snake.slice()
    let player = this.props.playerSnake
    const snakeGlobal = player.concat(this.props.snakeGlobal)
  // console.log(player)
    let di = this.state.snake.slice()
    let blockWidth = this.props.blockWidth
    snake[0].Ypos =
      snake[0].Ypos >= height - blockHeight ? 0 : snake[0].Ypos + blockHeight
      let leftC = {Xpos: snake[0].Xpos-blockWidth, Ypos: snake[0].Ypos}
      let rightC = {Xpos: snake[0].Xpos+blockWidth, Ypos: snake[0].Ypos}
      let upC = {Xpos: snake[0].Xpos, Ypos: snake[0].Ypos-blockHeight}
      let downC = {Xpos: snake[0].Xpos, Ypos: snake[0].Ypos+blockHeight}
  let i = 0
      while(i<snakeGlobal.length && freeright){
        if(snakeGlobal[i].Ypos === rightC.Ypos&& snakeGlobal[i].Xpos=== rightC.Xpos){ 
          freeright = false
        }
          i++
       }
       i = 0
       while(i<snakeGlobal.length && freeup){
        if(snakeGlobal[i].Ypos === upC.Ypos&& snakeGlobal[i].Xpos=== upC.Xpos){ 
          freeup = false
        }
          i++
       }
       while(i<snakeGlobal.length && freedown){
       if(snakeGlobal[i].Ypos === downC.Ypos&& snakeGlobal[i].Xpos=== downC.Xpos){ 
        freedown = false
      }
        i++
      }
      while(i<snakeGlobal.length && freeleft){
        if(snakeGlobal[i].Ypos === leftC.Ypos&& snakeGlobal[i].Xpos=== leftC.Xpos){ 
         freeleft = false
       }
       i++
    }     

    this.setState({snake, down:downC, up:upC, right:rightC, left:leftC, freeleft: freeleft, freeup:freeup, freedown:freedown,freeright:freeright})
    // let currApple = this.state.apple
    // if(this.state.freeright &&currApple.Xpos>this.state.snake.slice()[0]['Xpos'] && this.state.direction !== 'left' ) {
    //  this.goRight()d
    //   return
    // }
    //      if(this.state.freedown &&currApple.Ypos>this.state.snake.slice()[0]['Ypos']  && this.state.direction !== 'up' ) {
    //      this.goDown()
    //        return
    //    }
    //    if(this.state.freeup &&currApple.Ypos<this.state.snake.slice()[0]['Ypos'] && this.state.direction !== 'down' ) {
    //      this.goUp()
    //        return
    //    }
    //    if(this.state.freeleft &&currApple.Xpos<this.state.snake.slice()[0]['Xpos'] && this.state.direction !== 'right'  ) {
    //      this.goLeft()
    //       return
    //   }
    return
  }

  handleKeyDown(event) {
 
    // this.setState({snakeGlobal:this.props.snakeGlobal})
    // this.moveCheck()

    let currApple = this.state.apple
    let width = this.props.width
    let height = this.props.height 
    let head = this.state.snake[0]
    let blockHeight = this.props.blockHeight
    let blockWidth = this.props.blockWidth
    let snakeCoors = []
    
    
    // //('AppleX '+currApple.Xpos + 'AppleY '+currApple.Ypos, this.state.snake[0])
   
    // if spacebar is pressed to run a new game
    if (this.state.isGameOver) {
    
    
      this.setState({snake: [{Xpos: 0, Ypos: 0}], isGameOver: false})
     
      return
    }
    
    if (this.state.directionChanged ) return

    // switch (event.keyCode) {
   let up = true
  //  let upC = {Xpos: this.state.snake[0]['Xpos'], Ypos: this.state.snake[0]['Ypos']-this.props.blockHeight}
   let down = true 
  //  let downC = {Xpos: this.state.snake[0]['Xpos'], Ypos: this.state.snake[0]['Ypos']+this.props.blockHeight}
   let left = true
  //  let leftC = {Xpos: this.state.snake[0]['Xpos']-blockWidth, Ypos: this.state.snake[0]['Ypos']}
   let right = true
    // let rightC = {Xpos: this.state.snake[0]['Xpos']+blockWidth, Ypos: this.state.snake[0]['Ypos']}
    // this.state.snake.forEach((el)=>{
    //   if(el === upC)  up= false
    //   if(el === downC) down= false
    //   if (el === rightC) right = false
    //   if(el === leftC) left = false
    //   snakeCoors.push({'Xpos':el.Xpos, 
    //   'Ypos':el.Ypos})
      
    // })
  

     currApple = this.props.apple
     if(this.state.freedown &&(currApple.Ypos>head.Ypos || !this.state.freeleft && currApple.Xpos<head.Xpos || !this.state.freeright && currApple.Xpos> head.Xpos || !this.state.freeleft && !this.state.freeup)  && this.state.direction !== 'up' || this.state.freedown
     &&this.state.freedown  && this.state.direction !== 'up' && (!this.state.freeleft && !this.state.freeup || !this.state.freeright&& !this.state.freeup )  ) {
  console.log('goingdown')
      this.goDown()
      this.setState({directionChanged: true})
        return
    }
    if(this.state.freeright &&(currApple.Xpos>head.Xpos || !this.state.freeup && currApple.Ypos<head.Ypos || !this.state.freedown && currApple.Ypos > head.Ypos || !this.state.freeleft && currApple.Xpos<head.Xpos) &&  
    this.state.direction !== 'left' ) {
     // console.log('goingright', snakeObjY[head.Ypos] = (data) =>{for(let i = 0; i < data; i ++){ if(data[i]>snake[0].Xpos) {return true}}return false})
     console.log('goingright')
     this.goRight()
     this.setState({directionChanged: true})
      return
    }
    if(this.state.freeleft && this.state.direction !== 'right' && this.state.apple.Xpos < head.Xpos) {
   
      console.log('goingleft')
      this.goLeft()
      this.setState({directionChanged: true})
       return
   }
    if(this.state.freeup &&(currApple.Ypos<head.Ypos || !this.state.freeright && !this.state.freedown) && this.state.direction !== 'down'){
      // this.setState({freedown:true})
      console.log('goingup')
      this.goUp()
      this.setState({directionChanged: true})
        return
    }
   
    if(this.state.freedown &&(currApple.Ypos>head.Ypos || !this.state.freeleft && currApple.Xpos<head.Xpos || !this.state.freeright && currApple.Xpos> head.Xpos || !this.state.freeleft && !this.state.freeup)  && this.state.direction !== 'up'|| this.state.freedown
    &&this.state.freedown  && this.state.direction !== 'up' && (!this.state.freeleft && !this.state.freeup || !this.state.freeright&& !this.state.freeup ) ) {
  console.log('goingdown')
     this.goDown()
     // this.setState({directionChanged: true})
       return
   }
     if(this.state.freedown &&(currApple.Ypos>head.Ypos || !this.state.freeleft && currApple.Xpos<head.Xpos || !this.state.freeright && currApple.Xpos> head.Xpos)  && this.state.direction !== 'up' || this.state.freedown  && this.state.direction !== 'up' && (!this.state.freeleft && !this.state.freeup || !this.state.freeright&& !this.state.freeup )  ) {
    
      this.goDown()
      // this.setState({directionChanged: true})
        return
    }
    if(this.state.freeleft &&(currApple.Xpos<head.Xpos|| !this.state.freeup && currApple.Ypos<head.Ypos || !this.state.freedown && currApple.Ypos < head.Ypos || !this.state.freeup && !this.state.freeright || !this.state.freedown && !this.state.freeright) && this.state.direction !== 'right' || this.state.freeleft  && this.state.direction !== 'right' && ( !this.state.freedown && !this.state.freeright || !this.state.freeup && currApple.Ypos < head.Ypos)) {
      // this.setState({freedown:true,
      // freeup: true})

      this.goLeft()
     // this.moveCheck()
    //  this.setState({directionChanged: true})
    
       return
   }
     if(this.state.freeright &&(currApple.Xpos>head.Xpos || !this.state.freeup && currApple.Ypos<head.Ypos || !this.state.freedown && currApple.Ypos > head.Ypos || !this.state.freeleft && currApple.Xpos<head.Xpos) && this.state.direction !== 'left' ||this.state.freeright  && this.state.direction !== ('left') && (!this.state.freeup && !this.state.freeleft ||!this.state.freeup && !this.state.down && !this.state.freeleft|| !this.state.freedown && !this.state.freeleft  || !this.state.freedown &&  currApple.Xpos > head.Xpos)) {

      this.goRight()
      // this.setState({directionChanged: true})
       return
     }
     if(this.state.freeup &&(currApple.Ypos<head.Ypos || !this.state.freeright && !this.state.freedown) && this.state.direction !== 'down' || this.state.freeup  && this.state.direction !== 'down' && (!this.state.freeleft && !this.state.freedown|| !this.state.freeright&& !this.state.freeleft || !this.state.right && !this.state.freedown || !this.state.freeright) &&  (!this.state.freeleft || !this.state.freeright || !this.state.freedown) ) {
      // this.setState({freedown:true})

      this.goUp()
      // this.setState({directionChanged: true})
        return
    }
   
  
   

         
    return
  }

  goLeft() {
    // this.moveCheck()

    //('user input = left', this.state.left)
    let newDirection = this.state.direction === 'right' ? 'right' : 'left'
    this.setState({ direction: newDirection })
    
  }

  goUp() {
    // this.moveCheck()
    
    //('user input = up',this.state.up)
    let newDirection = this.state.direction === 'down' ? 'down' : 'up'
    this.setState({ direction: newDirection })
  }

  goRight() {
    // this.moveCheck()
    
    //('user input = right', this.state.right)
    let newDirection = this.state.direction === 'left' ? 'left' : 'right'
    this.setState({ direction: newDirection })
  }

  goDown() {
    // this.moveCheck()
   
    //('user input = down', this.state.down)
    let newDirection = this.state.direction === 'up' ? 'up' : 'down'
    this.setState({ direction: newDirection })
  }

  render() {
    // Game over
    // if (this.state.isGameOver) {
    //   return (
    //     <GameOver
    //     key = {'GameOver'}
    //       width={this.props.width}
    //       height={this.props.height}
    //       highScore={this.state.highScore}
    //       newHighScore={this.state.newHighScore}
    //       score={this.state.score}
    //     />
    //   )
    // }

    return (
      
      <div>
        {/* <div
              key={'up'}
              className='aiBlock'
              style={{
                width: this.props.blockWidth,
                height: this.props.blockHeight,
                left: this.state.up.Xpos,
                top: this.state.up.Ypos,
              
                background: 'red',
                // zIndex: '-1'
              }}
            />
   <div
              key={'right'}
              className='aiBlock'
              style={{
                width: this.props.blockWidth,
                height: this.props.blockHeight,
                left: this.state.right.Xpos,
                top: this.state.right.Ypos,
                background: 'red',
                zIndex: '2',
              }}
            />
            <div
              key={'left'}
              className='aiBlock'
              style={{
                width: this.props.blockWidth,
                height: this.props.blockHeight,
                left: this.state.left.Xpos,
                top: this.state.left.Ypos,
                background: 'red',
                zIndex: '2',
              }}
            />
            <div
              key={'down'}
              className='aiBlock'
              style={{
                width: this.props.blockWidth,
                height: this.props.blockHeight,
                left: this.state.down.Xpos,
                top: this.state.down.Ypos,
                background: 'red',
                zIndex: '2',
              }}
            /> */}
        {this.state.snake.map((snakePart, index) => {
          return (
            <div key = {this.props.inc+'snakebody' + index}>
            <div
            
              className='aiBlock'
              style={{
                width: this.props.blockWidth,
                height: this.props.blockHeight,
                left: snakePart.Xpos,
                top: snakePart.Ypos,
                background: this.state.snakeColor,
                zIndex: '1',
              }}
            />
            {/* <div
              key={index}
              className='Block'
              style={{
                width: this.props.blockWidth,
                height: this.props.blockHeight,
                left: snakePart.Xpos,
                top: snakePart.Ypos,
                background: this.state.snakeColor,
              }}
            /> */}
            {/* <div
              key={"assistx" + index}
              className='Block'
              style={{
                position: 'absolute',
                zIndex: '-1',
                width: this.props.blockWidth,
                height: (this.props.height),
                left: this.state.snake[0].Xpos,
                top: 0,
                background: 'gray',
              }}
            />
            <div
              key={"assisty"+index}
              className='Block'
              style={{
                position: 'absolute',
                zIndex: '-1',
                width: this.props.width,
                height: this.props.blockHeight,
                left: 0,
                top: this.state.snake[0].Ypos,
                background: 'gray',
              }}
            /> */}
           </div>
          )
        })}

      </div>
    )
  }
}

export default SnakeGame1
