import './App.css'
import Left from './components/Left/Left'
import Right from './components/Right/Right'
import Top from './components/Top/Top'

function App() {
  return (
    <>
      <div className='container'>
        <div className='navbar'>
          <Left />
        </div>
        <div className='main'>
          <Top />
          <Right />
        </div>
      </div>
    </>
  )
}

export default App
