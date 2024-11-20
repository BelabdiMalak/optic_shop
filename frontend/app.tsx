import { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Vite + TypeScript</h1>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>Count is {count}</button>
      </div>
      <p>Click on the button to increase the count</p>
    </div>
  );
};

export default App;
