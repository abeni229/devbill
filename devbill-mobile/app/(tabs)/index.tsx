import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

export default function HomeScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>FREELANCE TOOL</Text>
      <Text style={styles.title}>Vos devis,{'\n'}à votre image.</Text>
      <Text style={styles.subtitle}>
        Professionnel, rapide et exportable en PDF.{'\n'}
        Créez vos devis en quelques clics.
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/devis')}>
        <Text style={styles.btnText}>CRÉER UN DEVIS →</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>DevBill — Rouky Dev</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  badge: {
    backgroundColor: '#2e2010',
    color: '#c9a96e',
    fontSize: 11,
    letterSpacing: 3,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 2,
    marginBottom: 32,
    overflow: 'hidden',
  },
  title: {
    fontFamily: 'serif',
    fontSize: 38,
    color: '#1a1209',
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b5e45',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  btn: {
    backgroundColor: '#1a1209',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 4,
    marginBottom: 40,
  },
  btnText: {
    color: '#e8d5a3',
    fontSize: 13,
    letterSpacing: 2,
  },
  footer: {
    fontSize: 11,
    color: '#9a8a6a',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
})