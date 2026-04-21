'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';
import Sidebar from '../components/Sidebar';

interface PassionProject {
  title: string;
  description: string;
  format: string;
  steps: string[];
}

interface ExtracurricularActivity {
  name: string;
  type: string;
  reason: string;
}

interface ComplementaryActivity {
  name: string;
  type: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [passionProjects, setPassionProjects] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  // Track which tab is open for each project
  const [openTabs, setOpenTabs] = useState<{ [key: number]: string | null }>({});

  useEffect(() => {
    // Get data from localStorage
    const storedRecommendations = localStorage.getItem('recommendations');
    const storedUserData = localStorage.getItem('userData');

    if (storedRecommendations && storedUserData) {
      const parsedRecommendations = JSON.parse(storedRecommendations);
      const parsedUserData = JSON.parse(storedUserData);
      setPassionProjects(parsedRecommendations.passion_projects || []);
      setUserData(parsedUserData);
      // Save recommendations with timestamp for later access
      const savedRecommendations = {
        recommendations: parsedRecommendations,
        userData: parsedUserData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('savedRecommendations', JSON.stringify(savedRecommendations));
      setIsSaved(true);
    } else {
      // Check if there are saved recommendations from a previous session
      const savedRecommendations = localStorage.getItem('savedRecommendations');
      if (savedRecommendations) {
        try {
          const parsed = JSON.parse(savedRecommendations);
          setPassionProjects(parsed.recommendations.passion_projects || []);
          setUserData(parsed.userData);
          setIsSaved(true);
        } catch (error) {
          console.error('Error loading saved recommendations:', error);
          router.push('/');
        }
      } else {
        // If no data, redirect back to home
        router.push('/');
      }
    }
    setLoading(false);
  }, [router]);

  const clearSavedData = () => {
    localStorage.removeItem('recommendations');
    localStorage.removeItem('userData');
    localStorage.removeItem('savedRecommendations');
    router.push('/');
  };

  const handleTabClick = (projectIdx: number, tab: string) => {
    setOpenTabs(prev => ({
      ...prev,
      [projectIdx]: prev[projectIdx] === tab ? null : tab
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Loading your recommendations...</p>
          <p className="text-blue-700 font-medium animate-pulse">Generating your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200 to-blue-300 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-pink-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>
      {/* Sidebar */}
      <Sidebar />
      {/* Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between ml-6">
            <div className="flex items-center space-x-4">
              <Logo size="xl" showText={false} />
              <div>
                <h3 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Passion Project <span className="text-indigo-700">Builder</span></h3>
                <p className="text-base text-black -mt-1">Discover extracurricular projects that match your passions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">You are in Free Plan</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-1">
                <span>+</span>
                <span>Upgrade</span>
              </button>
              <button className="p-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="p-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </button>
              <button className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-1 py-2">
              <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                Build Profile
              </a>
              <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                Profile Assessment
              </a>
              <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                Position Statement
              </a>
              <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                Major Recommendation
              </a>
              <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                Build College List
              </a>
              <a href="#" className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                Explore Activities
              </a>
              <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                Find Scholarship
              </a>
              <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                Essay Tutor
              </a>
            </nav>
        </div>
      </div>
  <div className="pl-24">
        {/* Header */}
        <div className="text-center mb-12 mt-16 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Your Personalized
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Recommendations</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Based on your interests and goals, here are some passion projects that could help you develop your passions and build your resume.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> These recommendations are tailored to your specific interests and circumstances. 
                Consider starting with the ones that excite you most! Your recommendations are automatically saved for future reference.
              </p>
            </div>
          </div>
        </div>

        {/* Passion Projects Section */}
        <div className="max-w-4xl mx-auto space-y-12 mb-12">
          {passionProjects.map((project, idx) => (
            <div key={idx} className="bg-gradient-to-r from-blue-200 to-indigo-300 rounded-xl shadow-lg border border-blue-300 overflow-hidden">
              <div className="px-8 py-6">
                {/* Icon and Title */}
                <h2 className="text-2xl font-bold text-black mb-2 font-serif tracking-tight flex items-center justify-center">
                  {project.title} {project.icon && <span className="ml-2 text-2xl align-middle">{project.icon}</span>}
                </h2>
                {/* Description rendering */}
                {project.description && typeof project.description === 'object' ? (
                  <div className="text-black mb-4 space-y-2">
                    {project.description.overview && (
                      <div className="pb-3 border-b border-gray-200">
                        <span className="font-semibold text-lg" style={{ fontFamily: 'Urbanist, sans-serif' }}>📘 Overview:</span> {project.description.overview}
                      </div>
                    )}
                    {(project.description.skills_developed || project.description.skillsDeveloped) && Array.isArray(project.description.skills_developed || project.description.skillsDeveloped) ? (
                      <div className="pb-3 border-b border-gray-200">
                        <span className="font-semibold text-lg" style={{ fontFamily: 'Urbanist, sans-serif' }}>🛠️ Skills Developed:</span> 
                        <ul className="list-disc list-inside ml-4">
                          {(project.description.skills_developed || project.description.skillsDeveloped).map((skill: string, i: number) => <li key={i}>{skill}</li>)}
                        </ul>
                      </div>
                    ) : (project.description.skills_developed || project.description.skillsDeveloped) ? (
                      <div className="pb-3 border-b border-gray-200">
                        <span className="font-semibold text-lg" style={{ fontFamily: 'Urbanist, sans-serif' }}>🛠️ Skills Developed:</span> {project.description.skills_developed || project.description.skillsDeveloped}
                      </div>
                    ) : null}
                    {project.description.format && (
                      <div className="pb-3 border-b border-gray-200">
                        <span className="font-semibold text-lg" style={{ fontFamily: 'Urbanist, sans-serif' }}>🧾 Format:</span> {project.description.format}
                      </div>
                    )}
                    {project.description.prerequisites && (
                      <div className="pb-3 border-b border-gray-200">
                        <span className="font-semibold text-lg" style={{ fontFamily: 'Urbanist, sans-serif' }}>🧠 Prerequisites:</span> {project.description.prerequisites}
                      </div>
                    )}
                    {(project.description.time_commitment || project.description.timeCommitment) && (
                      <div className="pb-3">
                        <span className="font-semibold text-lg" style={{ fontFamily: 'Urbanist, sans-serif' }}>⏳ Time Commitment:</span> {project.description.time_commitment || project.description.timeCommitment}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-black mb-4">{project.description}</p>
                )}
                {/* Tab Buttons */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <button
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    openTabs[idx]==='reasoning' 
                    ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' 
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                  onClick={() => handleTabClick(idx, 'reasoning')}
                >
                  🎯 Personalized Reasoning
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    openTabs[idx]==='benefits'
                    ? 'bg-cyan-100 text-cyan-700 shadow-lg hover:bg-cyan-200'
                    : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 hover:shadow-md'
                  }`}
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                  onClick={() => handleTabClick(idx, 'benefits')}
                >
                  🌟 Benefits
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 border-b-2 ${
                    openTabs[idx]==='timeline'
                    ? 'bg-purple-100 text-purple-800 border-purple-500'
                    : 'bg-purple-50 text-purple-800 border-transparent hover:bg-purple-100 hover:border-purple-400'
                  }`}
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                  onClick={() => handleTabClick(idx, 'timeline')}
                >
                  📅 Timeline
                </button>
                </div>
                {/* Tab Content */}
                {openTabs[idx]==='reasoning' && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-2">
                    <h3 className="font-semibold text-blue-800 mb-3 text-lg" style={{ fontFamily: 'Urbanist, sans-serif' }}>🎯 Personalized Reasoning</h3>
                    <div className="space-y-2">
                      {(() => {
                        const reasoning = project.personalized_reasoning || project.reasoning?.personalized_reasoning || project.reasoning;
                        if (!reasoning) return null;
                        
                        // Split by multiple sentence endings and clean up
                        const sentences = reasoning
                          .split(/[.!?]+/)
                          .map((sentence: string) => sentence.trim())
                          .filter((sentence: string) => sentence.length > 0)
                          .map((sentence: string) => {
                            // Clean up any extra whitespace and ensure proper capitalization
                            return sentence.charAt(0).toUpperCase() + sentence.slice(1);
                          });
                        
                        return sentences.map((sentence: string, index: number) => (
                          <p key={index} className="text-gray-700">
                            {sentence}.
                          </p>
                        ));
                      })()}
                    </div>
                  </div>
                )}
                {openTabs[idx]==='benefits' && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-2">
                    <h3 className="font-semibold text-blue-800 mb-3 text-lg" style={{ fontFamily: 'Urbanist, sans-serif' }}>🌟 Benefits</h3>
                    <div className="space-y-2">
                      {(() => {
                        const benefits = (project.benefits || project.benefits_list || project.benefits?.benefits_list || []);
                        const icons = ['🌱', '🚀', '💡', '📚'];
                        
                        return benefits.map((benefit: string, bidx: number) => {
                          const icon = icons[bidx % 4];
                          return (
                            <div key={bidx} className="flex items-start space-x-2">
                              <span className="text-lg">{icon}</span>
                              <span>{benefit}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                    {(project.benefits_importance || project.benefits?.elaboration || project.benefits_explanation || project.benefit_explanation) && (
                      <p className="mt-2 text-gray-700">{project.benefits_importance || project.benefits?.elaboration || project.benefits_explanation || project.benefit_explanation}</p>
                    )}
                  </div>
                )}
                {openTabs[idx]==='timeline' && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-2">
                    <h3 className="font-semibold text-blue-800 mb-3 text-lg" style={{ fontFamily: 'Urbanist, sans-serif' }}>📅 Timeline</h3>
                    <div className="space-y-3">
                      {(() => {
                        const timelineArray: string[] = [];

                        if (project.timeline) {
                          // Case 1: already an array of strings
                          if (Array.isArray(project.timeline)) {
                            timelineArray.push(...project.timeline as string[]);
                          }
                          // Case 2: object with nested array in "timeline" key (OpenAI sometimes wraps this)
                          else if (project.timeline && Array.isArray((project.timeline as any).timeline)) {
                            timelineArray.push(...(project.timeline as any).timeline);
                          }
                          // Case 3: string that needs to be split by commas
                          else if (typeof project.timeline === 'string') {
                            const timelineString = project.timeline as string;
                            // Split by commas and clean up
                            const splitTimeline = timelineString.split(',').map(item => item.trim());
                            timelineArray.push(...splitTimeline);
                          }
                          // Case 4: object with week keys – convert values to array
                          else if (typeof project.timeline === 'object') {
                            Object.values(project.timeline).forEach((val: any) => {
                              if (Array.isArray(val)) {
                                timelineArray.push(...val);
                              } else if (typeof val === 'string') {
                                timelineArray.push(val);
                              }
                            });
                          }
                        }

                        const uniqueTimeline = [...new Set(timelineArray.map((s: string) => s.trim()))];
                        const icons = ['📌', '✔️', '🗂️'];

                        return uniqueTimeline.map((item: string, tidx: number) => {
                          const icon = icons[tidx % 3];
                          const weekMatch = item.match(/^(Week \d+:)/);
                          
                          if (weekMatch) {
                            const weekPart = weekMatch[1];
                            const contentPart = item.substring(weekMatch[1].length);
                            return (
                              <div key={tidx} className="flex items-start space-x-2">
                                <span className="text-lg">{icon}</span>
                                <div>
                                  <span className="font-bold text-blue-800">{weekPart}</span>
                                  <span>{contentPart}</span>
                                </div>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={tidx} className="flex items-start space-x-2">
                              <span className="text-lg">{icon}</span>
                              <div>{item}</div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-16 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Looking for Different Recommendations?</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your interests and goals on the input form.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                Return to Input Page
              </button>
              <button
                onClick={clearSavedData}
                className="bg-red-50 text-red-700 font-semibold py-3 px-8 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                Clear Saved Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 