import React from 'react'
import { useThemeUpdate } from './Context/ThemeContext';

function Darkmodebutton() {
     const toggleTheme = useThemeUpdate()
    return (
   <div className="dark-mode-switcher cursor-pointer shadow-md fixed bottom-0 right-0 box dark:bg-dark-2 border rounded-full w-40 h-12 flex items-center justify-center z-50 mb-10 mr-10">
  <div className="mr-4 text-gray-700 dark:text-gray-100" onClick={toggleTheme}>
  <button className="js-change-theme focus:outline-none">🌙</button>

  </div>
    <div className="relative">
  <label htmlFor="toogleA" className="flex items-center cursor-pointer">
  <div className="relative">
    <input id="toogleA" type="checkbox" className="hidden" />
    <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner" onClick={toggleTheme}/>
    <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0" onClick={toggleTheme} />
  </div>
</label>

  </div>
  
  </div>

    )
}

export default Darkmodebutton
