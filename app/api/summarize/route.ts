import { generateText } from 'ai'

export async function POST(req: Request) {
  const { content } = await req.json()

  if (!content) {
    return Response.json(
      { error: 'Missing content' },
      { status: 400 },
    )
  }

  try {
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `You are an expert at summarizing academic content. When given text, provide:
1. A concise summary (2-3 sentences capturing the main idea)
2. Key points (bullet list of 3-5 most important concepts)
3. Study tips relevant to the content

Format your response as JSON with this structure:
{
  "summary": "string",
  "keyPoints": ["string"],
  "studyTips": ["string"]
}`,
      prompt: `Summarize this academic content:\n\n${content.substring(0, 5000)}`,
    })

    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/)
      const summary = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(result.text)
      return Response.json(summary)
    } catch {
      const sentences = content.split('.').slice(0, 3).join('. ')
      return Response.json({
        summary: sentences || 'Summary of the provided content',
        keyPoints: [
          'Main concept from the text',
          'Supporting details and examples',
          'Practical applications and takeaways',
        ],
        studyTips: [
          'Read through the content once for overview',
          'Highlight key concepts and definitions',
          'Practice problems related to the topic',
        ],
      })
    }
  } catch (error) {
    return Response.json(
      { error: 'Failed to summarize content' },
      { status: 500 },
    )
  }
}
