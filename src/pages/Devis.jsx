import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientForm from '../components/ClientForm'
import EntrepriseForm from '../components/EntrepriseForm'
import PrestationForm from '../components/PrestationForm'
import DevisPreview from '../components/DevisPreview'
import './Devis.css'

function Devis() {
  const navigate = useNavigate()

  const [client, setClient] = useState({
    nom: '',
    email: '',
    adresse: ''
  })

  const [entreprise, setEntreprise] = useState({
    nom: '',
    email: '',
    adresse: '',
    logo: null
  })

  const [prestations, setPrestations] = useState([
    { description: '', quantite: 1, prixUnitaire: 0 }
  ])

  const numero = useMemo(() => {
    const now = Date.now().toString().slice(-6)
    return `DEV-${now}`
  }, [])

  return (
    <div className="devis-page">
      <div className="devis-header">
        <div className="devis-logo">DevBill</div>
        <button className="btn-retour" onClick={() => navigate('/')}>← Retour</button>
      </div>
      <div className="devis-body">
        <div className="card numero-card">
          <span className="numero-label">N° de devis</span>
          <span className="numero-value">{numero}</span>
        </div>
        <EntrepriseForm entreprise={entreprise} setEntreprise={setEntreprise} />
        <ClientForm client={client} setClient={setClient} />
        <PrestationForm prestations={prestations} setPrestations={setPrestations} />
        <DevisPreview client={client} entreprise={entreprise} prestations={prestations} numero={numero} />
      </div>
    </div>
  )
}

export default Devis