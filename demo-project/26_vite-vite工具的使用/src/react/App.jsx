import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(100)

  return (
    <div className="app">
      <h2>React App计数器: {count}</h2>
      <button onClick={e => setCount(count+1)}>+1</button>
      <button onClick={e => setCount(count-1)}>-1</button>
    </div>
  )
}

export default App
