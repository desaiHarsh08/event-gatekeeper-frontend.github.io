import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className='w-full'>
      <nav className='fixed top-0 left-0 right-0 w-full p-3 px-4 bg-blue-500 text-white font-medium flex sm:justify-between flex-col items-center sm:flex-row'>
        <div id="left">
            <Link to={'/'} className='hover:text-slate-200 '>
                <span className='text-xl'>@Event_Gatekeeper</span>
            </Link>
        </div>
        <div id="right" className='w-full sm:w-auto'>
            <ul className='w-full flex gap-6 my-2 sm:my-0 sm:gap-3 justify-center '>
                <li className='hover:text-slate-200 '>
                    <Link to={'/'} >
                        <span>Home</span>
                    </Link>
                </li>
                <li className='hover:text-slate-200 '>
                    <Link to={'/about'} >
                        <span>About</span>
                    </Link>
                </li>
                <li className='hover:text-slate-200 '>
                    <Link to={'/settings'} >
                        <span>Settings</span>
                    </Link>
                </li>
            </ul>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
