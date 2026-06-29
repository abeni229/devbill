import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'

export default function DevisScreen() {
  const router = useRouter()

  const [client, setClient] = useState({
    nom: '',
    email: '',
    adresse: '',
  })

  const [prestations, setPrestations] = useState([
    { description: '', quantite: '1', prixUnitaire: '0' }
  ])

  const [tvaActive, setTvaActive] = useState(false)
  const [tauxTva, setTauxTva] = useState('18')

  const sousTotal = prestations.reduce((acc, p) => {
    return acc + Number(p.quantite) * Number(p.prixUnitaire)
  }, 0)

  const tva = tvaActive ? sousTotal * (Number(tauxTva) / 100) : 0
  const total = sousTotal + tva

  function ajouterPrestation() {
    setPrestations([...prestations, { description: '', quantite: '1', prixUnitaire: '0' }])
  }

  function supprimerPrestation(index: number) {
    setPrestations(prestations.filter((_, i) => i !== index))
  }

  function updatePrestation(index: number, field: string, value: string) {
    const updated = [...prestations]
    updated[index] = { ...updated[index], [field]: value }
    setPrestations(updated)
  }

async function exportPDF() {
  if (!client.nom.trim()) {
    alert('Le nom du client est obligatoire.')
    return
  }
  if (!client.email.trim()) {
    alert("L'email du client est obligatoire.")
    return
  }
  const lignes = prestations.map(p => `
    <tr>
      <td>${p.description || '—'}</td>
      <td>${p.quantite}</td>
      <td>${Number(p.prixUnitaire).toLocaleString()} FCFA</td>
      <td>${(Number(p.quantite) * Number(p.prixUnitaire)).toLocaleString()} FCFA</td>
    </tr>
  `).join('')

  const html = `
    <html>
    <head>
      <style>
        body { font-family: Georgia, serif; padding: 40px; color: #1a1209; background: #f5f0e8; }
        h1 { font-size: 32px; letter-spacing: 4px; margin-bottom: 4px; }
        .badge { font-size: 11px; color: #9a8a6a; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 32px; }
        .section { margin-bottom: 24px; }
        .label { font-size: 10px; color: #9a8a6a; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .value { font-size: 14px; margin-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { font-size: 10px; color: #9a8a6a; letter-spacing: 2px; text-transform: uppercase; padding: 8px 0; border-bottom: 1px solid #d4c8a8; text-align: left; }
        td { font-size: 13px; padding: 10px 0; border-bottom: 1px solid #ede8da; }
        .totaux { margin-top: 24px; border-top: 1px solid #d4c8a8; padding-top: 16px; }
        .total-row { display: flex; justify-content: space-between; font-size: 13px; color: #9a8a6a; margin-bottom: 8px; }
        .total-final { display: flex; justify-content: space-between; font-size: 22px; border-top: 1px solid #d4c8a8; padding-top: 12px; margin-top: 8px; }
        .footer { margin-top: 48px; font-size: 11px; color: #9a8a6a; letter-spacing: 2px; text-align: center; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <h1>DevBill</h1>
      <div class="badge">Générateur de devis freelance — Rouky Dev</div>

      <div class="section">
        <div class="label">Client</div>
        <div class="value">${client.nom}</div>
        <div class="value">${client.email}</div>
        <div class="value">${client.adresse || ''}</div>
      </div>

      <div class="section">
        <div class="label">Prestations</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qté</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>${lignes}</tbody>
        </table>
      </div>

      <div class="totaux">
        <div class="total-row"><span>Sous-total</span><span>${sousTotal.toLocaleString()} FCFA</span></div>
        ${tvaActive ? `<div class="total-row"><span>TVA (${tauxTva}%)</span><span>${tva.toLocaleString()} FCFA</span></div>` : ''}
        <div class="total-final"><span>Total</span><span>${total.toLocaleString()} FCFA</span></div>
      </div>

      <div class="footer">DevBill — devbill-five.vercel.app</div>
    </body>
    </html>
  `

  const { uri } = await Print.printToFileAsync({ html })
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf' })
}

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>DevBill</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnRetour}>
          <Text style={styles.btnRetourText}>← Retour</Text>
        </TouchableOpacity>
      </View>

      {/* Client */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>INFORMATIONS CLIENT</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom du client"
          placeholderTextColor="#b0a08a"
          value={client.nom}
          onChangeText={(v) => setClient({ ...client, nom: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#b0a08a"
          value={client.email}
          onChangeText={(v) => setClient({ ...client, email: v })}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse"
          placeholderTextColor="#b0a08a"
          value={client.adresse}
          onChangeText={(v) => setClient({ ...client, adresse: v })}
        />
      </View>

      {/* Prestations */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>PRESTATIONS</Text>
        {prestations.map((p, index) => (
          <View key={index} style={styles.prestationRow}>
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="Description"
              placeholderTextColor="#b0a08a"
              value={p.description}
              onChangeText={(v) => updatePrestation(index, 'description', v)}
            />
            <View style={styles.prestationMeta}>
              <TextInput
                style={[styles.input, styles.inputSmall]}
                placeholder="Qté"
                placeholderTextColor="#b0a08a"
                value={p.quantite}
                onChangeText={(v) => updatePrestation(index, 'quantite', v)}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.inputSmall]}
                placeholder="Prix"
                placeholderTextColor="#b0a08a"
                value={p.prixUnitaire}
                onChangeText={(v) => updatePrestation(index, 'prixUnitaire', v)}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={() => supprimerPrestation(index)} style={styles.btnSupprimer}>
                <Text style={styles.btnSupprimerText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity onPress={ajouterPrestation} style={styles.btnAjouter}>
          <Text style={styles.btnAjouterText}>+ AJOUTER UNE PRESTATION</Text>
        </TouchableOpacity>
      </View>

      {/* Aperçu */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>APERÇU DU DEVIS</Text>

        <Text style={styles.previewLabel}>CLIENT</Text>
        <Text style={styles.previewValue}>{client.nom || '—'}</Text>
        <Text style={styles.previewValue}>{client.email || '—'}</Text>
        <Text style={styles.previewValue}>{client.adresse || '—'}</Text>

        <View style={styles.separator} />

        {prestations.map((p, index) => (
          <View key={index} style={styles.previewRow}>
            <Text style={[styles.previewValue, { flex: 2 }]}>{p.description || '—'}</Text>
            <Text style={styles.previewValue}>{p.quantite}</Text>
            <Text style={styles.previewValue}>{(Number(p.quantite) * Number(p.prixUnitaire)).toLocaleString()} F</Text>
          </View>
        ))}

        <View style={styles.separator} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Sous-total</Text>
          <Text style={styles.totalValue}>{sousTotal.toLocaleString()} FCFA</Text>
        </View>

        {/* TVA */}
        <TouchableOpacity onPress={() => setTvaActive(!tvaActive)} style={styles.tvaToggle}>
          <View style={[styles.checkbox, tvaActive && styles.checkboxActive]} />
          <Text style={styles.tvaLabel}>Appliquer la TVA</Text>
        </TouchableOpacity>

        {tvaActive && (
          <View style={styles.tvaRow}>
            <TextInput
              style={styles.tvaInput}
              value={tauxTva}
              onChangeText={setTauxTva}
              keyboardType="numeric"
            />
            <Text style={styles.tvaLabel}>% → {tva.toLocaleString()} FCFA</Text>
          </View>
        )}

        <View style={styles.totalFinal}>
          <Text style={styles.totalFinalLabel}>Total</Text>
          <Text style={styles.totalFinalValue}>{total.toLocaleString()} FCFA</Text>
        </View>

        <TouchableOpacity style={styles.btnPdf} onPress={exportPDF}>
          <Text style={styles.btnPdfText}>EXPORTER EN PDF</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f5f0e8' },
  content: { padding: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d4c8a8',
    paddingBottom: 16,
  },
  logo: { fontFamily: 'serif', fontSize: 22, color: '#1a1209', letterSpacing: 2 },
  btnRetour: { borderWidth: 0.5, borderColor: '#d4c8a8', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 },
  btnRetourText: { fontSize: 12, color: '#6b5e45', letterSpacing: 1 },

  card: {
    backgroundColor: '#faf7f2',
    borderWidth: 0.5,
    borderColor: '#d4c8a8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 11,
    color: '#1a1209',
    letterSpacing: 2,
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d4c8a8',
    paddingBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#d4c8a8',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#1a1209',
    marginBottom: 10,
  },
  inputSmall: { flex: 1, marginLeft: 8 },

  prestationRow: { marginBottom: 8 },
  prestationMeta: { flexDirection: 'row', alignItems: 'center' },

  btnSupprimer: {
    marginLeft: 8,
    borderWidth: 0.5,
    borderColor: '#d4c8a8',
    borderRadius: 4,
    padding: 12,
  },
  btnSupprimerText: { fontSize: 13, color: '#9a8a6a' },

  btnAjouter: {
    borderWidth: 0.5,
    borderColor: '#c9a96e',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  btnAjouterText: { fontSize: 11, color: '#c9a96e', letterSpacing: 2 },

  previewCard: {
    backgroundColor: '#1a1209',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  previewTitle: { fontSize: 11, color: '#e8d5a3', letterSpacing: 2, marginBottom: 16, borderBottomWidth: 0.5, borderBottomColor: '#3a3020', paddingBottom: 8 },
  previewLabel: { fontSize: 10, color: '#9a8a6a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, marginTop: 12 },
  previewValue: { fontSize: 13, color: '#e8d5a3', marginBottom: 2 },
  separator: { height: 0.5, backgroundColor: '#3a3020', marginVertical: 12 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 13, color: '#9a8a6a' },
  totalValue: { fontSize: 13, color: '#9a8a6a' },

  tvaToggle: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkbox: { width: 16, height: 16, borderWidth: 1, borderColor: '#c9a96e', borderRadius: 3, marginRight: 8 },
  checkboxActive: { backgroundColor: '#c9a96e' },
  tvaLabel: { fontSize: 13, color: '#9a8a6a' },
  tvaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  tvaInput: { backgroundColor: '#2a2010', borderWidth: 0.5, borderColor: '#3a3020', borderRadius: 4, padding: 6, color: '#e8d5a3', width: 50, textAlign: 'center', fontSize: 13 },

  totalFinal: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: '#3a3020', paddingTop: 12, marginTop: 8 },
  totalFinalLabel: { fontFamily: 'serif', fontSize: 20, color: '#e8d5a3' },
  totalFinalValue: { fontFamily: 'serif', fontSize: 20, color: '#e8d5a3' },

  btnPdf: { backgroundColor: '#c9a96e', borderRadius: 4, padding: 14, alignItems: 'center', marginTop: 16 },
  btnPdfText: { color: '#1a1209', fontSize: 12, letterSpacing: 2 },
})