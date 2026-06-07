import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import NowPage from './pages/NowPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/now" element={<NowPage />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
