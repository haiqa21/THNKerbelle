import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')

    try {
      // Step 1 — send email + password to your backend
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      // data is now { message: 'Login successful', user: { id, name } }
      // OR          { error: 'Invalid credentials' }

      if (data.user) {
        // Step 2 — save user to AsyncStorage so other screens can access it
        await AsyncStorage.setItem('userId', data.user.id)
        await AsyncStorage.setItem('userName', data.user.name)
        await AsyncStorage.setItem('user', JSON.stringify(data.user))

        // Step 3 — navigate to home
        router.replace('/findEvents')
      } else {
        setError(data.error || 'Something went wrong')
      }

    } catch (err) {
      // network error — backend probably not running
      setError('Could not connect to server. Is your backend running?')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WELCOME TO {'\n'} BAKING BONDS! 🍞</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#F2E6B3" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#F2E6B3" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
      <Image
      source={require('../assets/ducks-icon.png')}  // local file
      style={styles.bottomImage}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:  { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F2E6B3' },
  title:      { fontSize: 28, fontWeight: '700', marginBottom: 32, textAlign: 'center', fontFamily: 'RubikBurned', color: '#744935' },
  input:      { color: '#fff', borderWidth: 1.5, borderColor: '#744935', borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16, backgroundColor: '#b16e4f' },
  button:     { backgroundColor: '#744935', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  error:      { color: 'red', marginBottom: 12, textAlign: 'center' },
  link:       { textAlign: 'center', marginTop: 16, color: '#744935' },
  bottomImage:{ width: 320, height: 200, alignSelf: 'center'}
})

function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.')
}
