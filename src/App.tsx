import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Diary from './pages/Diary'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter basename="/zeffiezheng-cv">
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
