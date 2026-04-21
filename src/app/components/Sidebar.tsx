'use client';

import React from 'react';

export default function Sidebar() {
  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // keep home item separate so it always renders first
  const homeItem = {
    label: 'Problem Database',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zM13 13.5h5.5v-2H13v2zm0 3h5.5v-2H13v2zm-4.5-5.5L11 13.5l-2.5 2.5L6 13.5l2.5-2.5z"/>
    </svg>,
    bgColor: 'bg-blue-600',
    sectionId: 'problem-database'
  };

  const navigationItems = [
    {
      // Project Planner
      label: 'Project Planner',
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
      </svg>,
      bgColor: 'bg-indigo-700',
      sectionId: 'project-planner'
    },
    {
      // Resource Hub
      label: 'Resource Hub',
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>,
      bgColor: 'bg-purple-600',
      sectionId: 'resource-hub'
    },
    {
      // Collaboration
      label: 'Collaboration',
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>,
      bgColor: 'bg-purple-500',
      sectionId: 'collaboration'
    },
    {
      // Reflection Journal
      label: 'Reflection Journal',
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>,
      bgColor: 'bg-purple-400',
      sectionId: 'reflection-journal'
    }
  ];

  return (
  <div className="fixed top-0 left-0 h-screen w-24 bg-white shadow-xl z-[9999]">
    <div className="flex flex-col h-full">
          
          {/* Navigation: render home first so it stays at the top */}
          {/* Reduced top padding so icons sit slightly higher */}
          <nav className="flex-1 px-1.5 pt-3 pb-4 space-y-2">
            {/* Explicit Home link so it always stays at the top */}
            <button
              onClick={() => scrollToSection('home')}
              className="flex flex-col items-center justify-start p-2 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group text-center w-full cursor-pointer"
            >
              <div className={`w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"></path></svg>
              </div>
              <span className="text-xs mt-1 font-semibold leading-tight max-w-[5rem] break-words">Home</span>
            </button>

            {/* Problem Database (kept as a separate item below Home) */}
            <button
              onClick={() => scrollToSection(homeItem.sectionId)}
              className="flex flex-col items-center justify-center p-2 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group text-center w-full cursor-pointer"
            >
              <div className={`w-12 h-12 ${homeItem.bgColor} rounded-xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                {/* render the existing icon but slightly larger */}
                {homeItem.icon}
              </div>
              <span className="text-xs mt-2 font-semibold leading-tight max-w-[5rem] break-words text-center">{homeItem.label}</span>
            </button>

            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.sectionId)}
                className="flex flex-col items-center justify-start p-2 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group text-center w-full cursor-pointer"
              >
                <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                  {item.icon}
                </div>
                <span className="text-xs mt-1 font-semibold leading-tight max-w-[5rem] break-words text-center">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer intentionally removed per design change */}
        </div>
    </div>
  );
} 