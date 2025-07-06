import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import OrderIntake from './pages/OrderIntake'
import ExcelSync from './pages/ExcelSync'
import OrderCategorization from './pages/OrderCategorization'
import GenerateExcel from './pages/GenerateExcel'
import './index.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<OrderIntake />} />
            <Route path="/excel-sync" element={<ExcelSync />} />
            <Route path="/categorization" element={<OrderCategorization />} />
            <Route path="/generate-excel" element={<GenerateExcel />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
