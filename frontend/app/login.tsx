import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const res = await fetch('http://YOUR_IP:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()

    if (data.token) {
      await AsyncStorage.setItem('token', data.token)
      router.replace('/(tabs)/home')
    } else {
      setError(data.error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Baking Bonds! 🍞</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:  { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f7f6e6' },
  title:      { fontSize: 28, fontWeight: '700', marginBottom: 32, textAlign: 'center' },
  input:      { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 },
  button:     { backgroundColor: '#f5a623', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  error:      { color: 'red', marginBottom: 12, textAlign: 'center' },
  link:       { textAlign: 'center', marginTop: 16, color: '#f5a623' }
})