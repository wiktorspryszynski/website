import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HomePage from './HomePage'
import NowPage from './pages/NowPage'

export default function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/now" element={<NowPage />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
    </HelmetProvider>
  )
}
