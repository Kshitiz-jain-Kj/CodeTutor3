import type { CodeAnalysisRequest, ErrorAnalysis } from "@/lib/types/error-analysis"

const GEMINI_API_KEY = "AIzaSyDFlKPBXDUbo-unO6yy6m5vPB4Qc683iCk"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export async function POST(request: Request) {
  try {
    const body: CodeAnalysisRequest = await request.json()
    const { code, language, errorMessage } = body

    if (!code || !language) {
      return Response.json({ error: "Code and language are required" }, { status: 400 })
    }

    const prompt = `You are an expert code debugger. Analyze this ${language} code and provide a detailed analysis.

Code:
\`\`\`${language}
${code}
\`\`\`

${errorMessage ? `Error Message: ${errorMessage}` : ""}

Provide your analysis in the following JSON format (keep all text brief to fit UI layout):
{
  "errorType": "Brief error title (max 60 chars) or 'No Errors Found' if code is correct",
  "severity": "critical" | "warning" | "info",
  "rootCause": "Brief root cause explanation (max 100 chars). If no errors, write 'Code is syntactically correct and performs as expected.'",
  "explanationEnglish": "Brief explanation in English (max 150 chars). If no errors, explain what the code does.",
  "explanationHindi": "Brief explanation in Hindi (max 150 chars). If no errors, explain what the code does in Hindi.",
  "fixedCode": "The corrected code or improved version. If no errors, return the same code or suggest minor improvements.",
  "fixExplanation": "Brief fix explanation (max 100 chars). If no errors, write 'No fixes needed' or suggest improvements.",
  "complexity": "Low" | "Medium" | "High",
  "confidence": 85-99 (number),
  "alternatives": [
    {
      "title": "Brief title (max 30 chars)",
      "code": "Alternative code solution or improvement",
      "description": "Brief description (max 80 chars)"
    }
  ] (provide 3 alternatives or improvements),
  "variableSnapshot": {
    "variableName": "value or 'N/A' if no variables"
  } (extract actual variables from the code with their values. If code has no variables like print("Hello"), return empty object {}),
  "learningResources": [
    {"title": "Resource title (max 40 chars)", "url": "#"}
  ] (provide 3 resources relevant to the code language and concepts used),
  "learningTip": "Brief learning tip (max 120 chars) relevant to the code or language"
}

Important: 
- Keep ALL text brief to maintain UI layout
- If code has NO errors, set errorType to "No Errors Found" and rootCause to "Code is syntactically correct and performs as expected."
- For variableSnapshot, extract ACTUAL variables from the code. If code is "print('Hello')", return empty object {} since there are no variables
- Make learning resources and tips relevant to the actual code provided`

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Gemini API error:", errorData)
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      throw new Error("No response from Gemini API")
    }

    // Parse JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response")
    }

    const aiAnalysis = JSON.parse(jsonMatch[0])

    // Extract variable snapshot from code or use AI's snapshot
    const variableSnapshot = aiAnalysis.variableSnapshot || extractVariableSnapshot(code, language)

    const analysis: ErrorAnalysis = {
      errorType: aiAnalysis.errorType,
      severity: aiAnalysis.severity,
      explanation: {
        english: aiAnalysis.explanationEnglish,
        hindi: aiAnalysis.explanationHindi,
      },
      rootCause: aiAnalysis.rootCause,
      suggestedFix: {
        code: aiAnalysis.fixedCode,
        explanation: aiAnalysis.fixExplanation,
      },
      complexity: aiAnalysis.complexity !== "Low" ? `Complexity: ${aiAnalysis.complexity}` : null,
      confidence: aiAnalysis.confidence,
      alternatives: aiAnalysis.alternatives,
      variableSnapshot: Object.keys(variableSnapshot).length > 0 ? variableSnapshot : undefined,
      learningResources: aiAnalysis.learningResources,
      learningTip: aiAnalysis.learningTip,
    }

    return Response.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("[v0] Error analyzing code:", error)
    return Response.json(
      { error: "Failed to analyze code", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

function extractVariableSnapshot(code: string, language: string): Record<string, string> {
  const snapshot: Record<string, string> = {}

  if (language === "python") {
    const varMatches = code.matchAll(/(\w+)\s*=\s*([^=\n]+)/g)
    for (const match of varMatches) {
      snapshot[match[1]] = match[2].trim()
    }
  } else if (language === "javascript" || language === "typescript") {
    const varMatches = code.matchAll(/(?:let|const|var)\s+(\w+)\s*=\s*([^;\n]+)/g)
    for (const match of varMatches) {
      snapshot[match[1]] = match[2].trim()
    }
  }

  return snapshot
}
