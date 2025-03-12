import { useState } from 'react'
import './App.css'
import MapComponent from './component/MapComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <MapComponent />
      </div>
    </>
  )
}

export default App
