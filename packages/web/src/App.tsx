import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Guide from './pages/Guide'

export default function App() {
  return (
    <BrowserRouter basename="/rsp.setup_copilot">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guide" element={<Guide />} />
      </Routes>
    </BrowserRouter>
  )
}
