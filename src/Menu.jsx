import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { BookOpen, FileText } from 'lucide-react'

function Menu({ onSelectMode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            📚 Чередующиеся гласные
          </h1>
          <p className="text-xl text-gray-600">Тренажер по русскому языку</p>
          <p className="text-gray-500">Выберите режим тренировки</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card 
            className="shadow-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer hover:scale-105"
            onClick={() => onSelectMode('words')}
          >
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">Отдельные слова</CardTitle>
                  <CardDescription className="text-white/90">
                    99 слов с объяснениями
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Вставляйте по одной букве</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Подробные объяснения правил</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Примеры предложений</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Отслеживание серий ответов</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                onClick={() => onSelectMode('words')}
              >
                Начать тренировку
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="shadow-xl border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer hover:scale-105"
            onClick={() => onSelectMode('texts')}
          >
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">Тексты</CardTitle>
                  <CardDescription className="text-white/90">
                    10 текстов с несколькими пропусками
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span>
                  <span>Связные тексты из жизни</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span>
                  <span>Несколько пропусков в одном тексте</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span>
                  <span>Все ответы должны быть верными</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span>
                  <span>Повышенная сложность</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                onClick={() => onSelectMode('texts')}
              >
                Начать тренировку
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>💡 Совет: начните с отдельных слов, а затем переходите к текстам</p>
        </div>
      </div>
    </div>
  )
}

export default Menu

