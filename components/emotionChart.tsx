"use client"

import { useTaskContext } from "@/lib/taskContext"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

// Chart.jsの必要なコンポーネントを登録
ChartJS.register(ArcElement, Tooltip, Legend)

export default function EmotionChart() {
  const { emotionCounts } = useTaskContext()

  const data = {
    labels: ["嬉しい", "悲しい", "怒り", "中立"],
    datasets: [
      {
        data: [emotionCounts.happy, emotionCounts.sad, emotionCounts.angry, emotionCounts.neutral],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(201, 203, 207, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
    maintainAspectRatio: true,
  }

  const total = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0)

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[300px]">
        <p className="text-muted-foreground">タスクを追加すると感情分布が表示されます</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  )
}

