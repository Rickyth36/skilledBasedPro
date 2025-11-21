import React from 'react'
import { assets } from '../../assets/assets'

function Footer() {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0
      justify-center gap-10 md:gap-32 py-10 border-b border-white/30 '>
        <div className='flex flex-col md:items-start items-center w-full'>
          <img className='w-44 md:w-52' src={assets.logo_dark} alt="logo" />
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>Lorem Ipsum is simply dummy text of the printing
             and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.</p>
        </div>

        <div></div>
        <div></div>
      </div>
      <p>Copyright 2025 © SkilledBased Pro. All Right Reserved.</p>
    </footer>
  ) 
}

export default Footer