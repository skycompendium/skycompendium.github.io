import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="Home">
      <nav>
        <ul>
          <li><Link to="/sky-globe" className="Button large">Sky Globe</Link></li>
          <li><Link to="/models" className="Button large">Models</Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Home
