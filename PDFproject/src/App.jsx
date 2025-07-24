import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { exportJsonToPDF } from './utility/exportPdf'
import jsonData from './assets/demo.json'

function App() {
  const [count, setCount] = useState(0)

  const handleExportPdf = async () => {
    await exportJsonToPDF(jsonData);
  }

  return (
    <>
      <div>
        Jay shree Ram

        <div style={{marginTop:"50px"}}>
          <button onClick={handleExportPdf}>
            Export ▶️
          </button>
        </div>
      </div>
    </>
  )
}

export default App
