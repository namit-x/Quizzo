import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Questions from './components/Questions.jsx'
import Result from './components/Result.jsx'

import '@fontsource/dm-serif-text'; // Regular weight

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/profile',
        element: <Dashboard />
      },
      {
        path: '/questions',
        element: <Questions />
      },
      {
        path: '/result',
        element: <Result/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
