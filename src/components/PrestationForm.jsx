function PrestationForm({ prestations, setPrestations }) {
  function handleChange(index, e) {
    const updated = [...prestations]
    updated[index][e.target.name] = e.target.value
    setPrestations(updated)
  }

  function ajouterPrestation() {
    setPrestations([...prestations, { description: '', quantite: 1, prixUnitaire: 0 }])
  }

  function supprimerPrestation(index) {
    const updated = prestations.filter((_, i) => i !== index)
    setPrestations(updated)
  }

  return (
    <div className="card">
      <h2>Prestations</h2>
      {prestations.map((p, index) => (
        <div className="prestation-row" key={index}>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={p.description}
            onChange={(e) => handleChange(index, e)}
          />
          <input
            type="number"
            name="quantite"
            placeholder="Qté"
            value={p.quantite}
            onChange={(e) => handleChange(index, e)}
          />
          <input
            type="number"
            name="prixUnitaire"
            placeholder="Prix unitaire"
            value={p.prixUnitaire}
            onChange={(e) => handleChange(index, e)}
          />
          <button className="btn-supprimer" onClick={() => supprimerPrestation(index)}>✕</button>
        </div>
      ))}
      <button className="btn-ajouter" onClick={ajouterPrestation}>+ Ajouter une prestation</button>
    </div>
  )
}

export default PrestationForm