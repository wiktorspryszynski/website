import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Flashcards from './components/Flashcards';
import CvPage from './components/CvPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/cv" element={<CvPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
