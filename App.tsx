import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import WordList from './pages/WordList';
import { AppState, Difficulty, Topic, WordStatus } from './types';
import { INITIAL_WORDS } from './constants';
import { getStoredProgress, saveProgress, initializeProgress, updateWordProgress } from './services/srsService';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  
  // Initialize state synchronously with data from localStorage
  const [appState, setAppState] = useState<AppState>({
    words: INITIAL_WORDS,
    progress: getStoredProgress(), 
  });
  
  // Practice filters state
  const [practiceFilters, setPracticeFilters] = useState<{ difficulty: Difficulty | 'All', topic: Topic | 'All' }>({
    difficulty: 'All',
    topic: 'All'
  });

  // Word List filters state (lifted from WordList to allow Dashboard to control it)
  const [wordListFilters, setWordListFilters] = useState<{ 
    difficulty: string, 
    topic: string, 
    status: string, 
    search: string 
  }>({
    difficulty: 'All',
    topic: 'All',
    status: 'All',
    search: ''
  });

  const handleUpdateProgress = (wordId: string, isCorrect: boolean) => {
    setAppState(prev => {
      const currentProgress = prev.progress[wordId] || initializeProgress(wordId);
      const updatedProgress = updateWordProgress(currentProgress, isCorrect);
      
      const newProgressMap = {
        ...prev.progress,
        [wordId]: updatedProgress
      };
      
      saveProgress(newProgressMap);
      return { ...prev, progress: newProgressMap };
    });
  };

  const handleDashboardFilterNavigate = (status: string) => {
    setWordListFilters(prev => ({ ...prev, status, search: '', difficulty: 'All', topic: 'All' }));
    setActivePage('list');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard 
            state={appState} 
            onNavigate={setActivePage} 
            onFilterSelect={handleDashboardFilterNavigate}
          />
        );
      case 'practice':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-slate-900">Practice Session</h1>
              {/* Quick Filters for Practice */}
              <div className="flex space-x-2 mt-4 md:mt-0">
                <select 
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                  value={practiceFilters.difficulty}
                  onChange={(e) => setPracticeFilters({...practiceFilters, difficulty: e.target.value as any})}
                >
                   <option value="All">All Levels</option>
                   <option value={Difficulty.Basic}>Basic</option>
                   <option value={Difficulty.Intermediate}>Intermediate</option>
                   <option value={Difficulty.Advanced}>Advanced</option>
                </select>
                <select 
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                  value={practiceFilters.topic}
                  onChange={(e) => setPracticeFilters({...practiceFilters, topic: e.target.value as any})}
                >
                   <option value="All">All Topics</option>
                   {Object.values(Topic).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <Practice 
              words={appState.words} 
              progress={appState.progress} 
              updateProgress={handleUpdateProgress}
              filters={practiceFilters}
            />
          </div>
        );
      case 'list':
        return (
          <WordList 
            words={appState.words} 
            progress={appState.progress} 
            updateProgress={handleUpdateProgress} 
            filters={wordListFilters}
            setFilters={setWordListFilters}
          />
        );
      default:
        return (
          <Dashboard 
            state={appState} 
            onNavigate={setActivePage} 
            onFilterSelect={handleDashboardFilterNavigate}
          />
        );
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {renderContent()}
    </Layout>
  );
}

export default App;