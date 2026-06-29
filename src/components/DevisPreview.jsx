import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'

function DevisPreview({ client, entreprise, prestations, numero }) {
  const previewRef = useRef()
  const [tvaActive, setTvaActive] = useState(false)
  const [tauxTva, setTauxTva] = useState(18)
  const [erreur, setErreur] = useState('')
  const sigRef = useRef(null)

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
    if (msg) { setErreur(msg); return }
    setErreur('')

    const lignes = prestations.map(p => `
      <tr>
        <td>${p.description || '—'}</td>
        <td style="text-align:center;">${p.quantite}</td>
        <td style="text-align:right;">${Number(p.prixUnitaire).toLocaleString()} FCFA</td>
        <td style="text-align:right;">${(Number(p.quantite) * Number(p.prixUnitaire)).toLocaleString()} FCFA</td>
      </tr>
    `).join('')

    const html = `
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Georgia, serif; padding: 48px; color: #111; background: #fff; font-size: 13px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #ddd; }
          .entreprise-info { text-align: left; }
          .client-info { text-align: right; }
          .info-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-bottom: 6px; }
          .info-name { font-size: 16px; font-weight: bold; color: #111; margin-bottom: 4px; }
          .info-detail { font-size: 12px; color: #444; line-height: 1.6; }
          .logo-wrap { text-align: center; margin-bottom: 8px; }
          .logo-wrap img { max-height: 80px; max-width: 180px; object-fit: contain; }
          .numero { font-size: 11px; letter-spacing: 2px; color: #888; text-transform: uppercase; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0 24px; }
          th { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #888; padding: 10px 0; border-bottom: 1px solid #ddd; text-align: left; }
          th:nth-child(2) { text-align: center; }
          th:nth-child(3), th:nth-child(4) { text-align: right; }
          td { padding: 10px 0; border-bottom: 1px solid #eee; color: #111; }
          .totaux { margin-left: auto; width: 280px; }
          .total-row { display: flex; justify-content: space-between; font-size: 13px; color: #888; margin-bottom: 6px; }
          .total-final { display: flex; justify-content: space-between; font-size: 20px; border-top: 1px solid #ddd; padding-top: 12px; margin-top: 8px; color: #111; font-weight: bold; }
          .signature-section { margin-top: 60px; border-top: 1px solid #ddd; padding-top: 24px; display: flex; justify-content: flex-end; }
          .signature-box { text-align: center; }
          .signature-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-bottom: 12px; }
          .signature-text { font-family: Georgia, serif; font-size: 22px; color: #111; border-bottom: 1px solid #111; padding-bottom: 4px; min-width: 200px; }
          .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #aaa; letter-spacing: 2px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="entreprise-info">
            <div class="info-label">Émetteur</div>
            <div class="info-name">${entreprise.nom || '—'}</div>
            <div class="info-detail">${entreprise.email || ''}</div>
            <div class="info-detail">${entreprise.adresse || ''}</div>
          </div>
          ${entreprise.logo ? `<div class="logo-wrap"><img src="${entreprise.logo}" alt="Logo"/></div>` : ''}
          <div class="client-info">
            <div class="info-label">Client</div>
            <div class="info-name">${client.nom || '—'}</div>
            <div class="info-detail">${client.email || ''}</div>
            <div class="info-detail">${client.adresse || ''}</div>
          </div>
        </div>

        <div class="numero">N° ${numero}</div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align:center;">Qté</th>
              <th style="text-align:right;">Prix unitaire</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${lignes}</tbody>
        </table>

        <div class="totaux">
          <div class="total-row"><span>Sous-total</span><span>${sousTotal.toLocaleString()} FCFA</span></div>
          ${tvaActive ? `<div class="total-row"><span>TVA (${tauxTva}%)</span><span>${tva.toLocaleString()} FCFA</span></div>` : ''}
          <div class="total-final"><span>Total</span><span>${total.toLocaleString()} FCFA</span></div>
        </div>

       ${sigRef.current && !sigRef.current.isEmpty() ? `
        <div class="signature-section">
          <div>
            <div class="signature-label">Signature</div>
            <img src="${sigRef.current.toDataURL()}" style="max-width:200px;max-height:80px;" />
          </div>
        </div>` : ''}

        <div class="footer">DevBill — devbill-five.vercel.app</div>
      </body>
      </html>
    `

      import('html2pdf.js').then(({ default: html2pdf }) => {
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
      html2pdf().set({
        margin: 10,
        filename: `devis-${client.nom || 'client'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(container).save().then(() => {
        document.body.removeChild(container)
      })
    })
  }

  return (
    <div className="preview-card">
      <h2>Aperçu du devis</h2>
      <p style={{ fontSize: '11px', color: '#9a8a6a', letterSpacing: '2px', marginBottom: '1.5rem' }}>N° {numero}</p>

      <div ref={previewRef} style={{ padding: '1rem' }}>

        <div className="preview-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '10px', color: '#9a8a6a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Émetteur</p>
            <p style={{ fontSize: '14px', color: '#e8d5a3', marginBottom: '4px' }}>{entreprise.nom || '—'}</p>
            <p style={{ fontSize: '12px', color: '#9a8a6a' }}>{entreprise.email || ''}</p>
            <p style={{ fontSize: '12px', color: '#9a8a6a' }}>{entreprise.adresse || ''}</p>
          </div>

          {entreprise.logo && (
            <img src={entreprise.logo} alt="Logo" style={{ maxHeight: '60px', maxWidth: '120px', objectFit: 'contain' }} />
          )}

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', color: '#9a8a6a', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Client</p>
            <p style={{ fontSize: '14px', color: '#e8d5a3', marginBottom: '4px' }}>{client.nom || '—'}</p>
            <p style={{ fontSize: '12px', color: '#9a8a6a' }}>{client.email || ''}</p>
            <p style={{ fontSize: '12px', color: '#9a8a6a' }}>{client.adresse || ''}</p>
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
              <input type="checkbox" checked={tvaActive} onChange={(e) => setTvaActive(e.target.checked)} />
              <span>Appliquer la TVA</span>
            </label>
            {tvaActive && (
              <div className="tva-input-group">
                <input type="number" value={tauxTva} min="0" max="100" onChange={(e) => setTauxTva(Number(e.target.value))} className="tva-input" />
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

              <div className="signature-wrap">
          <p className="signature-label-text">Signature de l'entreprise</p>
          <div className="signature-canvas-wrap">
            <SignatureCanvas
              ref={sigRef}
              penColor="#e8d5a3"
              canvasProps={{ className: 'signature-canvas' }}
            />
          </div>
          <div className="signature-btns">
            <button className="btn-clear-sig" onClick={() => sigRef.current.clear()}>
              Effacer
            </button>
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