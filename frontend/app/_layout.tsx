import { useEffect, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFonts, RubikBurned_400Regular } from '@expo-google-fonts/rubik-burned'
import { View, ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const segments = useSegments()

  const [fontsLoaded] = useFonts({
    RubikBurned: RubikBurned_400Regular
  })

  useEffect(() => {
    AsyncStorage.getItem('token').then(t => {
      setToken(t)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (loading) return
    const inAuthScreen = segments?.[0] === 'login' || segments?.[0] === 'register'
    if (!token && !inAuthScreen) router.replace('/login')
    if (token && inAuthScreen) router.replace('/(tabs)/home')
  }, [token, loading])

  return <Slot />
}