import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { exportJsonToPDF } from './utility/exportPdf'
import jsonData from './assets/demo.json'


function App() {
  const [count, setCount] = useState(0);


  const handleWorker = () => {
    const worker = new Worker('/worker.js');
    const now = new Date();


    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    console.log(`click start: ${mm}-${ss}`);

    worker.postMessage(1000000);

    worker.onmessage = (e) => {
      console.log("Result From worker:" + e.data);

    };

    return () => {
      worker.terminate();
    };

  }

  function handleExport()
   {
    const PdfWorker = new Worker(
      new URL("./worker/exportWorker.js", import.meta.url),
      { type: "module" }
    );

    PdfWorker.postMessage({ m1: 100, m2: "I can be Everything" });

    PdfWorker.onmessage = ((e) => {
      console.log("result:", e.data);

    });

    return ()=>{
      PdfWorker.terminate();
    }
   }

  const handleExportPdf = async () => {
    await exportJsonToPDF(jsonData);
  }

  return (
    <>
      <div>
        Jay shree Ram

        <div style={{ marginTop: "50px" }}>
          <button onClick={() => { handleExportPdf(); handleWorker();handleExport(); }}>
            Export ▶️
          </button>
        </div>
      </div>
    </>
  )
}

export default App
