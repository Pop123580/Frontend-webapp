# LearnAI - Comprehensive AI-Powered Learning Platform

LearnAI is a sophisticated educational technology platform designed specifically for students and learners. It combines four powerful AI-driven tools to enhance the learning experience: Study Planner, Notes Summarizer, Exam Preparation Assistant, and Multi-Language Doubt Solver Chatbot.

##  Features

### 1. **Study Planner & Timetable Generator**
- Intelligently schedule study sessions based on your deadlines and available time
- AI-powered recommendations for optimal study duration and frequency
- Priority-based task management (High, Medium, Low)
- Track completion status of study sessions
- Automatic schedule optimization based on learning patterns

**Use Cases:**
- Plan study sessions for upcoming exams
- Organize revision for multiple subjects
- Create balanced study schedules across different topics

### 2. **Notes Summarizer**
- Extract key points from PDF documents and text content
- AI-powered summarization of academic materials
- Generate concise summaries for quick review
- Identify and highlight important concepts
- Export summaries for offline study

**Use Cases:**
- Quickly summarize lengthy textbook chapters
- Create condensed study notes from lecture materials
- Extract key points from research papers
- Generate study guides from course materials

### 3. **Exam Preparation Assistant**
- Create comprehensive preparation plans for your exams
- Track progress for each topic/syllabus area
- Organize and manage study resources
- Maintain detailed study notes for each exam
- Monitor your readiness level across different topics

**Use Cases:**
- Prepare for final exams across multiple subjects
- Create semester-long study plans
- Track progress toward exam readiness
- Organize reference materials and resources

### 4. **Multi-Language Doubt Solving Chatbot**
- Ask academic questions and receive instant AI-powered explanations
- Get responses in multiple languages (English, Spanish, French, German, Hindi, Mandarin, Japanese)
- Context-aware answers tailored to educational content
- Follow-up question support for deeper understanding
- Example questions to guide your inquiries

**Use Cases:**
- Get clarification on difficult concepts
- Understand problem-solving approaches
- Learn in your preferred language
- Get instant academic support anytime

##  Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Vercel account (for deployment)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd learnai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your API keys:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to access LearnAI

##  User Interface

### Dashboard Overview
The main dashboard provides quick access to all features with:
- Real-time statistics on study sessions, notes, exams, and doubts solved
- Tabbed interface for easy navigation between features
- Mobile-responsive design for learning on-the-go
- Personalized user preferences

### Navigation
- **Overview**: Dashboard with statistics and feature introduction
- **Study Plan**: Access the Study Planner & Timetable Generator
- **Summarizer**: Use the Notes Summarizer feature
- **Exam Prep**: Manage your exam preparation plans
- **Ask AI**: Chat with the Doubt Solving Chatbot

##  Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: Modern UI library
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI component library
- **TypeScript**: Type-safe JavaScript

### Backend & AI
- **Vercel AI SDK v5**: AI integration and streaming
- **OpenAI GPT-4**: Language model for AI features
- **Supabase**: PostgreSQL database with RLS
- **Server Actions**: Next.js server-side functions

### Database Schema
The application uses Supabase PostgreSQL with the following tables:
- `users`: User account information
- `study_sessions`: Study planning and scheduling
- `notes_summaries`: Processed document summaries
- `exam_preparations`: Exam planning and tracking
- `chat_messages`: Chatbot conversation history
- `user_preferences`: User settings and preferences

##  Design System

### Color Palette
- **Primary**: Blue-ish (Educational, trustworthy)
- **Secondary**: Teal/Green (Growth, progress)
- **Accent**: Orange/Warm tones (Engagement)
- **Neutrals**: Professional grays and whites

### Typography
- **Headings**: Geist (Modern, clean)
- **Body**: Geist Sans (Readable, accessible)
- **Mono**: Geist Mono (Code and technical content)

### Responsive Breakpoints
- Mobile-first design approach
- Optimized for: Mobile (320px), Tablet (768px), Desktop (1024px+)

##  Data Persistence

All user data is stored securely in Supabase:
- Study sessions and schedules
- Notes and summaries
- Exam preparation plans
- Chat history
- User preferences and settings

Row Level Security (RLS) ensures data privacy with user-based access control.

##  AI Features

### Study Plan Generation
- Analyzes deadline and topic complexity
- Recommends optimal study schedule
- Suggests study resources
- Provides practice strategies

### Note Summarization
- Processes text and PDF content
- Extracts key concepts
- Generates digestible summaries
- Maintains content structure

### Doubt Solving
- Contextual academic explanations
- Multi-language support
- Interactive Q&A format
- Follow-up question capability

### Exam Preparation
- Intelligent syllabus breakdown
- Progress tracking suggestions
- Resource recommendations
- Personalized study tips

##  Key Metrics & Tracking

- **Study Sessions**: Monitor scheduled and completed sessions
- **Notes Summarized**: Track documents processed
- **Exams Tracked**: Manage multiple exam preparations
- **Doubts Solved**: Record questions answered
- **Overall Progress**: Visual representation of learning journey

##  Security & Privacy

- Secure user authentication via Supabase Auth
- Row-Level Security (RLS) for data protection
- Encrypted data transmission (HTTPS)
- No data sharing with third parties
- GDPR compliant data handling

##  API Endpoints

### Chat
- **POST** `/api/chat` - Send messages to the AI assistant

### Study Planning
- **POST** `/api/generate-study-plan` - Generate study plans based on topic and deadline

### Summarization
- **POST** `/api/summarize` - Summarize text content

##  Browser Support

- Chrome/Chromium (Latest 2 versions)
- Firefox (Latest 2 versions)
- Safari (Latest 2 versions)
- Edge (Latest 2 versions)

##  Usage Examples

### Creating a Study Session
1. Navigate to "Study Plan" tab
2. Click "Add Session"
3. Fill in subject, topic, duration, deadline, and priority
4. AI will provide recommendations
5. Click "Create Session" to save

### Summarizing Notes
1. Go to "Summarizer" tab
2. Choose "Paste Text" or "Upload PDF"
3. Input your content
4. Click "Summarize"
5. Review and copy summary

### Preparing for Exams
1. Navigate to "Exam Prep" tab
2. Click "New Exam"
3. Enter exam details and syllabus
4. Track progress for each topic
5. Add resources and study notes

### Asking Questions
1. Go to "Ask AI" tab
2. Select your preferred language
3. Type your question
4. Review the AI's explanation
5. Ask follow-up questions as needed

##  Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with one click

```bash
npm run build
npm run start
```

##  Troubleshooting

### Chat not responding?
- Check API keys in environment variables
- Verify internet connection
- Clear browser cache

### Data not saving?
- Ensure Supabase connection is active
- Check user authentication status
- Verify database permissions

### Performance issues?
- Clear local storage
- Update browser to latest version
- Check available disk space

##  Support

For issues or feature requests:
1. Check the documentation
2. Review existing GitHub issues
3. Create a new issue with detailed information
4. Contact support team

##  License

This project is licensed under the MIT License - see LICENSE file for details.

##  Acknowledgments

- Vercel AI SDK for AI integration
- shadcn/ui for UI components
- Tailwind CSS for styling
- Supabase for backend services
- OpenAI for language models

##  Future Enhancements

- Voice-based Q&A interaction
- Real-time collaboration features
- Advanced analytics and insights
- Integration with educational platforms
- Mobile app versions
- Offline functionality
- AI-powered personalized learning paths

---

**LearnAI**: Empowering students through intelligent, AI-driven learning tools. Happy studying! 
