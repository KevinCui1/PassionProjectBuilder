'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './components/Logo';
import Sidebar from './components/Sidebar';

interface Post {
  id: string;
  title: string;
  category: string;
  content: string;
  author: string;
  authorInitials: string;
  timestamp: string;
  likes: number;
  comments: number;
  color: string;
}

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  timestamp: string;
}

export default function Home() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    timeAvailability: '',
    location: '',
    budget: '',
    academicSubjects: '',
    hobbies: '',
    careerGoals: '',
    personalQualities: '',
    communityChallenges: '',
    projectRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Post management state
  const [posts, setPosts] = useState<Post[]>([]);
  const [postFormData, setPostFormData] = useState({
    title: '',
    category: '',
    content: '',
  });
  const [activeFilter, setActiveFilter] = useState('all');

  // Journal entry management state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [journalFormData, setJournalFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
  });

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
    setError(null);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate recommendations');
      }

      const recommendations = await response.json();
      
      // Validate that we received the expected data structure
      if (!recommendations.passion_projects || !Array.isArray(recommendations.passion_projects)) {
        throw new Error('Invalid response format from server');
      }
      
      // Store recommendations in localStorage for the results page
      localStorage.setItem('recommendations', JSON.stringify(recommendations));
      localStorage.setItem('userData', JSON.stringify(formData));
      router.push('/results');
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      age: '',
      grade: '',
      timeAvailability: '',
      location: '',
      budget: '',
      academicSubjects: '',
      hobbies: '',
      careerGoals: '',
      personalQualities: '',
      communityChallenges: '',
      projectRequests: ''
    });
    localStorage.removeItem('savedFormData');
    setIsSaved(false);
    setLastSaved(null);
  };

  const formatLastSaved = (timestamp: string | null) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Post handling functions
  const getRandomColor = () => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-red-600',
      'from-purple-500 to-pink-600',
      'from-cyan-500 to-blue-600',
      'from-pink-500 to-rose-600',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'looking-for-partners': 'bg-purple-100 text-purple-800',
      'project-showcase': 'bg-blue-100 text-blue-800',
      'advice-needed': 'bg-amber-100 text-amber-800',
      'resources-sharing': 'bg-green-100 text-green-800',
      'success-stories': 'bg-pink-100 text-pink-800',
    };
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'looking-for-partners': 'Looking for Partners',
      'project-showcase': 'Project Showcase',
      'advice-needed': 'Advice Needed',
      'resources-sharing': 'Resources & Tips',
      'success-stories': 'Success Stories',
    };
    return labels[category] || category;
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handlePostInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPostFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postFormData.title || !postFormData.category || !postFormData.content) {
      alert('Please fill in all fields');
      return;
    }

    const userName = formData.name || 'Anonymous User';
    const newPost: Post = {
      id: Date.now().toString(),
      title: postFormData.title,
      category: postFormData.category,
      content: postFormData.content,
      author: userName,
      authorInitials: getInitials(userName),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      color: getRandomColor(),
    };

    setPosts(prev => [newPost, ...prev]);
    setPostFormData({
      title: '',
      category: '',
      content: '',
    });

    // Scroll to posts section
    setTimeout(() => {
      const postsSection = document.getElementById('forum-posts');
      if (postsSection) {
        postsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeFilter);

  // Journal handling functions
  const handleJournalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJournalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!journalFormData.content) {
      alert('Please write something in your journal entry');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: journalFormData.date,
      title: journalFormData.title,
      content: journalFormData.content,
      timestamp: new Date().toISOString(),
    };

    setJournalEntries(prev => [newEntry, ...prev]);
    setJournalFormData({
      date: new Date().toISOString().split('T')[0],
      title: '',
      content: '',
    });

    // Scroll to past entries section
    setTimeout(() => {
      const entriesSection = document.getElementById('past-entries');
      if (entriesSection) {
        entriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const clearJournalForm = () => {
    setJournalFormData({
      date: new Date().toISOString().split('T')[0],
      title: '',
      content: '',
    });
  };

  const formatJournalDate = (dateString: string) => {
    // Parse the date string as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200 to-blue-300 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
  {/* Floating particles */}
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
                    <h3 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                      Passion Project <span className="text-indigo-700">Builder</span>
                    </h3>
                    <p className="text-base text-black -mt-1">Discover extracurricular projects that match your passions</p>
                  </div>
              </div>
            <div className="flex items-center space-x-3">
              <button className="p-2" aria-label="notifications">
                <svg className="w-7 h-7 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="p-2" aria-label="globe">
                <svg className="w-7 h-7 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </button>
              <button className="w-9 h-9 bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
      </div>



  <div className="pl-24">
        <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div id="home" className="text-center mb-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient"> Extracurricular Activities</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Get personalized recommendations for passion projects and extracurricular activities 
              that align with your interests, academic strengths, and future goals.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-50/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-3">Tell Us About Yourself</h2>
                  <p className="text-blue-100 text-lg">Help us understand your interests and goals to provide the best recommendations.</p>
                </div>
                <div className="flex items-center space-x-3">
                  {isSaved && (
                    <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <svg className="w-4 h-4 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white text-sm font-medium">Auto-saved</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={clearForm}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                      <span className="text-base">Name (Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">Age</span>
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                        placeholder="e.g., 16"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">Grade Level</span>
                      </label>
                      <select
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                        required
                      >
                        <option value="" disabled hidden>Select grade</option>
                        <option value="middle">Middle School</option>
                        <option value="9th">9th Grade</option>
                        <option value="10th">10th Grade</option>
                        <option value="11th">11th Grade</option>
                        <option value="12th">12th Grade</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="timeAvailability" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">Time Availability</span>
                      </label>
                      <select
                        id="timeAvailability"
                        name="timeAvailability"
                        value={formData.timeAvailability}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                        required
                      >
                        <option value="" disabled hidden>Select availability</option>
                        <option value="1-2 hours/week">1-2 hours/week</option>
                        <option value="3-5 hours/week">3-5 hours/week</option>
                        <option value="6-10 hours/week">6-10 hours/week</option>
                        <option value="10+ hours/week">10+ hours/week</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">Location</span>
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                        placeholder="City, State"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">Budget Range</span>
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50"
                        required
                      >
                        <option value="" disabled hidden>Select budget</option>
                        <option value="Any budget">Any budget</option>
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

              {/* Personal Interests */}
              <div className="mt-12">
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    Personal Interests
                  </h3>
                  <p className="text-gray-500 text-sm ml-11">Tell us more about your interests, goals, and what drives you. This helps us personalize your recommendations.</p>
                </div>
                <div className="overflow-x-auto pb-2">
                  <div className="flex flex-col gap-6">
                    <div className="flex-1 min-w-[220px] bg-blue-100 rounded-xl shadow-md border border-blue-300 p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">What academic subjects are you passionate about and/or excel in?</span>
                      </label>
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none px-4 py-3 font-sans bg-blue-50"
                        rows={5}
                        name="academicSubjects"
                        value={formData.academicSubjects}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Biology, Computer Science, English Literature, Calculus"
                      />
                    </div>
                    <div className="flex-1 min-w-[220px] bg-blue-100 rounded-xl shadow-md border border-blue-300 p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">What hobbies are you interested in and love spending time on?</span>
                      </label>
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none px-4 py-3 font-sans bg-blue-50"
                        rows={5}
                        name="hobbies"
                        value={formData.hobbies}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Volunteering, Painting, Piano, Robotics"
                      />
                    </div>
                    <div className="flex-1 min-w-[220px] bg-blue-100 rounded-xl shadow-md border border-blue-300 p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">What is your desired college or career field?</span>
                      </label>
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none px-4 py-3 font-sans bg-blue-50"
                        rows={5}
                        name="careerGoals"
                        value={formData.careerGoals}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Computer Science Major, Pre-Med, Environmental Engineering, Law"
                      />
                    </div>
                    <div className="flex-1 min-w-[220px] bg-blue-100 rounded-xl shadow-md border border-blue-300 p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">What personal qualities do you want this project highlight?</span>
                      </label>
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none px-4 py-3 font-sans bg-blue-50"
                        rows={5}
                        name="personalQualities"
                        value={formData.personalQualities}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Leadership, Creativity, Empathy, Resilience, Teamwork"
                      />
                    </div>
                    <div className="flex-1 min-w-[220px] bg-blue-100 rounded-xl shadow-md border border-blue-300 p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">What are some challenges you see in your community, school, or even global environment that you want to address?</span>
                      </label>
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none px-4 py-3 font-sans bg-blue-50"
                        rows={5}
                        name="communityChallenges"
                        value={formData.communityChallenges}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Education Inequality, Environmental Issues, Online Misinformation, Lack of Academic Resources"
                      />
                    </div>
                    {/* New Project Requests Field */}
                    <div className="flex-1 min-w-[220px] bg-blue-100 rounded-xl shadow-md border border-blue-300 p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        <span className="text-base">Are there any requests you have for the passion project recommendations?</span>
                      </label>
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none px-4 py-3 font-sans bg-blue-50"
                        rows={5}
                        name="projectRequests"
                        value={formData.projectRequests}
                        onChange={handleInputChange}
                        placeholder="Ex: Focus on community involvement, Focus on digital projects"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className="mt-12 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-6 px-16 rounded-2xl text-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transform hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        <span>Generating Recommendations...</span>
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🚀</span>
                        Get My Personalized Recommendations
                      </>
                    )}
                  </div>
                </button>
                <p className="text-sm text-gray-500 mt-4 flex items-center justify-center">
                  <span className="mr-2">🔒</span>
                  Your information is automatically saved and secure. It will only be used to generate recommendations.
                </p>
              </div>
            </div>
          </form>
        </div>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg p-4 border border-red-200 mt-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Problem Database Section */}
        <div id="problem-database" className="py-24 scroll-mt-24">
          <div className="text-center mb-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Problem Database</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Explore real-world problems and challenges to inspire your next passion project. 
                Browse curated issues across various fields and find opportunities to make an impact.
              </p>
            </div>
          </div>
          
          {/* Articles Grid */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Article 1: Climate Change */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop" 
                    alt="Climate Change and Sustainability"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold mb-3">Environment</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Climate Change & Sustainability</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Rising global temperatures, extreme weather events, and environmental degradation require urgent action. 
                    Students can tackle local sustainability, carbon reduction, or renewable energy initiatives.
                  </p>
                  <a 
                    href="https://www.un.org/en/climatechange" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Learn More 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Article 2: Education Inequality */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop" 
                    alt="Educational Access and Equity"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold mb-3">Education</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Access & Equity</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Millions of students worldwide lack access to quality education, tutoring, and learning resources. 
                    Create programs to bridge the achievement gap and provide educational support.
                  </p>
                  <a 
                    href="https://www.unicef.org/education" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Learn More 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Article 3: Mental Health */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=400&fit=crop" 
                    alt="Youth Mental Health"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-semibold mb-3">Health</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Youth Mental Health Crisis</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Teen anxiety, depression, and stress are at record highs. Develop peer support networks, 
                    awareness campaigns, or wellness resources for students.
                  </p>
                  <a 
                    href="https://www.nimh.nih.gov/health/topics/child-and-adolescent-mental-health" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Learn More 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Article 4: Food Insecurity */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop" 
                    alt="Food Insecurity and Hunger"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold mb-3">Community</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Food Insecurity & Hunger</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Many families struggle with access to nutritious food. Launch food drives, community gardens, 
                    or meal programs to combat hunger in your area.
                  </p>
                  <a 
                    href="https://www.feedingamerica.org/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Learn More 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Article 5: Digital Divide */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop" 
                    alt="Digital Divide and Technology Access"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-semibold mb-3">Technology</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Divide & Tech Access</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Not everyone has equal access to technology and internet connectivity. Build programs to provide 
                    devices, teach digital literacy, or create accessible tech solutions.
                  </p>
                  <a 
                    href="https://www.pewresearch.org/internet/fact-sheet/internet-broadband/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Learn More 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Article 6: Youth Homelessness */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=400&fit=crop" 
                    alt="Housing and Homelessness"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold mb-3">Social Impact</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Housing & Homelessness</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Youth homelessness affects thousands of young people. Organize donation drives, 
                    volunteer at shelters, or advocate for affordable housing policies.
                  </p>
                  <a 
                    href="https://www.covenanthouse.org/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Learn More 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Project Planner Section */}
        <div id="project-planner" className="py-24 scroll-mt-24">
          <div className="text-center mb-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Project Planner</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Plan, organize, and track your passion projects with our comprehensive planning tools. 
                Set goals, create timelines, and measure your progress.
              </p>
            </div>
          </div>
          
          {/* Timeline */}
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Sample Project Timeline</h3>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-indigo-500 to-purple-600"></div>
                
                {/* Timeline Items */}
                <div className="space-y-8 relative">
                  
                  {/* October 1 */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      <div className="text-center">
                        <div className="text-xs">Oct</div>
                        <div className="text-lg leading-tight">1</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-purple-50 rounded-xl p-6 shadow-md border-l-4 border-purple-500">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Goal 1: Project Kickoff</h4>
                      <p className="text-gray-600 text-sm">Define project scope, objectives, and initial research phase.</p>
                    </div>
                  </div>

                  {/* October 8 */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      <div className="text-center">
                        <div className="text-xs">Oct</div>
                        <div className="text-lg leading-tight">8</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-indigo-50 rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Task 1: Complete Research</h4>
                      <p className="text-gray-600 text-sm">Gather data, identify stakeholders, and analyze similar projects.</p>
                    </div>
                  </div>

                  {/* October 15 */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      <div className="text-center">
                        <div className="text-xs">Oct</div>
                        <div className="text-lg leading-tight">15</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-purple-50 rounded-xl p-6 shadow-md border-l-4 border-purple-600">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Goal 2: Build Project Plan</h4>
                      <p className="text-gray-600 text-sm">Create detailed timeline, assign responsibilities, and set milestones.</p>
                    </div>
                  </div>

                  {/* October 22 */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      <div className="text-center">
                        <div className="text-xs">Oct</div>
                        <div className="text-lg leading-tight">22</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-indigo-50 rounded-xl p-6 shadow-md border-l-4 border-indigo-600">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Task 2: Launch Phase 1</h4>
                      <p className="text-gray-600 text-sm">Begin implementation, test initial prototypes, gather feedback.</p>
                    </div>
                  </div>

                  {/* October 29 */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      <div className="text-center">
                        <div className="text-xs">Oct</div>
                        <div className="text-lg leading-tight">29</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-purple-50 rounded-xl p-6 shadow-md border-l-4 border-purple-700">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Goal 3: Mid-Point Review</h4>
                      <p className="text-gray-600 text-sm">Evaluate progress, adjust strategy, and refine approach.</p>
                    </div>
                  </div>

                  {/* November 5 */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-indigo-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      <div className="text-center">
                        <div className="text-xs">Nov</div>
                        <div className="text-lg leading-tight">5</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-indigo-50 rounded-xl p-6 shadow-md border-l-4 border-indigo-700">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Task 3: Scale & Expand</h4>
                      <p className="text-gray-600 text-sm">Increase outreach, recruit volunteers, expand project scope.</p>
                    </div>
                  </div>

                  {/* November 12 */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      <div className="text-center">
                        <div className="text-xs">Nov</div>
                        <div className="text-lg leading-tight">12</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-purple-50 rounded-xl p-6 shadow-md border-l-4 border-purple-800">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Goal 4: Community Engagement</h4>
                      <p className="text-gray-600 text-sm">Host events, gather testimonials, build partnerships.</p>
                    </div>
                  </div>

                  {/* November 19 */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-indigo-800 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      <div className="text-center">
                        <div className="text-xs">Nov</div>
                        <div className="text-lg leading-tight">19</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-indigo-50 rounded-xl p-6 shadow-md border-l-4 border-indigo-800">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Task 4: Document Impact</h4>
                      <p className="text-gray-600 text-sm">Collect data, measure outcomes, prepare impact report.</p>
                    </div>
                  </div>

                  {/* November 26 */}
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      <div className="text-center">
                        <div className="text-xs">Nov</div>
                        <div className="text-lg leading-tight">26</div>
                      </div>
                    </div>
                    <div className="flex-1 bg-purple-50 rounded-xl p-6 shadow-md border-l-4 border-purple-900">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Goal 5: Project Completion</h4>
                      <p className="text-gray-600 text-sm">Finalize deliverables, celebrate achievements, plan next steps.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Hub Section */}
        <div id="resource-hub" className="py-24 scroll-mt-24">
          <div className="text-center mb-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Resource Hub</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Access funding opportunities, mentorship programs, online courses, and tools to support your passion projects. 
                Everything you need in one place.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Funding & Grants */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop" 
                    alt="Funding and Grants"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold mb-3">
                    Funding
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Youth Grants & Funding</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Discover grant opportunities specifically for youth-led projects. Find funding from $500 to $10,000+ for your passion project.
                  </p>
                  <a
                    href="https://www.youthgrantmakers.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Explore Grants
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Mentorship Programs */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop" 
                    alt="Mentorship Programs"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mb-3">
                    Mentorship
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Find a Mentor</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Connect with experienced professionals who can guide your project. Get advice from industry experts and successful project leaders.
                  </p>
                  <a
                    href="https://www.score.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Find Mentors
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Online Courses */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=400&fit=crop" 
                    alt="Online Courses and Learning"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold mb-3">
                    Learning
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Free Online Courses</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Access thousands of free courses on entrepreneurship, leadership, coding, design, and more. Build skills for your project.
                  </p>
                  <a
                    href="https://www.coursera.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Browse Courses
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Project Management Tools */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop" 
                    alt="Project Management Tools"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold mb-3">
                    Tools
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Project Management Tools</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Organize tasks, track progress, and collaborate with your team. Free tools like Trello, Notion, and Asana for students.
                  </p>
                  <a
                    href="https://trello.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Get Started
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Marketing & Social Media */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop" 
                    alt="Marketing and Social Media"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-semibold mb-3">
                    Marketing
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Marketing Your Project</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Learn how to promote your passion project, build a social media presence, and reach your target audience effectively.
                  </p>
                  <a
                    href="https://www.hubspot.com/resources"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Learn Marketing
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Legal & Nonprofit Resources */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop" 
                    alt="Legal and Nonprofit Resources"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold mb-3">
                    Legal
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Starting a Nonprofit</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    Resources for registering your project as a nonprofit, understanding 501(c)(3) status, and managing organizational structure.
                  </p>
                  <a
                    href="https://www.irs.gov/charities-non-profits/charitable-organizations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration Section */}
        <div id="collaboration" className="py-24 scroll-mt-24">
          <div className="text-center mb-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Collaboration</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Connect with like-minded students, find project partners, and collaborate on passion projects. 
                Build your network and learn from others.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4">
            {/* Create New Post Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Create a New Post
              </h3>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label htmlFor="post-title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Post Title
                  </label>
                  <input
                    type="text"
                    id="post-title"
                    name="title"
                    value={postFormData.title}
                    onChange={handlePostInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    placeholder="e.g., Looking for co-founder for environmental project"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="post-category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="post-category"
                    name="category"
                    value={postFormData.category}
                    onChange={handlePostInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="looking-for-partners">Looking for Partners</option>
                    <option value="project-showcase">Project Showcase</option>
                    <option value="advice-needed">Advice Needed</option>
                    <option value="resources-sharing">Resources & Tips</option>
                    <option value="success-stories">Success Stories</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="post-content" className="block text-sm font-semibold text-gray-700 mb-2">
                    Post Content
                  </label>
                  <textarea
                    id="post-content"
                    name="content"
                    value={postFormData.content}
                    onChange={handlePostInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors resize-none"
                    placeholder="Share your ideas, questions, or experiences..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg transform hover:scale-[1.02]"
                >
                  Post to Community
                </button>
              </form>
            </div>

            {/* Filter & Sort */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-pink-500 text-white hover:bg-pink-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All Posts
              </button>
              <button 
                onClick={() => setActiveFilter('looking-for-partners')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeFilter === 'looking-for-partners' 
                    ? 'bg-pink-500 text-white hover:bg-pink-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Looking for Partners
              </button>
              <button 
                onClick={() => setActiveFilter('project-showcase')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeFilter === 'project-showcase' 
                    ? 'bg-pink-500 text-white hover:bg-pink-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Project Showcase
              </button>
              <button 
                onClick={() => setActiveFilter('advice-needed')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeFilter === 'advice-needed' 
                    ? 'bg-pink-500 text-white hover:bg-pink-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Advice Needed
              </button>
              <button 
                onClick={() => setActiveFilter('resources-sharing')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  activeFilter === 'resources-sharing' 
                    ? 'bg-pink-500 text-white hover:bg-pink-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Resources & Tips
              </button>
            </div>

            {/* Forum Posts */}
            <div id="forum-posts" className="space-y-6">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <p className="text-gray-500 text-lg font-medium mb-2">No posts yet</p>
                  <p className="text-gray-400 text-sm">Be the first to share your project or ask for collaboration!</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${post.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                            {post.authorInitials}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{post.author}</h4>
                            <p className="text-sm text-gray-500">{getTimeAgo(post.timestamp)}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 ${getCategoryColor(post.category)} rounded-full text-xs font-semibold`}>
                          {getCategoryLabel(post.category)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-pink-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{post.likes} Likes</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-pink-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{post.comments} Comments</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-pink-600 transition-colors ml-auto">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Reflection Journal Section */}
        <div id="reflection-journal" className="py-24 scroll-mt-24">
          <div className="text-center mb-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Reflection Journal</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Document your journey, reflect on your experiences, and track your personal growth. 
                Perfect for college applications and self-improvement.
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4">
            {/* New Journal Entry */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Write a New Entry
              </h3>
              <form onSubmit={handleJournalSubmit} className="space-y-4">
                <div>
                  <label htmlFor="entry-date" className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="entry-date"
                    name="date"
                    value={journalFormData.date}
                    onChange={handleJournalInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="entry-title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Entry Title (Optional)
                  </label>
                  <input
                    type="text"
                    id="entry-title"
                    name="title"
                    value={journalFormData.title}
                    onChange={handleJournalInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    placeholder="e.g., First community event completed"
                  />
                </div>
                <div>
                  <label htmlFor="journal-entry" className="block text-sm font-semibold text-gray-700 mb-2">
                    What did you accomplish today? What progress did you make?
                  </label>
                  <textarea
                    id="journal-entry"
                    name="content"
                    value={journalFormData.content}
                    onChange={handleJournalInputChange}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-none font-sans"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold py-4 px-6 rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-lg transform hover:scale-[1.02]"
                  >
                    Save Entry
                  </button>
                  <button
                    type="button"
                    onClick={clearJournalForm}
                    className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Past Entries */}
            <div id="past-entries" className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                </svg>
                Past Entries
              </h3>

              {journalEntries.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg font-medium mb-2">No journal entries yet</p>
                  <p className="text-gray-400 text-sm">Start documenting your passion project journey by writing your first entry above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {journalEntries.map((entry) => (
                    <div key={entry.id} className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-cyan-700">{formatJournalDate(entry.date)}</p>
                            <p className="text-xs text-gray-500">{getTimeAgo(entry.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                      {entry.title && (
                        <h4 className="text-lg font-bold text-gray-900 mb-3">{entry.title}</h4>
                      )}
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
