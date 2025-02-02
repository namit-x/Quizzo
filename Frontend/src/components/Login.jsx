import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { userDetails } from '../context/context'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const navigate = useNavigate()
  const loginDetails = useContext(userDetails)

  const sendData = async (data) => {
    try {
      let res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      let completeResponse = await res.text()

      if (completeResponse == 'Match Found') {
        navigate('/profile', { state: { from: '/login' } })
      }
      else {
        alert(completeResponse)
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='flex flex-col items-center bg-black'>
      <form onSubmit={handleSubmit(sendData)} className='flex flex-col p-2'>

        <label htmlFor="username" className='text-white p-2'>Username</label>
        <input type="text"
          placeholder='Enter username...'
          {...register("username", { required: true, onChange: (e) => loginDetails.setUser(e.target.value) })}
          className='w-72 rounded-3xl border-2 border-white p-2 bg-transparent placeholder-white text-white focus outline-none' />
        <div className='text-red-500 text-sm' style={{ visibility: errors.username ? 'visible' : 'hidden' }}>Enter username for proceeding forward</div>

        <label htmlFor="password" className='text-white p-2'>Password</label>
        <input type="password"
          placeholder='Enter Password...'
          {...register("password", { required: true })}
          className='w-72 rounded-3xl border-2 border-white p-2 bg-transparent placeholder-white text-white focus outline-none' />
        <div className='text-red-500 text-sm' style={{ visibility: errors.password ? 'visible' : 'hidden' }}>Enter password for proceeding forward</div>

        <input type="submit" value="Login" disabled={isSubmitting} className='button font-bold w-72 rounded-3xl my-12 p-2 bg-[#7d2ae8] placeholder-white text-white focus outline-none' />
      </form>
      <div className='text-white' disabled={isSubmitting}>No Account? <NavLink to="/signup" className='underline active:text-green-400' >Sign Up</NavLink></div>

    </div>
  )
}

export default Login
