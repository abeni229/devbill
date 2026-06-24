import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Devis from './pages/Devis'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devis" element={<Devis />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App