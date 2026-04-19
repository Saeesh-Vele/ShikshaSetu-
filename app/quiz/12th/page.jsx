"use client"
import { useState } from "react";
import Link from "next/link";
import quizQuestions from "../../data/quizQuestions.json";
import recommendedCourses from "../../data/recommendedCourses.json";

export default function TwelfthQuizPage() {
  const [step, setStep] = useState(1); // 1: Subject, 2: Quiz, 3: Results
  const [selectedSubject, setSelectedSubject] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestionsState, setQuizQuestionsState] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});

  // Function to generate random questions
  const generateRandomQuestions = () => {
    const allSubjectQuestions = quizQuestions[selectedSubject] || [];
    if (allSubjectQuestions.length === 0) {
      console.log("No questions found for subject:", selectedSubject);
    }
    const shuffled = allSubjectQuestions.sort(() => 0.5 - Math.random());
    setQuizQuestionsState(shuffled.slice(0, 5)); // Select 5 random questions
  };

  // Subject selection
  if (step === 1) {
    const subjects = ["Physics", "Chemistry", "Biology", "Commerce"];
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100 transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-green-700 mb-4">Career Quiz Hub</h1>
            <p className="text-gray-600 text-lg">Choose your subject for 12th Grade!</p>
          </div>
          <div className="space-y-5">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            >
              <option value="">Choose a subject</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                generateRandomQuestions();
                setStep(2);
              }}
              disabled={!selectedSubject}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-lg font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span>🎓</span>
              <span>Start Quiz</span>
            </button>
            <Link href="/quiz/select">
              <button className="w-full bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-all duration-300 text-lg font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg mt-2">
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Quiz (5 random questions)
  if (step === 2) {
    const currentQuestions = quizQuestionsState;
    const currentQuestion = currentQuestions[currentQuestionIndex];

    const handleAnswer = (answer) => {
      setQuizAnswers({ ...quizAnswers, [currentQuestion.id]: answer });
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizCompleted(true);
        setStep(3);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100 transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-green-700 mb-4">Career Quiz Hub</h1>
            <p className="text-gray-600 text-lg">Quiz for {selectedSubject} in 12th Grade</p>
            <p className="text-gray-500">Question {currentQuestionIndex + 1} of {currentQuestions.length}</p>
          </div>
          <div className="space-y-5">
            {currentQuestion && (
              <>
                <p className="text-gray-600 text-lg">{currentQuestion.question}</p>
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full bg-gray-100 text-gray-800 py-2 rounded-xl hover:bg-gray-200 transition-all duration-300 text-lg font-medium flex items-center justify-center space-x-2 shadow-md"
                  >
                    {option}
                  </button>
                ))}
              </>
            )}
            <button
              onClick={() => setStep(1)}
              className="w-full bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-all duration-300 text-lg font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg mt-2"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results with recommendations
  if (step === 3 && quizCompleted) {
    const recommendedCoursesData = recommendedCourses[selectedSubject] || [];

    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100 transform hover:scale-105 transition-all duration-300">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-green-700 mb-4">Career Quiz Hub</h1>
            <p className="text-gray-600 text-lg">Quiz Completed for {selectedSubject} in 12th Grade!</p>
          </div>
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 text-center">Recommended Courses</h3>
              {recommendedCoursesData.length > 0 ? (
                recommendedCoursesData.map((course, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl mb-3 bg-gray-50">
                    <img 
                      src={course.thumbnail} 
                      alt={course.name} 
                      className="w-full h-32 object-cover rounded-md mb-2" 
                      onError={(e) => { e.target.style.display = 'none'; }} 
                    />
                    <p className="font-medium text-gray-800 text-center">{course.name}</p>
                    <Link href={course.youtubeLink} target="_blank" rel="noopener noreferrer" className="block mt-2">
                      <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-lg font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                        <span>🎥</span>
                        <span>Watch on YouTube</span>
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-red-500 text-center">No courses available for {selectedSubject}.</p>
              )}
            </div>
            <Link href="/dashboard">
              <button className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-all duration-300 text-lg font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                <span>🏠</span>
                <span>Back to Dashboard</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}