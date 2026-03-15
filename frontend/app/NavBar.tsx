// components/NavBar.tsx
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useRouter, usePathname } from 'expo-router'

const TABS = [
  { label: 'Find Events', icon: '🔍', route: '/findEvents' },
  { label: 'At Event',    icon: '🎉', route: '/RegisteredEvent' },
  { label: 'Bakery',      icon: '🥐', route: '/bakery' },
]

export default function NavBar() {
  const router   = useRouter()
  const pathname = usePathname()

  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isActive = pathname === tab.route
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            onPress={() => router.push(tab.route)}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 24,  // handles iPhone home bar
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4
  },
  icon: {
    fontSize: 22
  },
  label: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500'
  },
  activeLabel: {
    color: '#f5a623',
    fontWeight: '700'
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 99,
    backgroundColor: '#f5a623',
    marginTop: 2
  }
})