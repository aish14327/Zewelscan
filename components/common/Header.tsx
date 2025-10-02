import React from 'react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <header className="bg-zinc-900/50 backdrop-blur-sm shadow-lg shadow-black/20 sticky top-0 z-10 border-b border-purple-500/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="w-16">
            {onBack && (
              <button
                onClick={onBack}
                className="text-purple-400 hover:text-purple-300 transition duration-150 ease-in-out p-2 rounded-full hover:bg-purple-500/10"
                aria-label="Go back"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex-1 text-center">
             <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-purple-300 tracking-wider">
                {title}
            </h1>
          </div>
          <div className="w-16"></div> {/* Spacer to balance the layout */}
        </div>
      </div>
    </header>
  );
};

export default Header;