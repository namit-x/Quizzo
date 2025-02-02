import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import { userDetails } from './context/context'
import { interests } from './context/interests'
import { marks } from './context/marks'

function App() {
  const [user, setUser] = useState()
  const [interest, setInterest] = useState()
  const [score, setScore] = useState(0)

  return (
    <userDetails.Provider value={{user, setUser}}>
    <interests.Provider value={{interest, setInterest}}>
    <marks.Provider value={{score, setScore}}>
    <div className='overflow-hidden'>
      <div className="bg-black h-screen w-screen flex flex-col items-center">
        {/* {showNavbar && <Navbar />} */}
        <Navbar/>
        <Outlet />
      </div>
    </div>
    </marks.Provider>
    </interests.Provider>
    </userDetails.Provider>
  )
}

export default App
