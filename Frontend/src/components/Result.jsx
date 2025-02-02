import React, { useContext, useEffect, useState } from 'react';
import { marks } from '../context/marks';
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate()
  const marksDetails = useContext(marks)
  // const userD = useContext(userDetails)
  const [score, setScore] = useState()
  const location = useLocation()
  const totalQuestions = 10
  const percentage = Math.round((score / totalQuestions) * 100)

  window.addEventListener("popstate", () => {navigate('/profile')})

  useEffect(() => {
    const wasReload = sessionStorage.getItem('wasReload');

    // NAVIGATED
    if (wasReload === null) {
      sessionStorage.setItem('wasReload', 'true');
      localStorage.removeItem('score')
      let score = marksDetails.score
      setScore(marksDetails.score)
      localStorage.setItem('score', score)
    }
    // Page Reloaded
    else {
      let loadedScore = localStorage.getItem('score')
      setScore(loadedScore)
    }

    return () => {
      sessionStorage.removeItem('wasReload');
    };
  }, [location.pathname, marksDetails.score]);

  const getPerformanceMessage = () => {
    if (percentage >= 80) return "Excellent work!"
    if (percentage >= 60) return "Good job!"
    if (percentage >= 40) return "Nice effort!"
    return "Keep practicing!"
  }

  localStorage.removeItem('Questions')
  return (
    <div className="w-full max-w-xs mx-auto bg-[#1a1a1a] border border-[#7d2ae8] text-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#7d2ae8] bg-[#2c2c2c]">
        <h2 className="text-xl font-bold text-center text-[#7d2ae8]">
          Quiz Results
        </h2>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Score Section */}
        <div className="text-center">
          <p className="text-4xl font-bold text-[#7d2ae8]">
          {score? score: marksDetails.score}/10
          </p>
          <p className="text-lg font-medium mt-1 text-gray-300">
            ({percentage}%)
          </p>
        </div>

        {/* Performance Message */}
        <p className="text-center text-sm font-medium">
          {getPerformanceMessage()}
        </p>

        {/* Additional Info */}
        <p className="text-center text-xs text-gray-400">
          You answered {score? score: marksDetails.score} out of 10 questions correctly.
        </p>

        <button className='button' onClick={() => navigate('/profile')}>Back to Dashboard</button>
      </div>
    </div>

  );
}

export default App;