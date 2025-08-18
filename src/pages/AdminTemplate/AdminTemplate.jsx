import React, { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Topbar from './_components/Topbar'
import Sidebar from './_components/Sidebar'
import Movies from './Movies/Movies'
import { useSelector } from 'react-redux'

function AdminTemplate() {
  const { user } = useSelector((state) => state.login);
  const navigate = useNavigate();
  useEffect(() => {
    navigate('movies/list');
  }, [])
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <NavLink
        key='/login'
        to='/login'
        className="text-blue-500 hover:text-blue-700 cursor-pointer underline"
      >
        Please login try again.....
      </NavLink>
    </div>)

  return (
    <div className="min-h-screen flex flex-row">
      <Sidebar />
      <div className="min-h-screen flex flex-col flex-1">
        <Topbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminTemplate
