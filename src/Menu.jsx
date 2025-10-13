import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { BookOpen, FileText } from 'lucide-react'

function Menu({ onSelectMode }) {
  return (
<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-1 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-3">
        <div className="text-center space-y-0.5">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-1">
            📚 Чередующиеся гласные
          </h1>
          <p className="text-md text-gray-600">Тренажер по русскому языку</p>
          <p className="text-xs text-gray-500">Выберите режим тренировки</p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <Card 
            className="shadow-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer hover:scale-105"
            onClick={() => onSelectMode("words")}
          >
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg py-2">
              <div className="flex items-center gap-1">
                <BookOpen className="w-5 h-5" />
                <div>
                  <CardTitle className="text-lg">Отдельные слова</CardTitle>
                  <CardDescription className="text-white/90 text-xs">
                    99 слов с объяснениями
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <ul className="space-y-0.5 text-gray-700 text-xs">
                <li className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>Вставляйте по одной букве</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>Подробные объяснения правил</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>Примеры предложений</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>Отслеживание серий ответов</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-xs py-1.5"
                onClick={() => onSelectMode("words")}
              >
                Начать тренировку
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="shadow-xl border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer hover:scale-105"
            onClick={() => onSelectMode("texts") }
          >
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg py-2">
              <div className="flex items-center gap-1">
                <FileText className="w-5 h-5" />
                <div>
                  <CardTitle className="text-lg">Тексты</CardTitle>
                  <CardDescription className="text-white/90 text-xs">
                    10 текстов с несколькими пропусками
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <ul className="space-y-0.5 text-gray-700 text-xs">
                <li className="flex items-center gap-1">
                  <span className="text-orange-600">✓</span>
                  <span>Связные тексты из жизни</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-orange-600">✓</span>
                  <span>Несколько пропусков в одном тексте</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-orange-600">✓</span>
                  <span>Все ответы должны быть верными</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="text-orange-600">✓</span>
                  <span>Повышенная сложность</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-xs py-1.5"
                onClick={() => onSelectMode("texts") }
              >
                Начать тренировку
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-xs text-gray-500 mt-4">
          <p>💡 Совет: начните с отдельных слов, а затем переходите к текстам</p>
        </div>
      </div>
    </div>
  )
}

export default Menu

