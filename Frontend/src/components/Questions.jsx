import React, { useContext, useState, useEffect, useRef } from 'react'
import { interests } from '../context/interests'
import Stopwatch from './Stopwatch'
import { useLocation, useNavigate } from 'react-router-dom'
import { marks } from '../context/marks'


const Questions = () => {
  const interest = useContext(interests)
  const marksDetails = useContext(marks)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayQuestions, setDisplayQuestions] = useState()
  const [done, setDone] = useState(false)
  const [markedByUser, setMarkedByUser] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {   //This will occur 1 time only.
    renderQuestions()
  }, [])

  useEffect(() => {
    const wasReload = sessionStorage.getItem('wasReload');

    if (wasReload === null && location.state?.from === '/profile') {
      sessionStorage.setItem('wasReload', 'true');
      console.log("Page Navigated from /profile")
    } else {
      console.log('Page Reloaded')
      navigate('/profile')
    }

    return () => {
      sessionStorage.removeItem('wasReload');
    };
  }, [location]);

  useEffect(() => {
    const updateIndex = setInterval(() => {
      if (currentIndex + 1 == 9) {
        console.log(`Question answers marked by user are: `, markedByUser)
        navigate('/result')
      }
      else {
        setCurrentIndex(() => currentIndex + 1)
        setDone(true)
      }
    }, 10000);
    setDone(false)
    return () => clearInterval(updateIndex)
  })

  const selectQuestions = (questions) => {
    let numArr = []
    for (let i = 0; i < 10; i++) {
      let num = 20 * Math.random()
      let realNum = Math.floor(num)
      if (numArr.some((e) => e === realNum)) {
        i--
      }
      else {
        numArr.push(realNum)
      }
    }
    let DQuestions = []
    for (let i = 0; i < numArr.length; i++) {
      DQuestions.push(questions[numArr[i]])
    }
    return DQuestions
  }

  const renderQuestions = async () => {
    let res = await fetch('http://localhost:3000/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domain: interest.interest })
    })
    let response = await res.json()

    let DQuestions = selectQuestions(response)
    setDisplayQuestions(DQuestions)
  }

  const check = async (marked) => {
    let i = currentIndex
    let obj = {}
    obj.question = displayQuestions[currentIndex].question
    obj.marked = marked

    let arr = [...markedByUser, obj]
    setMarkedByUser(arr)

    if (i == 9) {
      console.log(`Question answers marked by user are: `, arr)
      setIsSubmitting(true)
      setDone(true)
      navigate('/result')

      let res = await fetch("http://localhost:3000/api/markedQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(arr)
      })
      let response = await res.text()
      marksDetails.setScore(response)
    }
    else {
      setCurrentIndex(() => currentIndex + 1)
      // console.log(`currentIndex: ${currentIndex} and i: ${i}`)
      setDone(true)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center lg:space-x-4 items-center space-y-3 lg:space-y-0 p-3 lg:p-6 ">
      {/* Timer Section - Sticky on laptop */}
      <div className="text-white bg-gray-400 p-3 lg:p-5 rounded-3xl flex flex-col items-center gap-2 w-[300px] lg:w-[400px] max-w-xs lg:top-6">
        <div className="font-semibold text-lg lg:text-xl lg:font-bold">Question-{currentIndex + 1}</div>
        <Stopwatch initialTime={10} restart={done} />
      </div>

      {/* Question and Options Section */}
      <div className="text-white bg-gray-400 p-3 lg:p-6 rounded-3xl flex flex-col items-start gap-3 w-[300px] lg:w-[600px]"> {/* gray box */}
        {/* Question */}
        <div className="question flex flex-col justify-start lg:justify-center font-semibold w-[300px] lg:w-[500px] ">
          <div className="w-[280px] ml-3 lg:text-left text-lg lg:text-xl p-1 text-wrap ">
            {displayQuestions ? displayQuestions[currentIndex].question : 'Question'}
          </div>
          {/* Options - Grid layout on laptop */}
          <div className="button grid place-items-start lg:place-items-center lg:grid-cols-2 gap-3 lg:w-[500px] lg:h-[200px] ">
            {[
              { value: displayQuestions?.[currentIndex].optionA, label: 'A' },
              { value: displayQuestions?.[currentIndex].optionB, label: 'B' },
              { value: displayQuestions?.[currentIndex].optionC, label: 'C' },
              { value: displayQuestions?.[currentIndex].optionD, label: 'D' }
            ].map((option, index) => (
              <button
                key={index}
                className={`
              flex items-center gap-2 
              text-left font-semibold 
              bg-[#7d2ae8] 
              p-3 lg:p-4 
              rounded-xl 
              text-lg lg:text-xl 
              focus:ring-2 
              disabled:opacity-50 
              disabled:cursor-not-allowed 
              transition-all 
              w-[260px] 
            `}
                onClick={() => check(option.value)}
                disabled={isSubmitting}
              >
                <span className="flex items-center justify-center bg-gray-400 text-white w-7 h-7 rounded-full">
                  {option.label}
                </span>
                <span className="flex-1">{option.value || `Option${index + 1}`}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

  )
}

export default Questions
