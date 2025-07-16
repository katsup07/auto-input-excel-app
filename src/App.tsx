import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import OrderIntake from './pages/OrderIntake'
import OrderCategorization from './pages/OrderCategorization'
import CsvToExcel from './pages/CsvToExcel'
import './index.css'

function App() {
  return (
    <Router>
      <div className="app" >
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<OrderIntake />} />
            <Route path="/categorization" element={<OrderCategorization />} />
            <Route path="/csv-to-excel" element={<CsvToExcel />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
