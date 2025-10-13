import React from 'react'
import siriusLogo from './assets/images/sirius_logo.jpg'

function Header() {
  return (
    <div className="w-full bg-[#4A398F] text-white p-2 flex items-center justify-center shadow-md">
      <img src={siriusLogo} alt="Логотип Сириус" className="h-12 mr-3" />
      <h2 className="text-xl font-semibold">Многопрофильная гимназия Сириус</h2>
    </div>
  )
}

export default Header

