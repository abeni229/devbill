function ClientForm({ client, setClient }) {
  function handleChange(e) {
    setClient({ ...client, [e.target.name]: e.target.value })
  }

  return (
    <div className="card">
      <h2>Informations client</h2>
      <div className="field-group">
        <input
          type="text"
          name="nom"
          placeholder="Nom du client"
          value={client.nom}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={client.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="adresse"
          placeholder="Adresse"
          value={client.adresse}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default ClientForm