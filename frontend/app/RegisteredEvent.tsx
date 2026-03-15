// app/(tabs)/events.tsx
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEvents, joinEvent } from "../lib/api";
import { router } from "expo-router";

type Event = {
  id: string;
  name: string;
  time: string;
  location: string;
};

export default function EventsScreen() {
  const [events, setEvents]     = useState<Event[]>([]);
  const [codes, setCodes]       = useState<{ [key: string]: string }>({});
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [userId, setUserId]     = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const id = await AsyncStorage.getItem('userId')
      console.log('userId from AsyncStorage:', id)  // ← helpful for debugging
      setUserId(id)
    }
    load()
  }, [])

  useEffect(() => {
    if (!userId) return
    getEvents(userId)
      .then(data => {
        console.log('events data:', data)  // ← helpful for debugging
        setEvents(Array.isArray(data) ? data : [])
      })
      .catch(err => console.error(err))
  }, [userId])

  async function handleJoinEvent(eventId: string) {
    try {
      const result = await joinEvent(eventId, userId ?? '', codes[eventId] ?? '')

      if (!result.ok) {
        setMessages(prev => ({ ...prev, [eventId]: result.data.error ?? '❌ Failed to join' }))
        return
      }

      setMessages(prev => ({ ...prev, [eventId]: `✅ Joined ${result.data.event.name}` }))
    } catch (err) {
      setMessages(prev => ({ ...prev, [eventId]: "❌ Something went wrong" }))
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.heading}>Your Registered Events</Text>

      {events.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No events yet</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.container}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.detail}>
                <Text style={styles.bold}>Time: </Text>{item.time}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.bold}>Location: </Text>{item.location}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter event code"
                placeholderTextColor="#999"
                value={codes[item.id] || ""}
                onChangeText={(text) => setCodes({ ...codes, [item.id]: text })}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleJoinEvent(item.id);}
                }

              >
                <Text style={styles.buttonText}>Join Event</Text>
              </TouchableOpacity>

              {messages[item.id] && (
                <Text style={styles.message}>{messages[item.id]}</Text>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  container: {
    padding: 20,
    gap: 16
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    padding: 20,
    paddingBottom: 0
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#999',
    fontSize: 16
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
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
  input: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    fontSize: 14
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  message: {
    marginTop: 8,
    fontWeight: '700',
    color: '#111'
  }
})