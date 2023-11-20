import React from 'react'

const About = () => {
  return (
    <div className='bg-slate-100 h-screen flex justify-center items-center'>
      <div className="w-3/4  sm:h-[70vh] bg-white text-black pt-7 px-5 ">
        <h1 className='uppercase text-xl sm:text-2xl font-medium text-center'>About <span className='hidden sm:inline'>-</span> <br className='sm:hidden ' /> <span className='my-2 sm:my-0'>The Event Gatekeeper</span></h1>
        <p className='my-9 px-4 text-justify'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, quaerat cumque. Quia dignissimos cupiditate cumque vel velit dolor nemo amet ad sequi voluptas! Iste nulla mollitia suscipit, soluta earum perferendis.
        </p>
      </div>
    </div>
  )
}

export default About
