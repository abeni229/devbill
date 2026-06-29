function EntrepriseForm({ entreprise, setEntreprise }) {
  function handleChange(e) {
    setEntreprise({ ...entreprise, [e.target.name]: e.target.value })
  }

  function handleLogo(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setEntreprise({ ...entreprise, logo: reader.result })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="card">
      <h2>Votre entreprise</h2>
      <div className="field-group">
        <input
          type="text"
          name="nom"
          placeholder="Nom de l'entreprise"
          value={entreprise.nom}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email de l'entreprise"
          value={entreprise.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="adresse"
          placeholder="Adresse de l'entreprise"
          value={entreprise.adresse}
          onChange={handleChange}
        />
        <div className="logo-upload">
          <label className="logo-label">
            Logo (optionnel)
            <input
              type="file"
              accept="image/*"
              onChange={handleLogo}
              style={{ display: 'none' }}
            />
          </label>
          {entreprise.logo && (
            <img src={entreprise.logo} alt="Logo" className="logo-preview" />
          )}
        </div>
      </div>
    </div>
  )
}

export default EntrepriseForm