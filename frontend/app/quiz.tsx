import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const QUIZ_QUESTIONS = [
  {
    id: 0,
    question: "Would you rather watch a show or play video games?",
    options: ["Watch a show", "Play video games"]
  },
  {
    id: 1,
    question: "Would you rather go skydiving or read at cafes?",
    options: ["Go skydiving", "Read at cafes"]
  },
  {
    id: 2,
    question: "Are you capable of keeping a pet fish alive?",
    options: ["Absolutely", "No way"]
  },
  {
    id: 3,
    question: "Would you rather live in a mystery novel or a superhero movie?",
    options: ["Mystery novel", "Superhero movie"]
  },
  {
    id: 4,
    question: "How do you recharge after a big social event?",
    options: ["Already planning the next one", "Quiet time alone"]
  }
]

export default function QuizScreen() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex]   = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers]             = useState<number[]>([])
  const [submitting, setSubmitting]       = useState(false)
  const [error, setError]                 = useState('')

  const currentQuestion = QUIZ_QUESTIONS[currentIndex]
  const isLastQuestion  = currentIndex === QUIZ_QUESTIONS.length - 1

  const handleNext = async () => {
    if (selectedOption === null) return

    const updatedAnswers = [...answers, selectedOption]
    setAnswers(updatedAnswers)

    if (isLastQuestion) {
      await submitQuiz(updatedAnswers)
    } else {
      // move to next question, clear selection
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
    }
  }

  const submitQuiz = async (finalAnswers: number[]) => {
    setSubmitting(true)
    setError('')

    try {
      const userId = await AsyncStorage.getItem('userId')

      const res = await fetch('http://localhost:3000/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers, userId })
      })

      const data = await res.json()

      if (data.quizAnswers) {
        router.replace('/findEvents')
      } else {
        setError(data.error || 'Something went wrong')
      }

    } catch (err) {
      setError('Could not connect to server. Is your backend running?')
    }

    setSubmitting(false)
  }

  return (
    <View style={styles.container}>

      {/* Progress */}
      <Text style={styles.progress}>
        Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
      </Text>

      {/* Progress bar */}
      <View style={styles.progressBarBackground}>
        <View style={[
          styles.progressBarFill,
          { width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }
        ]} />
      </View>

      {/* Question */}
      <Text style={styles.question}>{currentQuestion.question}</Text>

      {/* Options */}
      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedOption === index && styles.optionSelected
          ]}
          onPress={() => setSelectedOption(index)}
        >
          <Text style={[
            styles.optionText,
            selectedOption === index && styles.optionTextSelected
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Error */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Next / Finish button */}
      <TouchableOpacity
        style={[styles.button, (selectedOption === null || submitting) && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={selectedOption === null || submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? 'Saving...' : isLastQuestion ? 'Finish ✓' : 'Next →'}
        </Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f7f6e6'
  },
  progress: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 8
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 99,
    marginBottom: 40,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#744935',
    borderRadius: 99
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    color: '#222'
  },
  option: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  optionSelected: {
    borderColor: '#744935',
    backgroundColor: '#fff8ee'
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center'
  },
  optionTextSelected: {
    color: '#744935',
    fontWeight: '600'
  },
  button: {
    marginTop: 24,
    backgroundColor: '#744935',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#ddd'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8
  }
})