import React from 'react'
import Stat from './components/StatusAPI/Stat'
import Loader from './components/Loader/Loader'
import FT from "./../public/1650591586319.png"

const App = () => {
  return (
    <div className='w-full h-full bg-gray-800' >
      <Stat/>
      <Loader/>
      <img src={FT} alt="Footer" className='absolute right-12 bottom-0' />
    </div>
  )
}

export default App