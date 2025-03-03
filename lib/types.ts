export type Emotion = "happy" | "sad" | "angry" | "neutral"

export interface Task {
  id: string
  content: string
  emotion: Emotion
  createdAt: Date
}

export interface EmotionCount {
  happy: number
  sad: number
  angry: number
  neutral: number
}

