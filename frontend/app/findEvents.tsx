// app/findEvents.tsx
import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAllEvents, registerForEvent } from '../lib/api'
import NavBar from './NavBar'

type Event = {
  id: string
  name: string
  date: string
  time: string
  location: string
  organiser: string
  attendees: string[]
}

export default function FindEventsScreen() {
  const [events, setEvents]           = useState<Event[]>([])
  const [userId, setUserId]           = useState<string | null>(null)
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading]         = useState(true)
  const [registering, setRegistering] = useState(false)
  const [message, setMessage]         = useState('')

  // load userId and events on mount
  useEffect(() => {
    const load = async () => {
      const id = await AsyncStorage.getItem('userId')
      setUserId(id)

      const data = await getAllEvents()
      setEvents(Array.isArray(data) ? data : [])

      // get user's already registered events
      const user = await AsyncStorage.getItem('user')
      if (user) {
        const parsed = JSON.parse(user)
        setRegisteredEvents(parsed.registeredEvents ?? [])
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleRegister = async () => {
    if (!userId || !selectedEvent) return
    setRegistering(true)
    setMessage('')

    const result = await registerForEvent(userId, selectedEvent.id)

    if (result.ok) {
      // update local registered list so button updates instantly
      setRegisteredEvents(prev => [...prev, selectedEvent.id])
      setMessage('✅ Registered!')
    } else {
      setMessage(result.data.error ?? '❌ Something went wrong')
    }

    setRegistering(false)
  }

  const isRegistered = (eventId: string) => registeredEvents.includes(eventId)

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

      <Text style={styles.heading}>Find Events 🎉</Text>

      {events.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No events available</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedEvent(item)
                setMessage('')
              }}
            >
              {/* registered badge */}
              {isRegistered(item.id) && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Registered ✓</Text>
                </View>
              )}

              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.detail}>
                <Text style={styles.bold}>📅 </Text>{item.date}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.bold}>🕐 </Text>{item.time}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.bold}>📍 </Text>{item.location}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.bold}>👤 </Text>{item.organiser}
              </Text>
              <Text style={styles.attendees}>
                {item.attendees.length} going
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Event detail modal */}
      <Modal
        visible={selectedEvent !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedEvent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            {selectedEvent && (
              <>
                <Text style={styles.modalTitle}>{selectedEvent.name}</Text>

                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>📅 Date: </Text>{selectedEvent.date}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>🕐 Time: </Text>{selectedEvent.time}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>📍 Location: </Text>{selectedEvent.location}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>👤 Organiser: </Text>{selectedEvent.organiser}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.bold}>👥 Attending: </Text>{selectedEvent.attendees.length} people
                </Text>

                {message ? (
                  <Text style={styles.message}>{message}</Text>
                ) : null}

                {isRegistered(selectedEvent.id) ? (
                  <View style={styles.registeredButton}>
                    <Text style={styles.registeredButtonText}>✓ Already Registered</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.registerButton, registering && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={registering}
                  >
                    <Text style={styles.registerButtonText}>
                      {registering ? 'Registering...' : 'Register for Event'}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedEvent(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

      </Modal>
     <NavBar />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f6e6',
    paddingTop: 20
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    padding: 20,
    paddingBottom: 8, 
    fontFamily: 'RubikBurned'
  },
  list: {
    padding: 20,
    gap: 12
  },
  card: {
    backgroundColor: '#fff4c9',
    borderColor: '#744935',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e6f9f0',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8
  },
  badgeText: {
    color: '#27ae60',
    fontSize: 12,
    fontWeight: '700'
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4
  },
  bold: {
    fontWeight: '700'
  },
  attendees: {
    marginTop: 8,
    fontSize: 13,
    color: '#999'
  },
  emptyText: {
    color: '#999',
    fontSize: 16
  },
  // modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 40
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16
  },
  modalDetail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8
  },
  message: {
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: 12,
    fontSize: 15
  },
  registerButton: {
    backgroundColor: '#f5a623',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  registeredButton: {
    backgroundColor: '#e6f9f0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16
  },
  registeredButtonText: {
    color: '#27ae60',
    fontWeight: '700',
    fontSize: 16
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  closeButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  closeButtonText: {
    color: '#999',
    fontSize: 15
  }
})