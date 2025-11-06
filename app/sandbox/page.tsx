import DashboardPageLayout from "@/components/dashboard/layout"
import EmailIcon from "@/components/icons/email"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"

export default function SandboxPage() {
  const challenges = [
    { title: "Find Array Duplicate", difficulty: "Easy", xp: 50, solved: true },
    { title: "Reverse String", difficulty: "Easy", xp: 50, solved: true },
    { title: "Check Palindrome", difficulty: "Medium", xp: 100, solved: false },
    { title: "Two Sum Problem", difficulty: "Medium", xp: 100, solved: false },
    { title: "Binary Search Implementation", difficulty: "Hard", xp: 200, solved: false },
  ]

  return (
    <DashboardPageLayout
      header={{
        title: "Sandbox",
        description: "Practice debugging with interactive challenges and challenges",
        icon: EmailIcon,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {challenges.map((challenge, idx) => (
            <Card key={idx} className="ring-2 ring-pop">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm mb-1">{challenge.title}</CardTitle>
                    <div className="flex gap-2 items-center">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          challenge.difficulty === "Easy"
                            ? "bg-green-500/20 text-green-400"
                            : challenge.difficulty === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-blue-400">+{challenge.xp} XP</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {challenge.solved ? (
                      <span className="text-green-400 text-sm font-bold">✓ Solved</span>
                    ) : (
                      <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                        Start
                      </button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-accent">
                <p className="text-xs text-foreground/60">Debug and fix the buggy code provided</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-3">
              <div>
                <p className="text-xs text-foreground/60 uppercase mb-1">Total Solved</p>
                <p className="text-2xl font-bold text-green-400">12/47</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 uppercase mb-1">XP Earned</p>
                <p className="text-2xl font-bold text-blue-400">850</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 uppercase mb-1">Win Streak</p>
                <p className="text-2xl font-bold text-yellow-400">3</p>
              </div>
            </CardContent>
          </Card>

          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Difficulty Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-green-400">Easy: 5/15</span>
                <div className="h-2 bg-background rounded w-20 overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "33%" }}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-yellow-400">Medium: 5/20</span>
                <div className="h-2 bg-background rounded w-20 overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: "25%" }}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-red-400">Hard: 2/12</span>
                <div className="h-2 bg-background rounded w-20 overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: "17%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
