# LearnAI - Getting Started Guide

Welcome to LearnAI! This guide will help you get up and running in minutes.

## 📚 What is LearnAI?

LearnAI is a comprehensive AI-powered learning platform that combines four intelligent features:

1. **Study Planner** - Intelligently schedule study sessions
2. **Notes Summarizer** - Extract key points from documents
3. **Exam Prep Assistant** - Track exam preparation progress
4. **Doubt Chatbot** - Ask questions in multiple languages

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Run the App
```bash
npm run dev
```

Visit `http://localhost:3000` and start learning!

## 🔐 Getting Credentials

### From Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy `Project URL` and `Anon Key`
5. Copy `Service Role Key` from same location

### Setting Up Database
1. In Supabase, go to SQL Editor
2. Paste content from `/scripts/setup-db.sql`
3. Click "Run" to create tables

## 🎯 Using Each Feature

### Study Planner
1. Go to "Study Plan" tab
2. Click "Add Session"
3. Fill in subject, topic, deadline
4. Set priority level
5. Click "Create Session"
6. Track completion status

### Notes Summarizer
1. Go to "Summarizer" tab
2. Choose "Paste Text" or "Upload PDF"
3. Paste your content
4. Click "Summarize"
5. Copy summary to your notes

### Exam Prep
1. Go to "Exam Prep" tab
2. Click "New Exam"
3. Enter exam details
4. Add topics from syllabus
5. Track progress with sliders
6. Add resources and notes

### Doubt Chatbot
1. Go to "Ask AI" tab
2. Select response language
3. Type your question
4. Get instant AI answer
5. Copy answer if needed

## 📁 File Structure Overview

```
learnai/
├── components/          # React components
│   ├── study-planner.tsx
│   ├── notes-summarizer.tsx
│   ├── exam-prep-assistant.tsx
│   └── doubt-chatbot.tsx
├── app/
│   ├── page.tsx        # Dashboard
│   ├── globals.css     # Styling
│   └── api/            # Backend APIs
└── docs/
    ├── README.md       # Full guide
    ├── INTEGRATION_GUIDE.md
    └── DEPLOYMENT.md
```

## 🚀 Deploy to Production

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOU/learnai
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Add environment variables
   - Click "Deploy"

3. **Your app is live!** 🎉

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps.

## 🎨 Customization

### Change Colors
Edit `/app/globals.css`:
```css
--primary: oklch(0.52 0.22 254.8); /* Blue */
--secondary: oklch(0.72 0.18 160.2); /* Teal */
--accent: oklch(0.65 0.2 48.8); /* Orange */
```

### Add New Feature
1. Create component in `/components`
2. Add it to dashboard tabs
3. Create API route if needed
4. Add to navigation

### Change AI Model
Edit `/app/api/chat/route.ts`:
```typescript
model: 'openai/gpt-4o' // Change this
```

## 🔧 Environment Setup

### Required Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key

### Optional Variables
- `NEXT_PUBLIC_API_URL` - Custom API URL

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Feature overview & usage |
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | Technical details & setup |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment |
| [DEVELOPER_REFERENCE.md](./DEVELOPER_REFERENCE.md) | Code reference |
| [FEATURES_CHECKLIST.md](./FEATURES_CHECKLIST.md) | Complete feature list |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Project overview |

## ❓ Troubleshooting

### App Won't Start
```
Error: Cannot find module
→ Run: npm install

Error: Environment variables not set
→ Create .env.local with required variables

Error: Port 3000 in use
→ Run: npm run dev -- -p 3001
```

### Database Connection Failed
```
Check:
1. Supabase URL is correct
2. API keys are valid
3. Tables are created (run SQL script)
4. Network connection
```

### Chat Not Working
```
Check:
1. Internet connection
2. API key availability
3. Supabase is running
4. Check browser console
```

## 💡 Tips for Success

1. **Start Simple** - Get the basics working first
2. **Customize Gradually** - Add features slowly
3. **Test Locally** - Ensure everything works locally before deploying
4. **Check Logs** - Monitor Vercel logs for errors
5. **Read Documentation** - Refer to docs when stuck

## 🎓 Learning Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Guides](https://supabase.com/docs)
- [AI SDK Guide](https://sdk.vercel.ai)

## 🆘 Need Help?

1. **Check the docs** - Most issues covered in documentation
2. **Review examples** - Look at component examples
3. **Check the logs** - Server and client logs help debug
4. **Google the error** - Most errors have solutions online
5. **Ask AI** - Use the Doubt Chatbot! 😊

## ✨ Quick Features Summary

| Feature | What It Does |
|---------|-------------|
| Study Planner | Schedule study sessions intelligently |
| Notes Summarizer | Extract key points automatically |
| Exam Prep | Track exam preparation progress |
| Doubt Chatbot | Ask questions in 7 languages |

## 🔐 Security Notes

- Never commit `.env.local` to GitHub
- Keep API keys confidential
- Use environment variables for secrets
- Enable RLS on database tables
- Always validate user input

## 📊 What You Get

✅ **Complete Application**
- 4 AI-powered features
- Professional UI
- Responsive design
- Dark mode support

✅ **Production Ready**
- Security best practices
- Error handling
- Performance optimized
- Documentation complete

✅ **Easy to Deploy**
- One-click Vercel deployment
- Database ready
- APIs configured
- Monitoring setup

## 🚀 Next Steps

1. **Get it running locally** (5 min)
   ```bash
   npm install
   npm run dev
   ```

2. **Set up database** (5 min)
   - Create Supabase project
   - Run setup SQL
   - Add environment variables

3. **Customize** (optional)
   - Change colors
   - Add features
   - Modify content

4. **Deploy** (5 min)
   - Push to GitHub
   - Connect to Vercel
   - Add variables
   - Deploy!

## 📞 Support

- **Documentation**: See docs folder
- **Code Examples**: Check `/components` folder
- **API Reference**: See `/DEVELOPER_REFERENCE.md`
- **Troubleshooting**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎉 You're Ready!

Everything is set up and ready to go. Start with the Quick Start section above and you'll have LearnAI running in minutes!

**Happy Learning! 📚✨**

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Status:** Production Ready ✅

For detailed information, see [README.md](./README.md) or [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
