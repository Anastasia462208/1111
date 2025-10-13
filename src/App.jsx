import { useState } from 'react'
import Menu from './Menu.jsx'
import WordsMode from './WordsMode.jsx'
import TextMode from './TextMode.jsx'
import Header from './Header.jsx'
import './App.css'

function App() {
  const [mode, setMode] = useState('menu') // 'menu', 'words', 'texts'

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode)
  }

  const handleBackToMenu = () => {
    setMode('menu')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {mode === 'menu' && <Menu onSelectMode={handleSelectMode} />}
        {mode === 'words' && <WordsMode onBackToMenu={handleBackToMenu} />}
        {mode === 'texts' && <TextMode onBackToMenu={handleBackToMenu} />}
      </main>
    </div>
  )
}

export default App

