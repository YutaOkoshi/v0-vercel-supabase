"use client"

import { useTaskContext } from "@/lib/taskContext"
import type { Task } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function TaskList() {
  const { tasks, deleteTask, isLoading } = useTaskContext()

  const getEmotionLabel = (emotion: Task["emotion"]) => {
    const labels = {
      happy: "嬉しい",
      sad: "悲しい",
      angry: "怒り",
      neutral: "中立",
    }
    return labels[emotion]
  }

  const getEmotionColor = (emotion: Task["emotion"]) => {
    const colors = {
      happy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      sad: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      angry: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    }
    return colors[emotion]
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">読み込み中...</div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">タスクがありません。新しいタスクを追加してください。</div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="relative group">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-2">
                <p className="break-words">{task.content}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="outline" className={getEmotionColor(task.emotion)}>
                    {getEmotionLabel(task.emotion)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(task.createdAt, { addSuffix: true, locale: ja })}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="タスクを削除"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

