import { generateText } from 'ai'

export async function POST(req: Request) {
  const { subject, topic, deadline, studyLevel } = await req.json()

  if (!subject || !topic || !deadline) {
    return Response.json(
      { error: 'Missing required fields' },
      { status: 400 },
    )
  }

  try {
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `You are an expert study planner. Create personalized study schedules and recommendations for students.
When given a subject, topic, and deadline, provide:
1. A recommended study schedule (days and hours per day)
2. Key subtopics to focus on
3. Suggested resources (books, videos, websites)
4. Practice strategies
5. Review schedule

Format your response as JSON with the following structure:
{
  "schedule": [{"day": number, "hours": number, "focus": "string"}],
  "subtopics": ["string"],
  "resources": ["string"],
  "practiceStrategies": ["string"],
  "reviewSchedule": ["string"]
}`,
      prompt: `Create a study plan for:
Subject: ${subject}
Topic: ${topic}
Deadline: ${deadline}
Study Level: ${studyLevel || 'intermediate'}`,
    })

    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/)
      const studyPlan = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(result.text)
      return Response.json(studyPlan)
    } catch {
      return Response.json({
        schedule: [
          { day: 1, hours: 2, focus: 'Overview and foundation' },
          { day: 2, hours: 2.5, focus: 'Core concepts' },
          { day: 3, hours: 2, focus: 'Practice problems' },
          { day: 4, hours: 1.5, focus: 'Review and reinforcement' },
        ],
        subtopics: ['Basic concepts', 'Intermediate applications', 'Advanced problem solving'],
        resources: ['Textbooks', 'Online tutorials', 'Practice tests'],
        practiceStrategies: ['Active recall', 'Spaced repetition', 'Practice problems'],
        reviewSchedule: ['Daily review', 'Weekly comprehensive review', 'Final review day'],
      })
    }
  } catch (error) {
    return Response.json(
      { error: 'Failed to generate study plan' },
      { status: 500 },
    )
  }
}
