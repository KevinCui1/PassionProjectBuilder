'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './components/Logo';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    interests: '',
    academicStrengths: '',
    academicWeaknesses: '',
    careerGoals: '',
    timeAvailability: '',
    location: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('savedFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData.data);
        setLastSaved(parsedData.timestamp);
        setIsSaved(true);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-save form data when it changes
  useEffect(() => {
    const hasData = Object.values(formData).some(value => value !== '');
    if (hasData) {
      const saveData = {
        data: formData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('savedFormData', JSON.stringify(saveData));
      setLastSaved(saveData.timestamp);
      setIsSaved(true);
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Store recommendations in localStorage for the results page
        localStorage.setItem('recommendations', JSON.stringify(data.recommendations));
        localStorage.setItem('userData', JSON.stringify(formData));
        router.push('/results');
      } else {
        throw new Error('Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      age: '',
      grade: '',
      interests: '',
      academicStrengths: '',
      academicWeaknesses: '',
      careerGoals: '',
      timeAvailability: '',
      location: '',
      budget: ''
    });
    localStorage.removeItem('savedFormData');
    setIsSaved(false);
    setLastSaved(null);
  };

  const formatLastSaved = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200 to-blue-300 rounded-full opacity-10 blur-3xl"></div>
      </div>
      {/* Header */}
              <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center space-x-4">
              {isSaved && lastSaved && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Saved {formatLastSaved(lastSaved)}</span>
                </div>
              )}
              <div className="text-sm text-gray-600">
                Discover Your Path
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Extracurricular Activities</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get personalized recommendations for passion projects and extracurricular activities 
              that align with your interests, academic strengths, and future goals.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Tell Us About Yourself</h2>
                  <p className="text-blue-100">Help us understand your interests and goals to provide the best recommendations.</p>
                </div>
                <div className="flex items-center space-x-3">
                  {isSaved && (
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white text-sm font-medium">Auto-saved</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={clearForm}
                    className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm hover:bg-white/30 transition-colors"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      Personal Information
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name (Optional)
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Your name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="e.g., 16"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                          Grade Level
                        </label>
                        <select
                          id="grade"
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select grade</option>
                          <option value="9th">9th Grade</option>
                          <option value="10th">10th Grade</option>
                          <option value="11th">11th Grade</option>
                          <option value="12th">12th Grade</option>
                          <option value="college">College</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic & Career */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      Academic Strengths & Career Aspirations
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="academicStrengths" className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Strengths
                      </label>
                      <textarea
                        id="academicStrengths"
                        name="academicStrengths"
                        value={formData.academicStrengths}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., Math, Science, Writing, Art..."
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="careerGoals" className="block text-sm font-medium text-gray-700 mb-2">
                        Desired Major/Desired Career Field
                      </label>
                      <textarea
                        id="careerGoals"
                        name="careerGoals"
                        value={formData.careerGoals}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., Computer Science, Medicine, Business Administration, Psychology..."
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests & Preferences */}
              <div className="mt-8 space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    Personal Traits & Availability
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
                      Traits You Want To Highlight
                    </label>
                    <textarea
                      id="interests"
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                              placeholder="e.g., Leadership, creativity, problem-solving, empathy, technical skills, communication..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="timeAvailability" className="block text-sm font-medium text-gray-700 mb-2">
                        Time Availability
                      </label>
                      <select
                        id="timeAvailability"
                        name="timeAvailability"
                        value={formData.timeAvailability}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select availability</option>
                        <option value="1-2 hours/week">1-2 hours/week</option>
                        <option value="3-5 hours/week">3-5 hours/week</option>
                        <option value="6-10 hours/week">6-10 hours/week</option>
                        <option value="10+ hours/week">10+ hours/week</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="City, State"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select budget</option>
                        <option value="Free">Free</option>
                        <option value="$1-50/month">$1-50/month</option>
                        <option value="$51-100/month">$51-100/month</option>
                        <option value="$101-200/month">$101-200/month</option>
                        <option value="$200+/month">$200+/month</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-10 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold py-4 px-12 rounded-lg text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Generating Recommendations...
                    </div>
                  ) : (
                    'Get My Personalized Recommendations'
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Your information is automatically saved and secure. It will only be used to generate recommendations.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
