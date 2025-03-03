"use client"

import { TaskProvider } from "@/lib/taskContext"
import TaskList from "@/components/taskList"
import TaskForm from "@/components/taskForm"
import EmotionChart from "@/components/emotionChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/modeToggle"

export default function Dashboard() {
  return (
    <TaskProvider>
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">感情分析タスク管理</h1>
          <ModeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>タスク一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskForm />
                <div className="mt-6">
                  <TaskList />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>感情分布</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <EmotionChart />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TaskProvider>
  )
}

