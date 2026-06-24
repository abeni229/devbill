import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div className="home-badge">Freelance Tool</div>
      <h1 className="home-title">
        Vos devis,<br />à votre <span>image.</span>
      </h1>
      <p className="home-subtitle">
        Professionnel, rapide et exportable en PDF. Créez vos devis freelance en quelques clics.
      </p>
      <button className="home-btn" onClick={() => navigate('/devis')}>
        Créer un devis →
      </button>
      <div className="home-footer">DevBill — Rouky Dev</div>
    </div>
  )
}

export default Home