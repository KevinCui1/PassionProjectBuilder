# Passion Projects Website

A modern web application that helps users discover personalized extracurricular activities and passion projects based on their interests, goals, and circumstances.

## Features

- **Beautiful, responsive UI** built with React, TypeScript, and Tailwind CSS
- **Comprehensive user input form** collecting interests, academic strengths, career goals, and preferences
- **Personalized recommendations** based on user data
- **Detailed project information** including time commitment, cost, difficulty, benefits, and next steps
- **Modern design** with gradients, animations, and professional styling

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js 14 (API Routes)
- **Styling:** Tailwind CSS with custom gradients and animations
- **State Management:** React hooks (useState, useEffect)
- **Routing:** Next.js App Router

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd passion-projects
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
passion-projects/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main landing page with form
│   │   ├── results/
│   │   │   └── page.tsx          # Results page displaying recommendations
│   │   ├── api/
│   │   │   └── recommendations/
│   │   │       └── route.ts      # API endpoint for generating recommendations
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   └── ...
├── public/                        # Static assets
├── package.json
└── README.md
```

## How It Works

1. **User Input:** Users fill out a comprehensive form with their:
   - Personal information (age, grade level)
   - Academic strengths and weaknesses
   - Career/college goals
   - Interests and hobbies
   - Time availability and budget constraints
   - Location

2. **Recommendation Generation:** The form data is sent to the API endpoint which:
   - Currently uses mock data with personalized recommendations
   - Can be easily extended to integrate with LLM APIs (OpenAI, Gemini, etc.)

3. **Results Display:** Users see detailed recommendations including:
   - Project title and description
   - Category and difficulty level
   - Time commitment and cost
   - Key benefits and next steps

## Adding LLM Integration

To integrate with an actual LLM API (like OpenAI), modify the `generateMockRecommendations` function in `src/app/api/recommendations/route.ts`:

```typescript
// Example OpenAI integration
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateLLMRecommendations(userData: any) {
  const prompt = `Based on the following user information, suggest 5 personalized passion project extracurricular activities:

User Data:
- Age: ${userData.age}
- Grade: ${userData.grade}
- Interests: ${userData.interests}
- Academic Strengths: ${userData.academicStrengths}
- Career Goals: ${userData.careerGoals}
- Time Availability: ${userData.timeAvailability}
- Budget: ${userData.budget}
- Location: ${userData.location}

Please provide recommendations in JSON format with the following structure for each recommendation:
{
  "title": "Project Title",
  "description": "Detailed description",
  "category": "Category",
  "timeCommitment": "Time requirement",
  "cost": "Cost information",
  "difficulty": "Difficulty level",
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(completion.choices[0].message.content);
}
```

## Customization

### Adding New Form Fields

1. Update the form state in `src/app/page.tsx`
2. Add the corresponding input field
3. Update the API route to handle the new data
4. Modify the recommendation logic to use the new information

### Styling Changes

The project uses Tailwind CSS. You can:
- Modify colors in `tailwind.config.js`
- Add custom CSS in `src/app/globals.css`
- Update component classes for different styling

### Adding New Recommendation Categories

1. Update the `generateMockRecommendations` function
2. Add new recommendation objects with the required structure
3. Add conditional logic based on user input

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS
- Google Cloud Platform
- DigitalOcean

## Environment Variables

Create a `.env.local` file for any API keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Future Enhancements

- [ ] Add user accounts and save recommendations
- [ ] Integrate with real LLM APIs
- [ ] Add recommendation filtering and sorting
- [ ] Include project templates and resources
- [ ] Add progress tracking for started projects
- [ ] Implement social features (sharing, collaboration)
- [ ] Add mobile app version
- [ ] Include video tutorials and guides
