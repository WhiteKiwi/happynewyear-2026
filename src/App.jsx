import { Routes, Route } from 'react-router-dom'
import LetterView from './pages/LetterView'
import LetterCreate from './pages/LetterCreate'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LetterView />} />
      <Route path="/kiwi" element={<LetterCreate />} />
    </Routes>
  )
}

export default App
