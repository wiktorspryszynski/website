import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Flashcards from './components/Flashcards';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<Flashcards />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
