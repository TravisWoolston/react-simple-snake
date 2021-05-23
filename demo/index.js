import React from 'react'
import ReactDOM from 'react-dom'
import App from '../src/SnakeGame.jsx'
import './index.css'
// import App from 'spotify-node-react-starter-kit\client\src\App.js'
ReactDOM.render(
  <React.StrictMode>
    
    <div className='textWrapper'>
      <p className='subTitle'>
        <a
          href='https://www.npmjs.com/package/react-simple-snake'
          target='_blank'
          rel='noopener noreferrer'>
         
        </a>{' '}
       
        <a
          href='https://github.com/MaelDrapier/react-simple-snake'
          target='_blank'
          rel='noopener noreferrer'>
          {' '}
     
        </a>
      </p>
      <p id='instructions'></p>
      <p className='subTitle'>
      
        <a
          href='https://reactjs.org/'
          target='_blank'
          rel='noopener noreferrer'>
         
        </a>
     
      </p>
    </div>
    <App />
    {/* <App /> */}
  </React.StrictMode>,
  document.getElementById('root')
)

// Access Token BQD31K3goT1Izg8_aoScAkazxcn_Hq3dWuPIebrmY4_SoCqAGmwkk_FtomLDl3EIsA7Jq-9PdwiVg7Hmkr6W45yF0295oy0Asg3kXvWy7Ofym9xZ4jg-sfWprrDP8k2JiOBH6c-4HxU8xvWOB-6kYKMuEHRjdvbGZiQWTA
