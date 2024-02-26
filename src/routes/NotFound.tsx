import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="NotFound">
      <h1>Lost in the Sky?</h1>
      <Link to="/" className="Button medium">Go Home</Link>
    </div>
  )
}

export default NotFound
