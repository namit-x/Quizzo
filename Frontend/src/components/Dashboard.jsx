import React, { useState, useEffect, useContext } from 'react'
import { userDetails } from '../context/context'
import { useLocation, useNavigate } from 'react-router-dom'
import { interests } from '../context/interests'

const AfterLogin = () => {
  const [file, setFile] = useState()
  const [find, setFind] = useState(null)
  const [data, setData] = useState()
  const [uploaded, setUploaded] = useState(false)
  const [imageURL, setImageURL] = useState()
  const loginDetails = useContext(userDetails)
  const interest = useContext(interests)
  const location = useLocation()
  const navigate = useNavigate()

  // useEffect(() => {
  //   const currentPath = location.pathname
  //   if (prevPath.current === null) {
  //     let loadedDetails = localStorage.getItem('userDetails')
  //     setFind(loadedDetails)
  //   }
  //   else {
  //     if (loginDetails.user) {
  //       localStorage.removeItem('userDetails')
  //       localStorage.setItem('userDetails', loginDetails.user)
  //       setFind(loginDetails.user)
  //     }
  //   }
  //   prevPath.current = currentPath
  // }, [location.pathname])                                        PREVIOUSLY USING THIS INSTEAD OF THE FOLLOW UP APPROACH

  useEffect(() => {
    const wasReload = sessionStorage.getItem('wasReload');

    // Page Navigated
    if (wasReload === null && location.state?.from === '/login') {

      sessionStorage.setItem('wasReload', 'true');
      localStorage.removeItem('userDetails')
      localStorage.setItem('userDetails', loginDetails.user)
      setFind(loginDetails.user)

    }
    // Page Reloaded
    else {
      let loadedDetails = localStorage.getItem('userDetails')
      setFind(loadedDetails)
    }

    return () => {
      sessionStorage.removeItem('wasReload');
    };
  }, [location.pathname]);

  const handleFile = async () => {
    if (!file) {
      alert("First upload the file.")
    }

    try {
      const formData = new FormData();
      formData.append('image', file)
      formData.append('userID', find)

      const response = await fetch('http://localhost:3000/api/upload-image', {
        method: 'POST',
        body: formData
      });
      const result = await response.text();
      if (response.ok) {
        setFile(formData)
        setUploaded(true)
      } else {
        console.log('Upload failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchData = async () => {
    try {
      // FOR USER'S NAME AND AGE
      let res = await fetch('http://localhost:3000/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: find })
      })
      let jsonString = await res.json()
      const D = jsonString
      setData(D)

      // FOR USER'S IMAGE
      let response = await fetch("http://localhost:3000/api/reterive", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: find })
      })
      let statusCode = response.status

      if(statusCode === 200) {
        let blob = await response.blob()
        // console.log(blob)
        const blobURL = URL.createObjectURL(blob)
        setImageURL(blobURL)
      }
      else {
        setImageURL(false)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleInterest1 = () => {
    navigate('/questions', { state: { from: '/profile' } })
    interest.setInterest('GK')
  }
  const handleInterest2 = () => {
    navigate('/questions', { state: { from: '/profile' } })
    interest.setInterest('Math')
  }
  const handleInterest3 = () => {
    navigate('/questions', { state: { from: '/profile' } })
    interest.setInterest('Puzzle')
  }
  const handleInterest4 = () => {
    navigate('/questions', { state: { from: '/profile' } })
    interest.setInterest('English')
  }

  useEffect(() => {
    if (find) {
      fetchData()
    }
  }, [find])

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-center lg:space-x-12 items-center space-y-4 lg:space-y-0 lg:p-16">
        {/* Profile Section */}
        <div className="text-white bg-gray-400 p-8 lg:p-12 rounded-3xl flex items-center gap-6 max-w-fit h-36 lg:w-96 lg:sticky lg:top-8">
          {/* CONDITIONAL RENDERING THE IMAGE OR THE UPLOAD OPTION BASED ON WHETHER THE IMAGE_URL IS AVAILABLE OR NOT */}
          {imageURL ? (
            <img src={imageURL} alt="uploaded" className='w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-full' />
          ) : (
            <div className="photo bg-black rounded-full overflow-hidden w-24 h-24 lg:w-48 lg:h-48">
              <input
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-8"
              />
              <button onClick={handleFile} className="ml-6">
                Upload
              </button>
            </div>
          )}

          <div className="about flex flex-col">
            <div className="nameD">
              <div className="name text-xl lg:text-2xl text-gray-300">Name:</div>
              <div className="user text-3xl lg:text-4xl font-semibold">
                {data == null ? "Name" : data.name}
              </div>
            </div>
            <div className="ageD">
              <div className="text-xl lg:text-2xl text-gray-300">Age:</div>
              <div className="displayAge font-bold text-2xl lg:text-3xl">
                {data == null ? "age" : data.age}
              </div>
            </div>
          </div>
        </div>

        {/* PARTITION */}

        <div className="text-white bg-gray-400 p-8 lg:p-12 rounded-3xl lg:w-[600px] lg:h-72 ">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 lg:my-6">
            <button
              className="Interest-button font-semibold text-xl lg:text-2xl py-4 lg:font-bold bg-[#7d2ae8] p-3 lg:p-8 rounded-xl w-[200px] lg:w-[245px]"
              onClick={handleInterest1}
            >
              General Knowledge
            </button>
            <button
              className="Interest-button font-semibold text-xl lg:text-2xl py-4 lg:font-bold bg-[#7d2ae8] p-3 lg:p-8 rounded-xl w-[200px] lg:w-[245px]"
              onClick={handleInterest2}
            >
              Mathematics
            </button>
            <button
              className="Interest-button font-semibold text-xl lg:text-2xl py-4 lg:font-bold bg-[#7d2ae8] p-3 lg:p-8 rounded-xl w-[200px] lg:w-[245px]"
              onClick={handleInterest3}
            >
              Puzzles
            </button>
            <button
              className="Interest-button font-semibold text-xl lg:text-2xl py-4 lg:font-bold bg-[#7d2ae8] p-3 lg:p-8 rounded-xl w-[200px] lg:w-[245px]"
              onClick={handleInterest4}
            >
              English
            </button>
          </div>
        </div>
      </div>


    </>
  )
}
export default AfterLogin
