import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      age,
      grade,
      interests,
      academicStrengths,
      academicWeaknesses,
      careerGoals,
      timeAvailability,
      location,
      budget,
      testMode, // Optional test mode for field mapping
      academicSubjects,
      hobbies,
      personalQualities,
      communityChallenges,
      projectRequests
    } = body;

    // Test mode for field mapping verification
    if (testMode) {
      const testResponse = {
        projects: [
          {
            name: "Test Project 🧪",
            description: {
              summary: "This is a test project with different field names",
              skills: ["Test Skill 1", "Test Skill 2"],
              type: "Test Format",
              requirements: "Test prerequisites",
              commitment: "Test time commitment"
            },
            personalized_reasoning_text: "Test reasoning",
            benefits_list: ["Benefit 1", "Benefit 2"],
            why_benefits_matter: "Test benefits importance",
            schedule: body.testObjectTimeline ? {
              "Week 1": "Research and planning phase",
              "Week 2": "Implementation and testing"
            } : ["Week 1: Test", "Week 2: Test"]
          }
        ]
      };
      
      console.log('Test mode: Processing response with different field names');
      const responseText = JSON.stringify(testResponse);
      
      // Process the test response directly
      let recommendations: any = JSON.parse(responseText);
      console.log('Test mode: Successfully parsed JSON, structure:', Object.keys(recommendations));
      
      // Handle different possible response structures
      let projects = [];
      if (recommendations.passion_projects) {
        projects = recommendations.passion_projects;
        console.log('Found passion_projects array with', projects.length, 'items');
      } else if (recommendations.projects) {
        projects = recommendations.projects;
        console.log('Found projects array with', projects.length, 'items');
      } else if (Array.isArray(recommendations)) {
        projects = recommendations;
        console.log('Found direct array with', projects.length, 'items');
      } else {
        // Try to find any array in the response
        const arrayKeys = Object.keys(recommendations).filter(key => 
          Array.isArray(recommendations[key]) && recommendations[key].length > 0
        );
        if (arrayKeys.length > 0) {
          projects = recommendations[arrayKeys[0]];
          console.log('Found array in key', arrayKeys[0], 'with', projects.length, 'items');
        } else {
          console.log('No projects found in response, using fallback');
          throw new Error('No projects found');
        }
      }
      
      // Validate that projects array is not empty
      if (!projects || projects.length === 0) {
        throw new Error('Empty projects array');
      }
      
      // Dynamic field mapping function
      function getFieldValue(obj: any, possibleNames: string[], defaultValue: any = '') {
        for (const name of possibleNames) {
          if (obj[name] !== undefined && obj[name] !== null && obj[name] !== '') {
            return obj[name];
          }
        }
        return defaultValue;
      }
      
      // Normalize each project to ensure all fields are properly mapped
      const normalizedProjects = projects.map((project: any) => {
        // Handle different benefit formats
        let benefits = [];
        const benefitsValue = getFieldValue(project, ['benefits', 'benefits_list', 'benefit_list']);
        if (Array.isArray(benefitsValue)) {
          benefits = benefitsValue;
        } else if (benefitsValue && typeof benefitsValue === 'object') {
          benefits = Object.values(benefitsValue);
        } else if (typeof benefitsValue === 'string') {
          benefits = [benefitsValue];
        }

        // Handle different timeline formats
        let timeline = [];
        const timelineValue = getFieldValue(project, ['timeline', 'timeline_list', 'schedule']);
        if (Array.isArray(timelineValue)) {
          timeline = timelineValue;
        } else if (timelineValue && typeof timelineValue === 'object') {
          // Convert object format {"Week 1": "description", "Week 2": "description"} to array format
          timeline = Object.entries(timelineValue).map(([week, description]) => `${week}: ${description}`);
        } else if (typeof timelineValue === 'string') {
          timeline = [timelineValue];
        }

        // Handle different description formats
        const description = getFieldValue(project, ['description'], {});
        const overview = getFieldValue(description, ['overview', 'summary', 'introduction'], '');
        const skillsDeveloped = getFieldValue(description, ['skills_developed', 'skillsDeveloped', 'skills', 'skills_developed_list'], []);
        const format = getFieldValue(description, ['format', 'type', 'project_type'], '');
        const prerequisites = getFieldValue(description, ['prerequisites', 'requirements', 'prerequisites_list'], '');
        const timeCommitment = getFieldValue(description, ['time_commitment', 'timeCommitment', 'time_required', 'commitment'], '');

        // Handle different reasoning formats
        const personalizedReasoning = getFieldValue(project, [
          'personalized_reasoning', 
          'reasoning', 
          'personalized_reasoning_text',
          'why_this_project',
          'recommendation_reason'
        ], '');

        // Handle different benefits importance formats
        const benefitsImportance = getFieldValue(project, [
          'benefits_importance', 
          'benefits_explanation', 
          'benefit_explanation',
          'benefits_elaboration',
          'why_benefits_matter'
        ], '');

        return {
          title: getFieldValue(project, ['title', 'name', 'project_title'], ''),
          description: {
            overview: overview,
            skills_developed: Array.isArray(skillsDeveloped) ? skillsDeveloped : [skillsDeveloped],
            format: format,
            prerequisites: prerequisites,
            time_commitment: timeCommitment
          },
          personalized_reasoning: personalizedReasoning,
          benefits: benefits,
          benefits_importance: benefitsImportance,
          timeline: timeline
        };
      });
      
      console.log('Test mode: Successfully normalized', normalizedProjects.length, 'projects');
      
      // Log field mapping success for debugging
      normalizedProjects.forEach((project: any, index: number) => {
        console.log(`Test Project ${index + 1} mapping:`, {
          hasTitle: !!project.title,
          hasOverview: !!project.description.overview,
          hasSkills: project.description.skills_developed.length > 0,
          hasBenefits: project.benefits.length > 0,
          hasTimeline: project.timeline.length > 0,
          hasReasoning: !!project.personalized_reasoning
        });
      });
      
      return NextResponse.json({ passion_projects: normalizedProjects });
    }

    // Build the user profile for the prompt
    const userProfile = `Name: ${name}\nGrade Level: ${grade}\nAge: ${age}\nTime Availability: ${timeAvailability}\nLocation: ${location}\nBudget Range: ${budget}\nWhat academic subjects are you passionate about and/or excel in?: ${academicSubjects || ''}\nWhat hobbies are you interested in and love spending time on?: ${hobbies || ''}\nWhat is your desired college or career field?: ${careerGoals || ''}\nWhat personal qualities do you want this project highlight?: ${personalQualities || ''}\nWhat are some challenges you see in your community, school, or even global environment that you want to address?: ${communityChallenges || ''}\nAre there any requests you have for the passion project recommendations?: ${projectRequests || ''}`;

    const prompt = `You are an extracurricular advisor helping a high school student find a personalized passion project based on the student's inputs I give you. 

This is what I mean when I say "passion project":
A passion project is a self-initiated endeavor that reflects your genuine interest and dedication to a particular subject, cause, or activity. Unlike school assignments or extracurricular activities mandated by institutions, a passion project is driven by your personal enthusiasm and intrinsic motivation. These projects include, but are not limited to, starting a nonprofit organization, launching a research study, creating a community initiative, developing a business, or producing creative work. This DOES NOT include things like taking a class, or attending a competition. Do NOT recommend normal extracurriculars, only recommend activities that are genuine passion projects.

When you're designing passion projects, connect the user's multiple interests with the project, and figure out a way for them to take their genuine interests and make a positive impact in their community. AVOID AT ALL COSTS generic, common suggestions like starting a club or hosting a community workshops, as these are BORING and COMMON. Come up with projects that are extremely creative and unique, allowing the student to address potential challenges in their community while further pursuing their interests. Most importantly, make sure this project is genuinely authentic to the user's story and provides a meaningful, personalized connection to the student. Accomplish this by creating a UNIQUE project that combines different aspects of the student's personal hobbies, academic strengths, and the problem they would like to address in society. 

Do not try to minimize the output. Make sure the description and all parts of the description are AS THOROUGH as possible, and make sure you are just as THOROUGH for the three tabs.

Here is the student's profile:
${userProfile}

Please provide 4 passion projects, wrapped in a single JSON object whose key is "passion_projects" and whose value is an array of the four projects (do NOT use keys like project_1, project_2). Each project should include:
A creative title, with an emoji icon that captures the passion project, stored in "title"
Beneath the title, a description of the project (stored in "description") including:
A minimum 3 sentence overview/introduction to the project. In this overview, clearly state what the student will create, do, or launch, and the issue the project addresses or the goal of the project. Do not include personalized justification or benefits here, focus on thoroughly describing the project concept itself. Store this in "overview"
A list of the specific skills being developed, minimum 5, stored in "skills_developed"
The format of the project (e.g., website, club, workshop), stored in "format"
Any prerequisites required, and how the student can achieve this (classes for certain skills, forming connections with community event organizers, etc.), stored in "prerequisites"
An estimate of hours/week needed to be put into this project, including an ideal time to start. Do NOT just write "start in Week 1" (summer, beginning of school year, etc.), stored in "time_commitment"
These three tabs are extremely important and you MUST GENERATE THEM:
A tab with minimum 3 sentences of specific, personalized reasoning for why this project was recommended. Each sentence should be a new line, and a new point. Include how it aligns with their inputs (academic strengths, hobbies, traits, desired field of work, etc.), and what makes it personally meaningful or impactful for them. Then, explain how this project connects to the student's overall story, and how it promotes cohesion across their portfolio. Avoid generic statements, and make the reasoning feel like it could only apply to this specific student. Store this in "personalized_reasoning"
A tab with 4 specific benefits, in bullet form, stored in "benefits", followed by 1 sentence elaborating on why it matters or how it helps the user grow personally, academically, or professionally for the user's portfolio. Again, avoid generic phrasing and tailor both the benefits and explanations to reflect the student's unique portfolio. Stored in "benefits_importance"
A tab with a detailed 10-week timeline for the recommended passion project, assuming the student starts today. Format it as a list, with each entry beginning with "Week 1:", "Week 2:", and so on, through "Week 10:". Each week's item should be actionable and clearly define a milestone or task that pushes the student to make tangible progress toward completing the project. Instead of vague phrases like "develop the website," break down what the student should actually do that week such as choosing a platform (e.g. Wix, React, Webflow), setting up hosting, writing content, testing functionality, etc. The student should feel like they know exactly what to work on that week, even if they are a beginner. You are not just naming tasks, you are PLANNING the entire project week by week, in full detail, as if the student is following your roadmap. For each week, you need a minimum of 3 sentences to walk the user through how to accomplish the task. The plan should build logically from initial planning and research, to active development, and end with launch, feedback, and iteration. This is where you need to be thorough about the project's details, so include as much information as possible for each week. When formatting your output, do NOT try to include bullet points or numbers. Just include "Week 1:", "Week 2:", etc, stored in "timeline".`;

    let recommendations: any = null;
    const maxAttempts = 3;
    let responseText = '';

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      responseText = '';
      console.log(`Attempt ${attempt + 1}...`);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful extracurricular advisor who provides personalized recommendations in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        stream: true,
        response_format: { type: "json_object" }
      });

      // Collect the streamed response
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          responseText += content;
        }
      } catch (streamErr) {
        console.log(`Stream error on attempt ${attempt + 1}:`, streamErr);
        continue;
      }

      console.log(`Raw OpenAI response (attempt ${attempt + 1}):`, responseText);

      // Remove markdown code blocks if present (handles \r and \n)
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse
          .replace(/```json[\r\n]?/g, '')
          .replace(/```[\r\n]?/g, '')
          .trim();
      }

      try {
        recommendations = JSON.parse(cleanedResponse);
        break; // success
      } catch (parseErr: any) {
        console.log(`JSON parse failed on attempt ${attempt + 1}:`, parseErr.message);
        console.log('First 500 chars of response:', cleanedResponse.slice(0,500));
        // If parse failed due to unexpected end or token, likely truncated – retry
        if (attempt < maxAttempts - 1) {
          await new Promise(res => setTimeout(res, (attempt + 1) * 500));
          continue;
        }
        // otherwise throw to outer catch
        throw parseErr;
      }
    }

    if (!recommendations) {
      throw new Error('Failed to obtain a valid JSON response from OpenAI after retries');
    }

    console.log('OpenAI Response:', responseText);

    // Helper to extract a section by keyword – remains for fallback text parsing
    function extractSection(keyword: string, text: string): string {
      const regex = new RegExp(`${keyword}([\s\S]*?)(?=\n\n|$)`, 'i');
      const match = text.match(regex);
      return match && match[1] ? match[1].trim() : '';
    }

    // Try to parse JSON response
    try {
      // we already have recommendations parsed; skip to normalisation logic
      // (but keep the block structure for minimal diff)
      recommendations = recommendations;
 
      // Handle different possible response structures
      let projects = [];
      if (recommendations.passion_projects) {
        projects = recommendations.passion_projects;
        console.log('Found passion_projects array with', projects.length, 'items');
      } else if (recommendations.projects) {
        projects = recommendations.projects;
        console.log('Found projects array with', projects.length, 'items');
      } else if (Array.isArray(recommendations)) {
        projects = recommendations;
        console.log('Found direct array with', projects.length, 'items');
      } else {
        // Try to find any array in the response
        const arrayKeys = Object.keys(recommendations).filter(key => 
          Array.isArray(recommendations[key]) && recommendations[key].length > 0
        );
        if (arrayKeys.length > 0) {
          projects = recommendations[arrayKeys[0]];
          console.log('Found array in key', arrayKeys[0], 'with', projects.length, 'items');
        } else {
          console.log('No projects found in response, using fallback');
          throw new Error('No projects found');
        }
      }
      
      // Remove totally blank items (no title & no description)
      projects = projects.filter((p: any) => (p?.title && p?.title.trim()) || (p?.description && Object.keys(p.description).length));

      // Limit to first 4 projects
      if (projects.length > 4) {
        projects = projects.slice(0, 4);
      }

      // Validate that projects array is not empty
      if (!projects || projects.length === 0) {
        throw new Error('Empty projects array');
      }
      
      // Dynamic field mapping function
      function getFieldValue(obj: any, possibleNames: string[], defaultValue: any = '') {
        for (const name of possibleNames) {
          if (obj[name] !== undefined && obj[name] !== null && obj[name] !== '') {
            return obj[name];
          }
        }
        return defaultValue;
      }
      
      // Normalize each project to ensure all fields are properly mapped
      const normalizedProjects = projects.map((project: any) => {
        // Handle different benefit formats - also check inside description object
        let benefits = [];
        let benefitsValue = getFieldValue(project, ['benefits', 'benefits_list', 'benefit_list']);
        
        // If not found at top level, check inside description
        if (!benefitsValue && project.description) {
          benefitsValue = getFieldValue(project.description, ['benefits', 'benefits_list', 'benefit_list']);
        }
        
        if (Array.isArray(benefitsValue)) {
          benefits = benefitsValue;
        } else if (benefitsValue && typeof benefitsValue === 'object') {
          benefits = Object.values(benefitsValue);
        } else if (typeof benefitsValue === 'string') {
          benefits = [benefitsValue];
        }

        // Handle different timeline formats - also check inside description object
        let timeline = [];
        let timelineValue = getFieldValue(project, ['timeline', 'timeline_list', 'schedule']);
        
        // If not found at top level, check inside description
        if (!timelineValue && project.description) {
          timelineValue = getFieldValue(project.description, ['timeline', 'timeline_list', 'schedule']);
        }
        
        if (Array.isArray(timelineValue)) {
          timeline = timelineValue;
        } else if (timelineValue && typeof timelineValue === 'object') {
          // Ensure we do not duplicate colons if the key already contains one
          timeline = Object.entries(timelineValue).map(([week, description]) => {
            const weekLabel = typeof week === 'string' && week.trim().endsWith(':') ? week.trim() : `${week.trim()}:`;
            return `${weekLabel} ${description}`;
          });
        } else if (typeof timelineValue === 'string') {
          timeline = [timelineValue];
        }

        // Handle different description formats
        const description = getFieldValue(project, ['description'], {});
        const overview = getFieldValue(description, ['overview', 'summary', 'introduction'], '');
        const skillsDeveloped = getFieldValue(description, ['skills_developed', 'skillsDeveloped', 'skills', 'skills_developed_list'], []);
        const format = getFieldValue(description, ['format', 'type', 'project_type'], '');
        const prerequisites = getFieldValue(description, ['prerequisites', 'requirements', 'prerequisites_list'], '');
        const timeCommitment = getFieldValue(description, ['time_commitment', 'timeCommitment', 'time_required', 'commitment'], '');

        // Handle different reasoning formats
        const personalizedReasoning = getFieldValue(project, [
          'personalized_reasoning', 
          'reasoning', 
          'personalized_reasoning_text',
          'why_this_project',
          'recommendation_reason'
        ], '');

        // Handle different benefits importance formats
        const benefitsImportance = getFieldValue(project, [
          'benefits_importance', 
          'benefits_explanation', 
          'benefit_explanation',
          'benefits_elaboration',
          'why_benefits_matter'
        ], '');

        return {
          title: getFieldValue(project, ['title', 'name', 'project_title'], ''),
          description: {
            overview: overview,
            skills_developed: Array.isArray(skillsDeveloped) ? skillsDeveloped : [skillsDeveloped],
            format: format,
            prerequisites: prerequisites,
            time_commitment: timeCommitment
          },
          personalized_reasoning: personalizedReasoning,
          benefits: benefits,
          benefits_importance: benefitsImportance,
          timeline: timeline
        };
      });
      
      console.log('Successfully normalized', normalizedProjects.length, 'projects');
      
      // Log field mapping success for debugging
      normalizedProjects.forEach((project: any, index: number) => {
        console.log(`Project ${index + 1} mapping:`, {
          hasTitle: !!project.title,
          hasOverview: !!project.description.overview,
          hasSkills: project.description.skills_developed.length > 0,
          hasBenefits: project.benefits.length > 0,
          hasTimeline: project.timeline.length > 0,
          hasReasoning: !!project.personalized_reasoning
        });
      });
      
      // Debug: Log the actual field names in the original response
      console.log('=== DEBUGGING ORIGINAL RESPONSE STRUCTURE ===');
      projects.forEach((project: any, index: number) => {
        console.log(`Original Project ${index + 1} keys:`, Object.keys(project));
        if (project.description) {
          console.log(`Project ${index + 1} description keys:`, Object.keys(project.description));
        }
      });
      console.log('=== END DEBUGGING ===');
      
      // Additional debugging for missing fields
      console.log('=== CHECKING FOR MISSING FIELDS ===');
      normalizedProjects.forEach((project: any, index: number) => {
        if (!project.personalized_reasoning || !project.benefits.length || !project.timeline.length) {
          console.log(`Project ${index + 1} (${project.title}) has missing fields:`, {
            reasoning: !!project.personalized_reasoning,
            benefits: project.benefits.length,
            timeline: project.timeline.length
          });
        }
      });
      console.log('=== END CHECKING ===');
      
      return NextResponse.json({ passion_projects: normalizedProjects });
    } catch (error) {
      console.log('JSON parsing failed, falling back to text extraction:', error);
      console.log('Raw response text:', responseText);
      
      // Fallback: Extract projects from text if JSON parsing failed
      const projectBlocks = responseText.split(/\n\n(?=\d+\.|\*|[A-Z][^\n]+\n)/g).filter(b => b.trim());
      console.log('Extracted', projectBlocks.length, 'project blocks from text');
      
      let projects = [];
      if (projectBlocks.length > 0) {
        projects = projectBlocks.map(block => {
          // Try to extract fields from each block
          const titleMatch = block.match(/^(.*?)(\n|$)/);
          const title = titleMatch ? titleMatch[1].trim() : '';
          const description = extractSection('description|overview', block);
          const benefits = extractSection('benefits', block);
          const timeline = extractSection('timeline', block);
          const reasoning = extractSection('reasoning|why', block);
          return { 
            title, 
            description: { overview: description },
            benefits: benefits ? [benefits] : [],
            timeline: timeline ? [timeline] : [],
            personalized_reasoning: reasoning
          };
        });
      } else {
        // Try to extract the first JSON array in the text
        const arrayMatch = responseText.match(/\[([\s\S]*?)\]/);
        if (arrayMatch) {
          try {
            projects = JSON.parse('[' + arrayMatch[1] + ']');
          } catch (arrayError) {
            console.log('Failed to parse extracted array:', arrayError);
          }
        }
      }
      if (!projects || projects.length === 0) {
        return NextResponse.json({ error: 'Failed to extract any valid projects from the AI response.' }, { status: 500 });
      }
      return NextResponse.json({ passion_projects: projects });
    }

  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
} 