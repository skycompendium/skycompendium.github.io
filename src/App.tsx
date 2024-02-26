import { Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import Models from './routes/Models'
import NotFound from './routes/NotFound'
import SkyGlobe from './routes/SkyGlobe'
import './App.css'

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />} />
        <Route path="sky-globe" element={<SkyGlobe />} />
        <Route path="models" element={<Models />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
