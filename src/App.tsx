import React, { useState } from 'react';
import { Garage } from './components/Garage';
import { Winners } from './components/Winners';
import { Header } from './components/Header';


function App() {
  const [currentView, setCurrentView] = useState<'garage' | 'winners'>('garage');

  return (
    <div className="min-h-screen bg-gray-900">
      <Header activeTab={currentView} onTabChange={setCurrentView} />
      <main>
        {currentView === 'garage' ? <Garage /> : <Winners />}
      </main>
    </div>
  );
}

export default App;