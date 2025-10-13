import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle2, XCircle, BookOpen, Trophy, RotateCcw, Sparkles } from 'lucide-react'
import './App.css'
import wordsData from './assets/words_database.json'
import runningBoyGif from './assets/i/running_boy_new.gif'
import finishFlagImg from './assets/i/finish_flag_new.png'

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
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-1">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Заголовок */}
        <div className="text-center space-y-0.5 animate-fade-in">
          <div className="flex items-center justify-center gap-0.5 mb-0.5">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Чередующиеся гласные
            </h1>
          </div>
          <p className="text-gray-600 text-sm">Тренажер по русскому языку</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all">
            <CardContent className="pt-2 text-center">
              <div className="text-xl font-bold text-indigo-600">{completedWords}/{totalWords}</div>
              <div className="text-xs text-gray-600 mt-0.5">Прогресс</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-100 hover:border-green-300 transition-all">
            <CardContent className="pt-2 text-center">
              <div className="text-xl font-bold text-green-600">{score}</div>
              <div className="text-xs text-gray-600 mt-0.5">Верно</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all">
            <CardContent className="pt-2 text-center">
              <div className="text-xl font-bold text-blue-600">{accuracy}%</div>
              <div className="text-xs text-gray-600 mt-0.5">Точность</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all">
            <CardContent className="pt-2 text-center">
              <div className="text-xl font-bold text-purple-600 flex items-center justify-center gap-0.5">
                {streak > 0 && <Sparkles className="w-4 h-4" />}
                {streak}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">Серия</div>
            </CardContent>
          </Card>
        </div>

        {/* Прогресс бар */}
        <div className="relative flex items-center w-full space-x-2">
          <img src={runningBoyGif} alt="Бегущий мальчик" className="w-6 h-6" />
          <div className="flex-1 space-y-0.5">
            <Progress value={progress} className="h-1.5" />
            <div className="text-xs text-gray-600 text-center">
              Вопрос {currentWordIndex + 1} из {totalWords}
            </div>
          </div>
          <img src={finishFlagImg} alt="Флаг финиша" className="w-6 h-6" />
        </div>

        {/* Основная карточка */}
        <Card className="shadow-2xl border-2 border-indigo-200 animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg p-2">
            <div className="flex items-center justify-between">

              {streak >= 3 && (
                <Badge className="bg-yellow-400 text-yellow-900 border-yellow-500 animate-pulse text-xs py-0.5 px-1">
                  🔥 Серия {streak}!
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl mt-1">Вставьте пропущенную букву</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-3">
            {/* Слово с пропуском */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 tracking-wider mb-1 font-mono">
                {currentWord.word.split("_").map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < currentWord.word.split("_").length - 1 && (
                      <span className="inline-block text-base font-bold text-gray-800 font-mono leading-none relative bottom-[-0.05em]">...</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Варианты ответов */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {["а", "о", "е", "и"].map((letter) => (
                <Button
                  key={letter}
                  onClick={() => handleAnswer(letter)}
                  disabled={answered}
                  variant={getButtonVariant(letter)}
                  size="sm"
                  className={`text-xl h-14 font-bold transition-all transform hover:scale-105 ${
                    !answered ? "hover:shadow-lg" : ""
                  } ${
                    answered && letter === currentWord.correct 
                      ? "bg-green-500 hover:bg-green-600 text-white border-green-600" 
                      : ""
                  } ${
                    answered && letter === selectedAnswer && letter !== currentWord.correct
                      ? "bg-red-500 hover:bg-red-600 text-white border-red-600"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-0.5">
                    {letter.toUpperCase()}
                    {getButtonIcon(letter)}
                  </span>
                </Button>
              ))}
            </div>

            {/* Объяснение */}
            {showExplanation && (
              <div className={`p-3 rounded-lg border-2 animate-fade-in ${
                selectedAnswer === currentWord.correct 
                  ? "bg-green-50 border-green-300" 
                  : "bg-red-50 border-red-300"
              }`}>
                <div className="flex items-start gap-1">
                  {selectedAnswer === currentWord.correct ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm">
                      {selectedAnswer === currentWord.correct ? "Правильно!" : "Неправильно!"}
                    </div>
                    <div className="text-gray-700 text-xs">
                      Правильный ответ: <span className="font-bold text-base">{currentWord.fullWord}</span>
                    </div>
                    {currentWord.explanation && !currentWord.explanation.startsWith('ИСКЛЮЧЕНИЕ!') && (
                      <div className="text-gray-600 text-xs mt-0.5">
                        <span className="font-semibold">Правило:</span> {currentWord.explanation}
                      </div>
                    )}
                    {currentWord.explanation && currentWord.explanation.startsWith('ИСКЛЮЧЕНИЕ!') && (
                      <div className="text-gray-600 text-xs mt-0.5">
                        <span className="font-semibold">Примечание:</span> {currentWord.explanation}
                      </div>
                    )}
                    {currentWord.sentence && (
                      <div className="text-gray-700 text-xs mt-1 p-1.5 bg-white/50 rounded border border-gray-200">
                        <span className="font-semibold">Пример:</span> {currentWord.sentence}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pb-3 pt-1">
            <Button 
              onClick={onBackToMenu} 
              variant="outline"
              className="border-2 hover:bg-gray-100 text-xs px-3 py-1.5"
            >
              ← В меню
            </Button>
            {answered && currentWordIndex < totalWords - 1 && (
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-1.5"
              >
                Следующее →
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default WordsMode

