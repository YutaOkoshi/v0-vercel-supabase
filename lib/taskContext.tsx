"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Task, Emotion, EmotionCount } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface TaskContextType {
  tasks: Task[]
  addTask: (content: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  emotionCounts: EmotionCount
  isLoading: boolean
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const emotionCounts = tasks.reduce(
    (acc, task) => {
      acc[task.emotion]++
      return acc
    },
    { happy: 0, sad: 0, angry: 0, neutral: 0 } as EmotionCount
  )

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setTasks(data.map(task => ({
        ...task,
        createdAt: new Date(task.created_at)
      })))
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "エラー",
        description: "タスクの取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function addTask(content: string) {
    try {
      // ランダムな感情を選択
      const emotions: Emotion[] = ["happy", "sad", "angry", "neutral"]
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]

      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            content,
            emotion: randomEmotion,
          },
        ])
        .select()
        .single()

      if (error) throw error

      const newTask: Task = {
        ...data,
        createdAt: new Date(data.created_at)
      }

      setTasks(prev => [newTask, ...prev])
      toast({
        title: "成功",
        description: "タスクを追加しました",
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "エラー",
        description: "タスクの追加に失敗しました",
        variant: "destructive",
      })
    }
  }

  async function deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)

      if (error) throw error

      setTasks(prev => prev.filter(task => task.id !== id))
      toast({
        title: "成功",
        description: "タスクを削除しました",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "エラー",
        description: "タスクの削除に失敗しました",
        variant: "destructive",
      })
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        emotionCounts,
        isLoading
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}

