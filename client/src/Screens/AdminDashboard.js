import React, { useContext, useEffect, useLocation}from 'react'
import { SidebarContext } from '../Components/Context/SidebarContext';
import { useTheme } from '../Components/Context/ThemeContext';
import Darkmodebutton from '../Components/Darkmodebutton';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar/Sidebar';

function AdminDashboard() {
     const darkTheme = useTheme()
    const themeStyles = {
        backgroundColor: darkTheme ? '#333' : '#f7fafc',
        color: darkTheme ? '#f7fafc' : '#333'
    }  
    const { isSidebarOpen, closeSidebar } = useContext(SidebarContext)
 

  useEffect(() => {
    closeSidebar()
  }, [])
    return (
        <div  className={`flex h-screen bg-gray-50 dark:bg-gray-900  ${isSidebarOpen && 'overflow-hidden'}`} style={themeStyles}>
            <Sidebar style={themeStyles}/>
            <div className="flex flex-col flex-1 w-full" style={themeStyles}>
            <Header style={themeStyles}/>
            </div>
            <Darkmodebutton/>
            
        </div>
    )
}

export default AdminDashboard
