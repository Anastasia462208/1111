import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle2, XCircle, BookOpen, Trophy, RotateCcw, Sparkles } from 'lucide-react'
import './App.css'
import wordsData from './assets/words_database.json'

function WordsMode({ onBackToMenu }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completedWords, setCompletedWords] = useState(0)
  const [streak, setStreak] = useState(0)
  const [shuffledWords, setShuffledWords] = useState([])

  useEffect(() => {
    // Перемешиваем слова при загрузке
    const shuffled = [...wordsData].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
  }, [])

  const currentWord = shuffledWords[currentWordIndex]
  const totalWords = shuffledWords.length

  const handleAnswer = (answer) => {
    if (answered) return

    setSelectedAnswer(answer)
    setAnswered(true)
    setShowExplanation(true)

    if (answer === currentWord.correct) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
    setCompletedWords(completedWords + 1)
  }

  const handleNext = () => {
    if (currentWordIndex < totalWords - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setAnswered(false)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handleRestart = () => {
    const shuffled = [...wordsData].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
    setCurrentWordIndex(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCompletedWords(0)
    setStreak(0)
  }

  const getButtonVariant = (answer) => {
    if (!answered) return 'outline'
    if (answer === currentWord.correct) return 'default'
    if (answer === selectedAnswer && answer !== currentWord.correct) return 'destructive'
    return 'outline'
  }

  const getButtonIcon = (answer) => {
    if (!answered) return null
    if (answer === currentWord.correct) return <CheckCircle2 className="w-5 h-5" />
    if (answer === selectedAnswer && answer !== currentWord.correct) return <XCircle className="w-5 h-5" />
    return null
  }

  const progress = (completedWords / totalWords) * 100
  const accuracy = completedWords > 0 ? Math.round((score / completedWords) * 100) : 0

  if (shuffledWords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-indigo-600">Загрузка...</div>
      </div>
    )
  }

  if (currentWordIndex >= totalWords) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-2 border-indigo-200">
          <CardHeader className="text-center space-y-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <Trophy className="w-20 h-20 mx-auto animate-bounce" />
            <CardTitle className="text-4xl font-bold">Поздравляем!</CardTitle>
            <CardDescription className="text-indigo-100 text-lg">
              Вы завершили тренировку
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 text-center">
                <div className="text-5xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-green-700 mt-2">Правильных ответов</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 text-center">
                <div className="text-5xl font-bold text-blue-600">{accuracy}%</div>
                <div className="text-sm text-blue-700 mt-2">Точность</div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {score === totalWords ? '🎉 Идеально! Все ответы верны!' : 
                 accuracy >= 80 ? '👏 Отличный результат!' :
                 accuracy >= 60 ? '👍 Хорошая работа!' :
                 '💪 Продолжайте тренироваться!'}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 pb-8">
            <Button 
              onClick={handleRestart} 
              size="lg"
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-6 text-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Начать заново
            </Button>
            <Button 
              onClick={onBackToMenu} 
              size="lg"
              variant="outline"
              className="flex-1 px-8 py-6 text-lg border-2"
            >
              Вернуться в меню
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="text-center space-y-2 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Чередующиеся гласные
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Тренажер по русскому языку</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">{completedWords}/{totalWords}</div>
              <div className="text-sm text-gray-600 mt-1">Прогресс</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-100 hover:border-green-300 transition-all">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600 mt-1">Верно</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
              <div className="text-sm text-gray-600 mt-1">Точность</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600 flex items-center justify-center gap-1">
                {streak > 0 && <Sparkles className="w-6 h-6" />}
                {streak}
              </div>
              <div className="text-sm text-gray-600 mt-1">Серия</div>
            </CardContent>
          </Card>
        </div>

        {/* Прогресс бар */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="text-sm text-gray-600 text-center">
            Вопрос {currentWordIndex + 1} из {totalWords}
          </div>
        </div>

        {/* Основная карточка */}
        <Card className="shadow-2xl border-2 border-indigo-200 animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {currentWord.rule}
              </Badge>
              {streak >= 3 && (
                <Badge className="bg-yellow-400 text-yellow-900 border-yellow-500 animate-pulse">
                  🔥 Серия {streak}!
                </Badge>
              )}
            </div>
            <CardTitle className="text-3xl mt-4">Вставьте пропущенную букву</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            {/* Слово с пропуском */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-800 tracking-wider mb-4 font-mono">
                {currentWord.word.split('_').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < currentWord.word.split('_').length - 1 && (
                      <span className="inline-block text-xl font-bold text-gray-800 font-mono leading-none relative bottom-[-0.05em]">...</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Варианты ответов */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['а', 'о', 'е', 'и'].map((letter) => (
                <Button
                  key={letter}
                  onClick={() => handleAnswer(letter)}
                  disabled={answered}
                  variant={getButtonVariant(letter)}
                  size="lg"
                  className={`text-3xl h-20 font-bold transition-all transform hover:scale-105 ${
                    !answered ? 'hover:shadow-lg' : ''
                  } ${
                    answered && letter === currentWord.correct 
                      ? 'bg-green-500 hover:bg-green-600 text-white border-green-600' 
                      : ''
                  } ${
                    answered && letter === selectedAnswer && letter !== currentWord.correct
                      ? 'bg-red-500 hover:bg-red-600 text-white border-red-600'
                      : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {letter.toUpperCase()}
                    {getButtonIcon(letter)}
                  </span>
                </Button>
              ))}
            </div>

            {/* Объяснение */}
            {showExplanation && (
              <div className={`p-6 rounded-lg border-2 animate-fade-in ${
                selectedAnswer === currentWord.correct 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-start gap-3">
                  {selectedAnswer === currentWord.correct ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="space-y-2">
                    <div className="font-bold text-lg">
                      {selectedAnswer === currentWord.correct ? 'Правильно!' : 'Неправильно!'}
                    </div>
                    <div className="text-gray-700">
                      Правильный ответ: <span className="font-bold text-xl">{currentWord.fullWord}</span>
                    </div>
                    <div className="text-gray-600 mt-2">
                      <span className="font-semibold">Правило:</span> {currentWord.explanation}
                    </div>
                    {currentWord.sentence && (
                      <div className="text-gray-700 mt-3 p-3 bg-white/50 rounded border border-gray-200">
                        <span className="font-semibold">Пример:</span> {currentWord.sentence}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pb-6">
            <Button 
              onClick={onBackToMenu} 
              variant="outline"
              className="border-2 hover:bg-gray-100"
            >
              ← Вернуться в меню
            </Button>
            {answered && currentWordIndex < totalWords - 1 && (
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6"
              >
                Следующее слово →
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default WordsMode

