"use client"

import type React from "react"

import { useState } from "react"
import { useTaskContext } from "@/lib/taskContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export default function TaskForm() {
  const [content, setContent] = useState("")
  const { addTask } = useTaskContext()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && content.length <= 140) {
      addTask(content.trim())
      setContent("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="新しいタスクを入力（140文字まで）"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={140}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!content.trim() || content.length > 140}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground text-right">{content.length}/140文字</div>
    </form>
  )
}

