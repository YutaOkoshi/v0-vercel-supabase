"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Task, Emotion, EmotionCount } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

interface TaskContextType {
  tasks: Task[]
  addTask: (content: string) => void
  deleteTask: (id: string) => void
  emotionCounts: EmotionCount
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [emotionCounts, setEmotionCounts] = useState<EmotionCount>({
    happy: 0,
    sad: 0,
    angry: 0,
    neutral: 0,
  })

  // 感情分析のダミー実装
  const analyzeEmotion = (content: string): Emotion => {
    // 簡単なキーワードベースのダミー感情分析
    const text = content.toLowerCase()

    if (text.includes("嬉しい") || text.includes("楽しい") || text.includes("happy")) {
      return "happy"
    } else if (text.includes("悲しい") || text.includes("辛い") || text.includes("sad")) {
      return "sad"
    } else if (text.includes("怒り") || text.includes("イライラ") || text.includes("angry")) {
      return "angry"
    }

    // ランダムに感情を返す（デモンストレーション用）
    const emotions: Emotion[] = ["happy", "sad", "angry", "neutral"]
    return emotions[Math.floor(Math.random() * emotions.length)]

    /* Bedrockを使用した感情分析の実装例（コメントアウト）
    async function analyzeSentiment(text) {
      const bedrock = new AWS.Bedrock();
      const result = await bedrock.invokeLLM({
        modelId: 'amazon.titan-text-express-v1',
        prompt: `以下のテキストの感情を "happy", "sad", "angry", "neutral" のいずれかで分類してください:\n${text}`,
        maxTokens: 10,
      });
      
      // レスポンスから感情を抽出
      const response = result.body.toString();
      // 返却値からemotionタイプに変換するロジックを実装
      // ...
    }
    */
  }

  // タスク追加と感情分析
  const addTask = (content: string) => {
    const emotion = analyzeEmotion(content)
    const newTask: Task = {
      id: uuidv4(),
      content,
      emotion,
      createdAt: new Date(),
    }

    const newTasks = [...tasks, newTask]
    setTasks(newTasks)

    // 感情カウントの更新
    const newCounts = { ...emotionCounts }
    newCounts[emotion]++
    setEmotionCounts(newCounts)

    // Supabaseへの保存（コメントアウト）
    /*
    const saveTaskToSupabase = async (task: Task) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          { 
            id: task.id, 
            content: task.content, 
            emotion: task.emotion, 
            created_at: task.createdAt.toISOString() 
          }
        ]);
      
      if (error) {
        console.error('Error saving task to Supabase:', error);
      }
    }
    
    saveTaskToSupabase(newTask);
    */
  }

  // タスク削除
  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    if (!taskToDelete) return

    const newTasks = tasks.filter((task) => task.id !== id)
    setTasks(newTasks)

    // 感情カウントの更新
    const newCounts = { ...emotionCounts }
    newCounts[taskToDelete.emotion]--
    setEmotionCounts(newCounts)

    // Supabaseからの削除（コメントアウト）
    /*
    const deleteTaskFromSupabase = async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .match({ id });
      
      if (error) {
        console.error('Error deleting task from Supabase:', error);
      }
    }
    
    deleteTaskFromSupabase(id);
    */
  }

  return <TaskContext.Provider value={{ tasks, addTask, deleteTask, emotionCounts }}>{children}</TaskContext.Provider>
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}

