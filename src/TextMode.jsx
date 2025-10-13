import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle2, XCircle, RotateCcw, AlertCircle } from 'lucide-react'
import textExercises from './assets/text_exercises.json'
import runningBoyGif from './assets/i/running_boy_new.gif'
import finishFlagImg from './assets/i/finish_flag_new.png'

function TextMode({ onBackToMenu }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [completedExercises, setCompletedExercises] = useState(0)

  const currentExercise = textExercises[currentExerciseIndex]
  const totalExercises = textExercises.length

  const handleAnswerChange = (blankIndex, value) => {
    if (submitted) return
    setUserAnswers({
      ...userAnswers,
      [blankIndex]: value
    })
  }

  const checkAnswers = () => {
    let allCorrect = true
    currentExercise.blanks.forEach((blank, index) => {
      if (userAnswers[index] !== blank.correct) {
        allCorrect = false
      }
    })
    return allCorrect
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const isCorrect = checkAnswers()
    if (isCorrect) {
      setScore(score + 1)
    }
    setCompletedExercises(completedExercises + 1)
  }

  const handleNext = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setUserAnswers({})
      setSubmitted(false)
    }
  }

  const handleRestart = () => {
    setCurrentExerciseIndex(0)
    setUserAnswers({})
    setSubmitted(false)
    setScore(0)
    setCompletedExercises(0)
  }

    const renderTextWithBlanks = () => {
    const text = currentExercise.text
    const blanks = currentExercise.blanks
    const parts = []
    let lastIndex = 0
    let blankCounter = 0

    const textParts = text.split('_')

    textParts.forEach((part, index) => {
      parts.push(
        <span key={`text-part-${index}`}>{part}</span>
      )

      if (index < textParts.length - 1) {
        const blank = blanks[blankCounter]
        if (!blank) {
          console.error(`Ошибка: Недостаточно данных для пропуска ${blankCounter} в упражнении ${currentExercise.id}`)
          parts.push(<span key={`error-blank-${blankCounter}`} className="text-red-500">[ОШИБКА ПРОПУСКА]</span>)
          blankCounter++
          return
        }

        const userAnswer = userAnswers[blankCounter]
        const isCorrect = submitted && userAnswer === blank.correct
        const isWrong = submitted && userAnswer !== blank.correct

        parts.push(
          <select
            key={`blank-${blankCounter}`}
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(blankCounter, e.target.value)}
            disabled={submitted}
            className={`mx-1 px-2 py-1 border-2 rounded font-bold text-lg ${
              submitted
                ? isCorrect
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-red-100 border-red-500 text-red-700'
                : 'border-purple-400 bg-white hover:border-purple-600'
            }`}
          >
            <option value="">...</option>
            {blank.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
        blankCounter++
      }
    })

    return parts
  }

  const allAnswered = currentExercise.blanks.every((_, index) => userAnswers[index])
  const isCorrect = submitted && checkAnswers()
  const progress = (completedExercises / totalExercises) * 100
  const accuracy = completedExercises > 0 ? Math.round((score / completedExercises) * 100) : 0

  if (currentExerciseIndex >= totalExercises) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl flex items-center gap-2">
              🎉 Поздравляем!
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Вы завершили все текстовые упражнения
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-300">
                <div className="text-4xl font-bold text-green-700">{score}/{totalExercises}</div>
                <div className="text-green-600 font-medium mt-2">Правильных текстов</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-300">
                <div className="text-4xl font-bold text-blue-700">{accuracy}%</div>
                <div className="text-blue-600 font-medium mt-2">Точность</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={handleRestart} className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600">
              <RotateCcw className="w-4 h-4 mr-2" />
              Начать заново
            </Button>
            <Button onClick={onBackToMenu} variant="outline" className="flex-1">
              Вернуться в меню
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-1">
      <div className="max-w-4xl mx-auto space-y-2 py-2">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            📝 Текстовые упражнения
          </h1>
          <p className="text-gray-600 text-sm">Заполните все пропуски правильно</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{completedExercises}/{totalExercises}</div>
              <div className="text-xs text-gray-600 mt-0.5">Прогресс</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-xs text-gray-600 mt-0.5">Верно</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
              <div className="text-xs text-gray-600 mt-0.5">Точность</div>
            </CardContent>
          </Card>
        </div>

        <div className="relative flex items-center w-full space-x-2">
          <img src={runningBoyGif} alt="Бегущий мальчик" className="w-6 h-6" />
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Упражнение {currentExerciseIndex + 1} из {totalExercises}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <img src={finishFlagImg} alt="Флаг финиша" className="w-6 h-6" />
        </div>

        <Card className="shadow-xl border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg p-2">
            <Badge className="w-fit bg-white/20 text-white border-white/30 text-xs py-0.5 px-1 mb-1">
              Текст #{currentExercise.id}
            </Badge>
            <CardTitle className="text-xl">Вставьте пропущенные буквы</CardTitle>
            <CardDescription className="text-white/90 text-sm">
              Все пропуски должны быть заполнены правильно
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 space-y-3">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg border-2 border-purple-200">
              <div className="text-sm leading-relaxed">
                {renderTextWithBlanks()}
              </div>
            </div>

            {!submitted && (
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                <AlertCircle className="w-3 h-3 text-blue-600" />
                <span>Выберите букву для каждого пропуска, затем нажмите "Проверить"</span>
              </div>
            )}

            {submitted && (
              <div className={`p-3 rounded-lg border-2 animate-fade-in ${
                isCorrect 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-2">
                    <div className="font-bold text-md">
                      {isCorrect ? 'Отлично! Все правильно!' : 'Есть ошибки!'}
                    </div>
                    {!isCorrect && (
                      <div className="space-y-1">
                        <div className="font-bold text-sm">Правильные ответы:</div>
                        {currentExercise.blanks.map((blank, index) => (
                          <div key={index} className="text-xs">
                            <span className="font-bold">{blank.word}</span> — {blank.correct} 
                            <span className="text-gray-600 ml-1">({blank.rule})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pb-2 pt-1">
            <Button 
              onClick={onBackToMenu} 
              variant="outline"
              className="border-2 hover:bg-gray-100 text-xs px-3 py-1.5"
            >
              ← В меню
            </Button>
            {!submitted ? (
              <Button 
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-1.5"
              >
                Проверить
              </Button>
            ) : currentExerciseIndex < totalExercises - 1 ? (
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-1.5"
              >
                Следующий текст →
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentExerciseIndex(totalExercises)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-1.5"
              >
                Завершить
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default TextMode

