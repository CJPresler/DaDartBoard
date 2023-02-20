import React, { useState } from 'react';
import './App.css';
import { Dartboard } from './Utillities/Dartboard';

function App() {
  const [dartboard, setDarboard] = useState<Dartboard>();

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={async () => {setDarboard(await Dartboard.ConnectToBoard())}}>Connect to board</button>
      </header>
    </div>
  );
}

export default App;
