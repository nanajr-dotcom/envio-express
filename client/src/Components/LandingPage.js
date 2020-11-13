import React from 'react'
import envio from '.././assets/img/envio-express.png'

function LandingPage() {
    return (
     <div>
  <div className="bg-indigo-900 px-4 py-4">
    <div className="md:max-w-6xl md:mx-auto md:flex md:items-center md:justify-between">
      <div className="flex justify-between items-center">
        <a href="#" className="inline-block py-2 text-white text-xl font-bold">Envio Express</a>
        <div className="inline-block cursor-pointer md:hidden">
          <div className="bg-gray-400 w-8 mb-2" style={{height: 2}} />
          <div className="bg-gray-400 w-8 mb-2" style={{height: 2}} />
          <div className="bg-gray-400 w-8" style={{height: 2}} />
        </div>
      </div>
      <div>
        <div className="hidden md:block">
          <a href="#" className="inline-block py-1 md:py-4 text-gray-100 mr-6 font-bold">How it Works</a>
          <a href="#" className="inline-block py-1 md:py-4 text-gray-500 hover:text-gray-100 mr-6">Services</a>
          <a href="#" className="inline-block py-1 md:py-4 text-gray-500 hover:text-gray-100">Blog</a>
        </div>
      </div>
      <div className="hidden md:block">
        <a href="/login" className="inline-block py-1 md:py-4 text-gray-500 hover:text-gray-100 mr-6">Login</a>
        <a href="/register" className="inline-block py-2 px-4 text-gray-700 bg-white hover:bg-gray-100 rounded-lg">Sign Up</a>
      </div>
    </div>
  </div>
  <div className="bg-indigo-900 md:overflow-hidden">
    <div className="slanted px-4 py-20 md:py-4">
      
        <div className="envioholder md:flex md:flex-wrap px-8">
          <div className="textholder md:w-1/3 text-center md:text-left md:pt-16 px-8" >
            <h1 className="font-bold text-white text-2xl md:text-5xl leading-tight mb-4">
              Simple Freight and Logistics Management System for all shipping companies
            </h1>
            
            <a href="/register" className="mt-6 mb-12 md:mb-0 md:mt-10 inline-block py-3 px-8 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow">Get Started</a>
          </div>
          <div className="md:w-2/3 relative">
            <img className="envio" src={envio} alt="envio" width="1000" height="1000"></img>
            
            
          </div>
        </div>
      
    </div>
    <svg className="fill-current text-white hidden md:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fillOpacity={1} d="M0,224L1440,32L1440,320L0,320Z" />
    </svg>
  </div>
  <div className="text-center w-full pb-16">
  <h3 className="uppercase text-gray-800">Why choose my app?</h3>
  <p className="sm:text-3xl text-2xl text-black-800 pt-4 xl:w-1/2 mx-auto">
    Your convenient partner to track and manage your freight and logistics until final day of delivery.
  </p>
</div>

</div>

    )
}

export default LandingPage
