import { useRef, useState } from 'react'

function DevisPreview({ client, prestations, numero }) {
  const previewRef = useRef()
  const [tvaActive, setTvaActive] = useState(false)
  const [tauxTva, setTauxTva] = useState(18)
  const [erreur, setErreur] = useState('')

  const sousTotal = prestations.reduce((acc, p) => {
    return acc + Number(p.quantite) * Number(p.prixUnitaire)
  }, 0)

  const tva = tvaActive ? sousTotal * (tauxTva / 100) : 0
  const total = sousTotal + tva

  function valider() {
    if (!client.nom.trim()) return 'Le nom du client est obligatoire.'
    if (!client.email.trim()) return "L'email du client est obligatoire."
    if (prestations.length === 0) return 'Ajoute au moins une prestation.'
    const vide = prestations.some(p => !p.description.trim() || Number(p.prixUnitaire) <= 0)
    if (vide) return 'Toutes les prestations doivent avoir une description et un prix.'
    return ''
  }

  function exportPDF() {
    const msg = valider()
    if (msg) {
      setErreur(msg)
      return
    }
    setErreur('')
    const element = previewRef.current
    const opt = {
      margin: 10,
      filename: `devis-${client.nom || 'client'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    import('html2pdf.js').then(({ default: html2pdf }) => {
      html2pdf().set(opt).from(element).save()
    })
  }

  return (
    <div className="preview-card">
      <h2>Aperçu du devis</h2>
      <p style={{ fontSize: '11px', color: '#9a8a6a', letterSpacing: '2px', marginBottom: '1.5rem' }}>N° {numero}</p>

      <div ref={previewRef} style={{ padding: '1rem' }}>
        <p style={{ fontSize: '11px', color: '#9a8a6a', letterSpacing: '2px', marginBottom: '0.5rem' }}>N° {numero}</p>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '11px', color: '#9a8a6a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Client</p>
          <div className="preview-client">
            <p>{client.nom || '—'}</p>
            <p>{client.email || '—'}</p>
            <p>{client.adresse || '—'}</p>
          </div>
        </div>

        <table className="preview-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qté</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {prestations.map((p, index) => (
              <tr key={index}>
                <td>{p.description || '—'}</td>
                <td>{p.quantite}</td>
                <td>{Number(p.prixUnitaire).toLocaleString()} FCFA</td>
                <td>{(Number(p.quantite) * Number(p.prixUnitaire)).toLocaleString()} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totaux">
          <div className="totaux-row">
            <span>Sous-total</span>
            <span>{sousTotal.toLocaleString()} FCFA</span>
          </div>
          <div className="tva-control">
            <label className="tva-toggle">
              <input
                type="checkbox"
                checked={tvaActive}
                onChange={(e) => setTvaActive(e.target.checked)}
              />
              <span>Appliquer la TVA</span>
            </label>
            {tvaActive && (
              <div className="tva-input-group">
                <input
                  type="number"
                  value={tauxTva}
                  min="0"
                  max="100"
                  onChange={(e) => setTauxTva(Number(e.target.value))}
                  className="tva-input"
                />
                <span>%</span>
                <span className="tva-montant">{tva.toLocaleString()} FCFA</span>
              </div>
            )}
          </div>
          <div className="totaux-final">
            <span>Total</span>
            <span>{total.toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      {erreur && <p className="erreur-msg">{erreur}</p>}

      <button className="btn-pdf" onClick={exportPDF}>
        Exporter en PDF
      </button>
    </div>
  )
}

export default DevisPreview