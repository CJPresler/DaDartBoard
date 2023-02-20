import React, { useCallback, useState } from 'react';
import './App.css';
import { Dartboard, Segment } from './Utillities/Dartboard';

function App() {
  const [/*unused*/, setDarboard] = useState<Dartboard>();
  const [lastSegmentHit, setLastSegmentHit] = useState<Segment>();

  const onSegmentHit = useCallback((segment: Segment) => {
    setLastSegmentHit(segment);
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={async () => {setDarboard(await Dartboard.ConnectToBoard(onSegmentHit))}}>Connect to board</button>
        <h2>{lastSegmentHit?.LongName}</h2>
      </header>
    </div>
  );
}

export default App;
