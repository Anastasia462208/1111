import { useState } from 'react'
import Menu from './Menu.jsx'
import WordsMode from './WordsMode.jsx'
import TextMode from './TextMode.jsx'
import './App.css'

function App() {
  const [mode, setMode] = useState('menu') // 'menu', 'words', 'texts'

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode)
  }

  const handleBackToMenu = () => {
    setMode('menu')
  }

  if (mode === 'menu') {
    return <Menu onSelectMode={handleSelectMode} />
  }

  if (mode === 'words') {
    return <WordsMode onBackToMenu={handleBackToMenu} />
  }

  if (mode === 'texts') {
    return <TextMode onBackToMenu={handleBackToMenu} />
  }

  return null
}

export default App

