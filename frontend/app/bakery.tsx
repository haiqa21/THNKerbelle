import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Progress from 'react-native-progress'
import { Recipe } from '../../backend/interfaces'
import { router } from 'expo-router/build/exports'

const API = 'http://YOUR_IP:3000/bakery'

export default function BakeryScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [message, setMessage] = useState<string>('')
  const [cooking, setCooking] = useState<boolean>(false)

  const progressValue = currentRecipe
    ? (progress + 1) / currentRecipe.steps.length
    : 0

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const token = await AsyncStorage.getItem('token')

      const recipesRes = await fetch(`${API}/recipes`)
      const recipesData: Recipe[] = await recipesRes.json()
      setRecipes(recipesData)

      const currentRes = await fetch(`${API}/currentRecipe`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const currentData = await currentRes.json()
      setCurrentRecipe(currentData.recipe)
      setProgress(currentData.progress ?? 0)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const startRecipe = async (recipeId: number) => {
    const token = await AsyncStorage.getItem('token')

    await fetch(`${API}/startRecipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ recipeId })
    })

    loadData()
  }

  const cookStep = async () => {
    if (!currentRecipe) return

    setCooking(true)

    setTimeout(async () => {
      const token = await AsyncStorage.getItem('token')

      const res = await fetch(`${API}/cook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipeId: currentRecipe.id
        })
      })

      const data = await res.json()
      setMessage(data.message)
      setCooking(false)
      loadData()
    }, 2000)
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          testID="loading-indicator"
          size="large"
          color="#f5a623"
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bakery 🍰</Text>
      {/* go to registerdEvent page*/}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/RegisteredEvent')}> 
        <Text style={styles.buttonText}>Go to Events</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/findEvents')}> 
        <Text style={styles.buttonText}>Go to Events</Text>
      </TouchableOpacity>

      {currentRecipe ? (
        <View style={styles.card}>
          <Text style={styles.recipeTitle}>{currentRecipe.name}</Text>

          <Progress.Bar
            testID="progress-bar"
            progress={progressValue}
            width={null}
            height={10}
            borderRadius={10}
            color="#f5a623"
            style={{ marginBottom: 16 }}
          />

          {currentRecipe.steps.map((step: string, i: number) => (
            <Text
              key={i}
              style={[styles.step, i <= progress && styles.completed]}
            >
              {step}
            </Text>
          ))}

          {cooking ? (
            <Text style={styles.cooking}>Baking in the oven... 🔥</Text>
          ) : (
            <TouchableOpacity style={styles.button} onPress={cookStep}>
              <Text style={styles.buttonText}>Cook Next Step 🍳</Text>
            </TouchableOpacity>
          )}

          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      ) : (
        <>
          <Text style={styles.subtitle}>Choose a Recipe</Text>

          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.recipeTitle}>{item.name}</Text>
                <Text>{item.steps.length} steps</Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => startRecipe(item.id)}
                >
                  <Text style={styles.buttonText}>Start Cooking</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f6e6'
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f7f6e6'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 12
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10
  },
  step: {
    fontSize: 15,
    marginBottom: 4
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888'
  },
  button: {
    backgroundColor: '#f5a623',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700'
  },
  message: {
    marginTop: 10,
    textAlign: 'center'
  },
  cooking: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 12
  }
})
