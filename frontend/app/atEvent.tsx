// app/atEvent.tsx
import { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams } from 'expo-router'
import NavBar from './NavBar'

type Person = {
  id: string
  name: string
  bio: string
  matchScore: number
}

export default function AtEventScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>()
  const [people, setPeople]   = useState<Person[]>([])
  const [userId, setUserId]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // step 1 — load userId into state
  useEffect(() => {
    const load = async () => {
      const id = await AsyncStorage.getItem('userId')
      setUserId(id)
    }
    load()
  }, [])

  // step 2 — fetch people once userId is ready
  useEffect(() => {
    if (!userId || !eventId) return

    fetch(`http://localhost:3000/events/${eventId}/registeredEnterance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        setPeople(Array.isArray(data.people) ? data.people : [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [userId])

  const scores = people.map(p => p.matchScore)
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0
  const minScore = scores.length > 0 ? Math.min(...scores) : 0

  const getBadge = (score: number) => {
    if (score === maxScore) return { label: '🔥 Best match',  bg: '#dcfce7', color: '#16a34a' }
    if (score === minScore) return { label: '👋 Say hi',      bg: '#f5f5f5', color: '#777' }
    return                         { label: '👍 Good match',  bg: '#fff3e0', color: '#f97316' }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f5a623" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.heading}>People at this Event 👋</Text>
      <Text style={styles.subheading}>Sorted by compatibility with you</Text>

      {people.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No one else here yet!</Text>
        </View>
      ) : (
        <FlatList
          data={people}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const badge = getBadge(item.matchScore)
            return (
              <View style={[styles.card, { borderLeftColor: badge.color }]}>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.color }]}>
                    {badge.label}
                  </Text>
                </View>
                <Text style={styles.name}>{item.name}</Text>
                {item.bio ? (
                  <Text style={styles.bio}>{item.bio}</Text>
                ) : null}
                <Text style={styles.score}>
                  {item.matchScore} / 5 answers match
                </Text>
                
              </View>
            )
          }}
        />
      )}
      <NavBar />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f6e6'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    paddingHorizontal: 20,
    paddingTop: 16, 
    fontFamily: 'RubikBurned'
  },
  subheading: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 4
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff4c9',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700'
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  score: {
    fontSize: 13,
    color: '#999',
    marginTop: 4
  },
  emptyText: {
    color: '#999',
    fontSize: 16
  }
})