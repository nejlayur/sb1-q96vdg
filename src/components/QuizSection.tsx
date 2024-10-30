import React, { useState, useContext } from 'react';
import { SimulationContext } from '../context/SimulationContext';

const questions = {
  easy: [
    {
      id: 1,
      question: "Sabit hızla hareket eden bir aracın hızı nasıl değişir?",
      options: ["Değişmez, sabit kalır", "Sürekli artar", "Sürekli azalır", "Önce artar sonra azalır"],
      correct: 0,
      explanation: "Sabit hızlı harekette hız değişmez, her zaman aynı kalır."
    },
    {
      id: 2,
      question: "5 m/s hızla 10 saniye hareket eden bir araç ne kadar yol alır?",
      options: ["15 metre", "50 metre", "25 metre", "40 metre"],
      correct: 1,
      explanation: "Yol = Hız × Zaman = 5 m/s × 10 s = 50 metre"
    },
    {
      id: 3,
      question: "Bir araç 100 metrelik yolu 20 saniyede alıyorsa ortalama hızı nedir?",
      options: ["2 m/s", "4 m/s", "5 m/s", "10 m/s"],
      correct: 2,
      explanation: "Ortalama Hız = Yol ÷ Zaman = 100 m ÷ 20 s = 5 m/s"
    },
    {
      id: 4,
      question: "4 m/s hızla giden bir araç 1 dakikada kaç metre yol alır?",
      options: ["240 metre", "180 metre", "120 metre", "60 metre"],
      correct: 0,
      explanation: "Yol = Hız × Zaman = 4 m/s × 60 s = 240 metre"
    },
    {
      id: 5,
      question: "2 m/s hızla hareket eden bir araç 30 saniyede kaç metre yol alır?",
      options: ["30 metre", "45 metre", "60 metre", "90 metre"],
      correct: 2,
      explanation: "Yol = Hız × Zaman = 2 m/s × 30 s = 60 metre"
    }
  ],
  medium: [
    {
      id: 6,
      question: "Bir araç 15 m/s hızla 2 saat yol alıyor. Toplam kaç kilometre yol almıştır?",
      options: ["54 km", "108 km", "72 km", "90 km"],
      correct: 0,
      explanation: "Yol = 15 m/s × (2 × 3600 s) = 108000 m = 54 km"
    },
    {
      id: 7,
      question: "Bir araç 72 km/saat hızla gidiyor. Bu hız kaç m/s'dir?",
      options: ["15 m/s", "20 m/s", "25 m/s", "30 m/s"],
      correct: 1,
      explanation: "72 km/saat = 72000 m / 3600 s = 20 m/s"
    },
    {
      id: 8,
      question: "300 metre yolu 15 saniyede alan bir aracın ortalama hızı nedir?",
      options: ["15 m/s", "20 m/s", "25 m/s", "30 m/s"],
      correct: 1,
      explanation: "Ortalama Hız = Yol ÷ Zaman = 300 m ÷ 15 s = 20 m/s"
    },
    {
      id: 9,
      question: "10 m/s hızla giden bir araç 5 dakikada kaç metre yol alır?",
      options: ["3000 m", "2500 m", "2000 m", "1500 m"],
      correct: 0,
      explanation: "Yol = 10 m/s × (5 × 60 s) = 3000 m"
    },
    {
      id: 10,
      question: "Bir araç 40 km'lik yolu 30 dakikada alıyor. Ortalama hızı kaç km/saat'tir?",
      options: ["60 km/saat", "70 km/saat", "80 km/saat", "90 km/saat"],
      correct: 2,
      explanation: "Hız = 40 km ÷ (30/60) saat = 80 km/saat"
    }
  ],
  hard: [
    {
      id: 11,
      question: "A aracı 20 m/s, B aracı 15 m/s hızla aynı yönde hareket ediyor. A aracı B'den 300 metre gerideyken, kaç saniye sonra A aracı B'ye yetişir?",
      options: ["45 s", "55 s", "60 s", "65 s"],
      correct: 2,
      explanation: "Göreceli hız = 20 - 15 = 5 m/s, Zaman = Mesafe ÷ Göreceli hız = 300 ÷ 5 = 60 s"
    },
    {
      id: 12,
      question: "Bir araç ilk 2 saat 60 km/saat, sonraki 3 saat 80 km/saat hızla gidiyor. Ortalama hızı kaç km/saat'tir?",
      options: ["68 km/saat", "70 km/saat", "72 km/saat", "74 km/saat"],
      correct: 2,
      explanation: "Toplam yol = (60×2 + 80×3) = 360 km, Toplam süre = 5 saat, Ortalama hız = 360 ÷ 5 = 72 km/saat"
    },
    {
      id: 13,
      question: "İki şehir arası 480 km'dir. Bir araç ortalama 90 km/saat hızla gidip, 60 km/saat hızla dönüyor. Tüm yolculuk kaç saat sürer?",
      options: ["12 saat", "13 saat", "14 saat", "15 saat"],
      correct: 1,
      explanation: "Gidiş = 480/90 = 5.33 saat, Dönüş = 480/60 = 8 saat, Toplam = 13.33 saat ≈ 13 saat"
    },
    {
      id: 14,
      question: "A noktasından B noktasına giden bir araç 40 km/saat hızla 3 saat, B'den A'ya dönerken 50 km/saat hızla 2.4 saat sürüyor. A ve B arası kaç km'dir?",
      options: ["110 km", "120 km", "130 km", "140 km"],
      correct: 1,
      explanation: "Gidiş yolu = 40 × 3 = 120 km, Kontrol: Dönüş yolu = 50 × 2.4 = 120 km"
    },
    {
      id: 15,
      question: "Bir yarışmacı 400 metrelik pistte 2 tur atıyor. İlk turu 72 km/saat, ikinci turu 90 km/saat hızla koşuyor. Ortalama hızı kaç m/s'dir?",
      options: ["20 m/s", "22.5 m/s", "25 m/s", "27.5 m/s"],
      correct: 1,
      explanation: "v1 = 20 m/s, v2 = 25 m/s, d = 800 m, t = 400/20 + 400/25 = 36 s, vort = 800/36 = 22.5 m/s"
    }
  ]
};

