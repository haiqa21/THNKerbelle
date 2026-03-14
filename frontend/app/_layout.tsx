import { useEffect, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    AsyncStorage.getItem('token').then(t => {
      setToken(t)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (loading) return
    const inAuthScreen = segments[0] === 'login' || segments[0] === 'register'
    if (!token && !inAuthScreen) router.replace('/login')
    if (token && inAuthScreen) router.replace('/(tabs)/home')
  }, [token, loading])

  return <Slot />
}