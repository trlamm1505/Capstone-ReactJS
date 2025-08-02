import React from 'react'
import Header from './_components/Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from './_components/Footer/Footer'

function HomeTemplate() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default HomeTemplate