import { Link, Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import Models from './routes/Models'
import NotFound from './routes/NotFound'
import StarMap from './routes/StarMap'
import './App.css'

const App = () => {
  return (
    <div className="App">
      <nav>
        <Link to="/">Sky Compendium</Link>
      </nav>

      <Routes>
        <Route index element={<Home />} />
        <Route path="star-map" element={<StarMap />} />
        <Route path="models" element={<Models />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
