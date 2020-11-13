import React from 'react'
import routes from '../../routes/sidebar'
import { NavLink, Route } from 'react-router-dom'
import * as Icons from '../icons'
import SidebarSubmenu from './SidebarSubmenu'
import { signout } from '../../helpers/auth';
import { ToastContainer,  toast } from 'react-toastify';


function Icon({ icon, ...props }) {
  const Icon = Icons[icon]
  return <Icon {...props} />
}

function SidebarContent({ history }) {
  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
        Envio Express
      </a>
      <ul className="mt-6">
        {routes.map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>
      <div className="px-6 my-6">
        <button
        onClick={() => {
                    signout(() => {
                      toast.error('Signout Successfully');
                      history.push('/');
                    });
                  }}
          
          className='mt-5 tracking-wide font-semibold bg-purple-600 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'
          >
        
          Sign Out
          
        </button>
         <ToastContainer />
      </div>
    </div>
  )
}

export default SidebarContent
