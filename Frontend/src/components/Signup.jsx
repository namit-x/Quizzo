import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm()

  const genID = () => {
    let id = new Date().getTime()
    let num = Math.floor((10 + (10) * Math.random()))
    return (id + num)
  }

  const sendData = async (data) => {

    data.id = genID();
    try {
      let res = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      let response = await res.text()
      if (response === 'There\'s already an account with these details.') {
        alert('There\'s already an account with these details.')
      }
      else if (response === 'Success') {
        alert ('Singed up, Now you can login into your account')
        navigate('/login')
      }
    }
    catch (error) {
      console.log("Error: ", error)
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <form onSubmit={handleSubmit(sendData)} className='flex flex-col p-2'>

        <label htmlFor="set_name" className='text-white p-2'>Name</label>
        <input type="text" id='set_name' placeholder='Enter Name...' {...register("name", { required: { value: true, message: "Enter Name for proceeding forward" } })} className='w-72 rounded-3xl border-2 border-white p-2 bg-transparent placeholder-white text-white focus outline-none' />
        {errors.name && <div className='text-red-500'>{errors.name.message}</div>}
        <label htmlFor="set_username" className='text-white p-2'>Set Username</label>
        <input type="text" id='set_username' placeholder='Enter username...' {...register("username", { required: { value: true, message: "Enter username for proceeding forward" } })} className='w-72 rounded-3xl border-2 border-white p-2 bg-transparent placeholder-white text-white focus outline-none' />
        {errors.username && <div className='text-red-500'>{errors.username.message}</div>}
        <label htmlFor="Age" className='text-white p-2'>Age</label>
        <input type="text" id='Age' placeholder='Enter Age...' {...register("age", { required: { value: true, message: "Enter Age for proceeding forward" } })} className='w-72 rounded-3xl border-2 border-white p-2 bg-transparent placeholder-white text-white focus outline-none' />
        {errors.password && <div className='text-red-500'>{errors.password.message}</div>}
        <label htmlFor="set_password" className='text-white p-2'>Set Password</label>
        <input type="text" placeholder='Enter Password...' id='set_password' {...register("password", { required: { value: true, message: "Enter password for proceeding forward" } })} className='w-72 rounded-3xl border-2 border-white p-2 bg-transparent placeholder-white text-white focus outline-none' />
        {errors.password && <div className='text-red-500'>{errors.password.message}</div>}
        {/* <label htmlFor="image">Upload Image</label>
        <input type="file" name="file" id='image' {...register("file", { required: { value: true, message: "Upload image for proceeding forward" } })} className='w-72 rounded-3xl border-2 border-white p-2 bg-transparent placeholder-white text-white focus outline-none'/>
        {errors.image && <div className='text-red-500'>{errors.image.message}</div>} */}
        <input type="submit" value="Sign Up" className='button font-bold w-72 rounded-3xl my-12 p-2 bg-[#7d2ae8] placeholder-white text-white focus outline-none' />

      </form>
      <div className='text-white'>Already Signed up? <NavLink to="/login" className='underline active:text-green-400'>Login</NavLink></div>

    </div>
  )
}

export default Signup

// onChange={(e) => console.log(e.target.files[0])}