type Difficulty = 'easy' | 'medium' | 'hard';

const QuizSection: React.FC = () => {
  const { isRunning } = useContext(SimulationContext);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<string>("");

  const getPointsForDifficulty = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case 'easy': return 2;
      case 'medium': return 3;
      case 'hard': return 5;
      default: return 0;
    }
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setCurrentDifficulty(difficulty);
    setCurrentQuestionIndex(0);
    setFeedback("");
  };

  const handleAnswer = (selectedOption: number) => {
    if (!currentDifficulty) return;

    const currentQuestion = questions[currentDifficulty][currentQuestionIndex];
    const points = getPointsForDifficulty(currentDifficulty);
    const isCorrect = selectedOption === currentQuestion.correct;

    setScore(prev => prev + (isCorrect ? points : 0));
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestion.id));
    setFeedback(isCorrect ? 
      `Doğru! ${points} puan kazandınız. ${currentQuestion.explanation}` : 
      `Yanlış. Doğru cevap: ${currentQuestion.options[currentQuestion.correct]}. ${currentQuestion.explanation}`
    );
  };

  const handleNextQuestion = () => {
    if (!currentDifficulty) return;
    
    if (currentQuestionIndex < questions[currentDifficulty].length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFeedback("");
    } else {
      setCurrentDifficulty(null);
      setCurrentQuestionIndex(0);
      setFeedback("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Sorular</h2>
      
      <div className="mb-6">
        <p className="text-lg font-semibold mb-2">Toplam Puan: {score}</p>
        <p className="text-sm text-gray-600 mb-4">
          Kolay: 2 puan | Orta: 3 puan | Zor: 5 puan
        </p>
        
        {!currentDifficulty && (
          <div className="space-y-4">
            <p className="text-lg font-medium">Zorluk seviyesi seçin:</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDifficultySelect('easy')}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                disabled={isRunning}
              >
                Kolay
              </button>
              <button
                onClick={() => handleDifficultySelect('medium')}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                disabled={isRunning}
              >
                Orta
              </button>
              <button
                onClick={() => handleDifficultySelect('hard')}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                disabled={isRunning}
              >
                Zor
              </button>
            </div>
          </div>
        )}
      </div>

      {currentDifficulty && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <p className="font-medium mb-3">
              {questions[currentDifficulty][currentQuestionIndex].question}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {questions[currentDifficulty][currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isRunning || feedback !== ""}
                  className={`p-3 rounded-lg border transition-colors ${
                    feedback !== "" && idx === questions[currentDifficulty][currentQuestionIndex].correct
                      ? 'bg-green-100 border-green-500'
                      : feedback !== "" && idx !== questions[currentDifficulty][currentQuestionIndex].correct
                      ? 'bg-red-100 border-red-500'
                      : 'hover:bg-gray-100 border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {feedback && (
              <div className="mt-4">
                <p className={`${
                  feedback.startsWith('Doğru') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {feedback}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {currentQuestionIndex < questions[currentDifficulty].length - 1 ? 
                    'Sonraki Soru' : 'Yeni Zorluk Seç'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSection;