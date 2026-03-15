// app/register.tsx
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function RegisterScreen() {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio]           = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setError('')

    try {
      // Step 1 — send name, email, password, bio to your backend
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, bio })
      })

      const data = await res.json()
      // data is now { message: 'Registered', userId: '...' }
      // OR          { error: 'Email exists' }
      // OR          { error: 'Missing fields' }

      if (data.userId) {
        // Step 2 — save userId and name to AsyncStorage
        await AsyncStorage.setItem('userId', data.userId)
        await AsyncStorage.setItem('userName', name)

        // Step 3 — go to quiz (first time setup)
        router.replace('/quiz')
      } else {
        setError(data.error || 'Something went wrong')
      }

    } catch (err) {
      setError('Could not connect to server. Is your backend running?')
    }

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 🥐</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#a96f55"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#a96f55"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#a96f55"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Bio (optional)"
        placeholderTextColor="#a96f55"
        value={bio}
        onChangeText={setBio}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating account...' : 'Register'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F2E6B3'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#744935',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16
  },
  button: {
    backgroundColor: '#744935',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center'
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: '#744935'
  }
})
