import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DrawingCanvas from './components/DrawingCanvas'
import Whiteboard from './components/Whiteboard'

function App() {
  const [selection, setSelection] = useState(false);

  const handleSelect = () => {
    setSelection(!selection);
  }


  return (
    <div>
      <Whiteboard />
    </div>
  )
}

export default App
