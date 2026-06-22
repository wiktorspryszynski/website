import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HomePage from './HomePage'
import NowPage from './pages/NowPage'
import OrbCanvas from './components/OrbCanvas'

function AppShell() {
  const { pathname } = useLocation()
  // One orb persists across routes; mode drives the home <-> subpage glide.
  return (
    <>
      <OrbCanvas mode={pathname === '/' ? 'home' : 'subpage'} />
      <Routes>
        <Route path="/now" element={<NowPage />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </HelmetProvider>
  )
}
