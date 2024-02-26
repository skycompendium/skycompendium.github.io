import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="Home background">
      <nav>
        <ul>
          <li><Link to="/star-map" className="Button large">Star Map</Link></li>
          <li><Link to="/models" className="Button large">Models</Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Home
