import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Generate simple mock recommendations
    const recommendations = generateMockRecommendations(formData);
    
    return NextResponse.json({ 
      success: true, 
      recommendations 
    });
  } catch (error) {
    console.error('Error processing recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process recommendations' },
      { status: 500 }
    );
  }
}

function generateMockRecommendations(userData: any) {
  const { name, age, grade, interests, academicStrengths, careerGoals, timeAvailability, location, budget } = userData;
  
  return [
    {
      title: "Personal Interest Project",
      description: `Create a project that combines your academic strengths (${academicStrengths}) with your personal interests (${interests}). This could be a research project, creative work, or community initiative.`,
      category: "Passion Project",
      timeCommitment: "4-6 hours/week",
      cost: "Free to Low cost",
      difficulty: "Beginner to Intermediate",
      benefits: ["Personalized to your interests", "Shows initiative", "Great for college applications"],
      nextSteps: ["Identify your project focus", "Plan your approach", "Begin implementation"],
      format: "Personal Project"
    },
    {
      title: "Academic Club",
      description: `Join a club related to your academic strengths (${academicStrengths}) to deepen your knowledge and connect with peers who share your interests.`,
      category: "School Club",
      timeCommitment: "2-4 hours/week",
      cost: "Free",
      difficulty: "Beginner",
      benefits: ["Builds relevant skills", "Shows commitment", "Networking opportunities"],
      nextSteps: ["Research available clubs", "Contact club organizers", "Attend meetings"]
    },
    {
      title: "Community Service",
      description: "Volunteer with local organizations to give back to your community while developing leadership and teamwork skills.",
      category: "Volunteer Opportunity",
      timeCommitment: "3-5 hours/week",
      cost: "Free",
      difficulty: "Beginner",
      benefits: ["Leadership development", "Community impact", "Personal growth"],
      nextSteps: ["Research local organizations", "Contact volunteer coordinators", "Start volunteering"]
    },
    {
      title: "Student Government",
      description: "Run for a position in student government to develop leadership skills and make a positive impact on your school community.",
      category: "Leadership",
      timeCommitment: "5-8 hours/week",
      cost: "Free",
      difficulty: "Intermediate",
      benefits: ["Leadership development", "Public speaking skills", "Community impact"],
      nextSteps: ["Research positions", "Prepare campaign materials", "Connect with voters"]
    }
  ];
} 