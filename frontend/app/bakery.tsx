import { View, Text, StyleSheet } from 'react-native'

export default function BakeryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🥐</Text>
      <Text style={styles.title}>Bakery</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222'
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 8
  }
})