"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import BracketsIcon from "@/components/icons/brackets"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { useState } from "react"
import { LanguageSelector } from "@/components/codetutor/language-selector"
import type { SupportedLanguage } from "@/lib/types/codetutor"

export default function CodeEditorPage() {
  const [code, setCode] = useState(`function findMax(arr) {
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max)
      max = arr[i];
  }
  return max;
}

console.log(findMax([1, 5, 3]));`)

  const [language, setLanguage] = useState<SupportedLanguage>("javascript")

  return (
    <DashboardPageLayout
      header={{
        title: "Code Editor",
        description: "Write, debug, and analyze code with AI-powered insights",
        icon: BracketsIcon,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                  <Bullet />
                  Code Editor
                </CardTitle>
                <LanguageSelector value={language} onChange={setLanguage} />
              </div>
            </CardHeader>
            <CardContent className="bg-accent">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm bg-background border border-pop rounded resize-none focus:outline-none focus:ring-2 focus:ring-pop"
                spellCheck="false"
              />
              <div className="flex gap-3 mt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
                  Run Code
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">
                  Analyze
                </button>
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold">
                  Debug
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-3">
              <div className="p-3 bg-background border border-pop rounded">
                <p className="text-xs text-foreground/60 uppercase mb-1">Code Quality</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-sm font-bold">85%</span>
                </div>
              </div>
              <div className="p-3 bg-background border border-pop rounded">
                <p className="text-xs text-foreground/60 uppercase mb-2">Issues Found</p>
                <ul className="space-y-1 text-xs">
                  <li className="text-yellow-400">⚠ Unused variable: i</li>
                  <li className="text-red-400">✕ Missing error handling</li>
                  <li className="text-blue-400">ℹ Consider using spread operator</li>
                </ul>
              </div>
              <div className="p-3 bg-background border border-pop rounded">
                <p className="text-xs text-foreground/60 uppercase mb-1">Complexity</p>
                <p className="text-sm font-bold">O(n) - Linear</p>
              </div>
            </CardContent>
          </Card>

          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-background border border-pop rounded hover:bg-accent-active text-left">
                Format Code
              </button>
              <button className="w-full px-3 py-2 text-sm bg-background border border-pop rounded hover:bg-accent-active text-left">
                Upload File
              </button>
              <button className="w-full px-3 py-2 text-sm bg-background border border-pop rounded hover:bg-accent-active text-left">
                Save Snippet
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
