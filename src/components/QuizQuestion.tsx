
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { quizQuestions } from "@/data/quizQuestions";

interface QuizQuestionProps {
  topic: string;
  onFinish: () => void;
}

const QuizQuestion = ({ topic, onFinish }: QuizQuestionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { toast } = useToast();

  const questions = quizQuestions[topic];
  const question = questions[currentQuestion];

  const handleOptionClick = (index: number, isCorrect: boolean) => {
    setSelectedOption(index);
    if (isCorrect) {
      setScore(score + 1);
    }
    
    toast({
      title: isCorrect ? "¡Correcto!" : "Incorrecto",
      description: isCorrect 
        ? "¡Muy bien! Has elegido la respuesta correcta." 
        : `La respuesta correcta era: ${questions[currentQuestion].options.find(opt => opt.isCorrect)?.text}`,
      variant: isCorrect ? "default" : "destructive",
    });

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        toast({
          title: "¡Quiz completado!",
          description: `Tu puntuación final es: ${score + (isCorrect ? 1 : 0)}/10`,
        });
        onFinish();
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl p-6 space-y-6 bg-white shadow-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">
            Pregunta {currentQuestion + 1} de {questions.length}
          </span>
          <span className="text-sm text-slate-500">
            Puntuación: {score}/{currentQuestion}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-center">
          {question.text}
        </h2>
        <div className="grid gap-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedOption === index 
                ? (option.isCorrect ? "default" : "destructive")
                : "outline"
              }
              className={`w-full p-4 text-left justify-start text-lg transition-all ${
                selectedOption === index && option.isCorrect
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : ""
              }`}
              onClick={() => handleOptionClick(index, option.isCorrect)}
              disabled={selectedOption !== null}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QuizQuestion;
