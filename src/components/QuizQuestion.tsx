
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { quizQuestions } from "@/data/quizQuestions";
import { motion } from "framer-motion";

interface QuizQuestionProps {
  topic: string;
  onFinish: (score: number, wrongAnswers: number) => void;
  isDarkMode?: boolean;
}

const QuizQuestion = ({ topic, onFinish, isDarkMode = false }: QuizQuestionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { toast } = useToast();

  // Convert from topic ID (like "desarrollo-web") to topic key in quizQuestions (like "web")
  const topicKey = topic === "desarrollo-web" ? "web" : 
                  topic === "historia" ? "history" : null;
  
  // Handle case where topic doesn't exist in quizQuestions
  if (!topicKey || !quizQuestions[topicKey]) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className={`w-full max-w-2xl p-6 text-center ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
          <h2 className="text-2xl font-bold mb-4">¡Tema no disponible!</h2>
          <p className="mb-6">Lo sentimos, este tema aún no está disponible.</p>
          <Button onClick={() => onFinish(0, 0)}>Volver</Button>
        </Card>
      </div>
    );
  }

  const questions = quizQuestions[topicKey];
  const question = questions[currentQuestion];
  
  const cardClassName = isDarkMode 
    ? "bg-slate-800 border-slate-700" 
    : "bg-white";

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
        const finalScore = score + (isCorrect ? 1 : 0);
        const wrongAnswers = questions.length - finalScore;
        onFinish(finalScore, wrongAnswers);
      }
    }, 2000);
  };

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl p-6 space-y-6 shadow-lg ${cardClassName}`}>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-500"}`}>
            Pregunta {currentQuestion + 1} de {questions.length}
          </span>
          <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-500"}`}>
            Puntuación: {score}/{currentQuestion}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-center">
          {question.text}
        </h2>
        
        <div className="grid gap-4">
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant={selectedOption === index 
                  ? (option.isCorrect ? "default" : "destructive")
                  : "outline"
                }
                className={`w-full p-4 text-left justify-start text-lg transition-all ${
                  selectedOption === index && option.isCorrect
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : ""
                } ${isDarkMode && selectedOption === null ? "hover:bg-slate-700" : ""}`}
                onClick={() => handleOptionClick(index, option.isCorrect)}
                disabled={selectedOption !== null}
              >
                {option.text}
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QuizQuestion;
