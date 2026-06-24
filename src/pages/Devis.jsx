import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientForm from '../components/ClientForm'
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

  const [prestations, setPrestations] = useState([
    { description: '', quantite: 1, prixUnitaire: 0 }
  ])

 return (
  <div className="devis-page">
    <div className="devis-header">
      <div className="devis-logo">DevBill</div>
      <button className="btn-retour" onClick={() => navigate('/')}>← Retour</button>
    </div>
    <div className="devis-body">
      <ClientForm client={client} setClient={setClient} />
      <PrestationForm prestations={prestations} setPrestations={setPrestations} />
      <DevisPreview client={client} prestations={prestations} />
    </div>
  </div>
)
}

export default Devis