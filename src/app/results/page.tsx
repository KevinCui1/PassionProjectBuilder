'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';

interface Recommendation {
  title: string;
  description: string;
  category: string;
  timeCommitment: string;
  cost: string;
  difficulty: string;
  benefits: string[];
  nextSteps: string[];
  format?: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Get data from localStorage
    const storedRecommendations = localStorage.getItem('recommendations');
    const storedUserData = localStorage.getItem('userData');

    if (storedRecommendations && storedUserData) {
      const parsedRecommendations = JSON.parse(storedRecommendations);
      const parsedUserData = JSON.parse(storedUserData);
      
      setRecommendations(parsedRecommendations);
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
          setRecommendations(parsed.recommendations);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center space-x-4">
              {isSaved && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Recommendations saved</span>
                </div>
              )}
              <div className="text-sm text-gray-600">
                Your Recommendations
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Your Personalized
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Recommendations</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Based on your interests and goals, here are some extracurricular activities 
              that could help you develop your passions and build your resume.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> These recommendations are tailored to your specific interests and circumstances. 
                Consider starting with the ones that excite you most! Your recommendations are automatically saved for future reference.
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="max-w-6xl mx-auto space-y-8">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Recommendation Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                        {recommendation.category}
                      </span>
                      <span className="bg-green-500/20 text-green-100 text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                        {recommendation.difficulty}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {recommendation.title}
                    </h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      {recommendation.description}
                    </p>
                  </div>
                  <div className="ml-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Time Commitment
                    </h4>
                    <p className="text-blue-700">{recommendation.timeCommitment}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      Cost
                    </h4>
                    <p className="text-green-700">{recommendation.cost}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Difficulty Level
                    </h4>
                    <p className="text-purple-700">{recommendation.difficulty}</p>
                  </div>
                </div>

                {/* Format for Passion Projects */}
                {recommendation.format && (
                  <div className="mb-8">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        Project Format
                      </h4>
                      <p className="text-orange-800 font-medium">{recommendation.format}</p>
                    </div>
                  </div>
                )}

                {/* Benefits and Next Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-4 text-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Key Benefits
                    </h4>
                    <ul className="space-y-3">
                      {recommendation.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start gap-3">
                          <span className="text-green-500 mt-1 flex-shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-green-800">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-4 text-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      Next Steps
                    </h4>
                    <ol className="space-y-3">
                      {recommendation.nextSteps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">
                            {stepIndex + 1}
                          </span>
                          <span className="text-blue-800">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-16 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Choose the recommendation that excites you most and begin your journey!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                Get New Recommendations
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gray-100 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-300"
              >
                Print Recommendations
              </button>
              <button
                onClick={clearSavedData}
                className="bg-red-50 text-red-700 font-semibold py-3 px-8 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200"
              >
                Clear Saved Data
              </button>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Want different suggestions? Try adjusting your interests and goals on the form.
          </div>
        </div>
      </div>
    </div>
  );
} 