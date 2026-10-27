// import React from 'react'
// import { assets } from '../assets/assets'

// const Footer = () => {
//   return (
//     <div>
//         <div className=' flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
//             <div>
//                 <img src={assets.logo} className='mb-5 w-32'  alt=""/>
//                 <p className=' w-full md:w-2/3  text-gray-600'>
//                 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur, expedita? Magni dolor odio molestias sapiente ex vero porro maxime aut. Quam mollitia voluptates, voluptate delectus minus blanditiis consequuntur. Totam, optio!
//                 </p>
//             </div>
//             <div className=''>
//                 <p className=' text-xl font-medium mb-5'>COMPANY</p>
//                 <ul className='flex flex-col gap-1 text-gray-600'> 

//                         <li>HOME </li>
//                         <li>ABOUT US </li>
//                         <li>DELIVERY</li>
//                         <li> Privacy Policy</li>
//                 </ul>
//             </div>
//             <div>
//                 <p className=' text-xl font-medium mb-5'>GET IN TOUCH</p>
//                 <ul className='flex flex-col gap-1 text-gray-600'>
//                     <li>+8550987654321</li>
//                     <li>bonthanhfc10@gmail.com</li>

//                 </ul>
//             </div>

//         </div>

//         <div>
//             <hr/>
//             <p className='py-5 text-sm text-center'>Copyright 2025 SOKBUNTHANH </p>
//         </div>


//     </div>
//   )
// }

// export default Footer
import React from 'react'
import { assets } from '../assets/assets'
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    // Outer div with a subtle background color and overall padding
    <div className='bg-gray-50 pt-16 pb-6 text-gray-700'>
      <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Main Footer Content Grid */}
        <div className='flex flex-col md:grid md:grid-cols-4 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 md:gap-8 text-sm'>
          
          {/* Column 1: Logo and About/Social */}
          <div className='col-span-1 md:col-span-2'>
            <img src={assets.logo} className='mb-5 w-36 cursor-pointer' alt="Logo"/>
            <p className='w-full md:w-3/4 text-gray-600 leading-relaxed mb-6'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, expedita? Magni dolor odio molestias sapiente ex vero porro maxime aut.
            </p>
            
            {/* Social Media Icons (Assuming you have icons in assets like assets.facebook_icon) */}
                <div className='flex gap-4 text-xl'>
                    <FaFacebookF className='cursor-pointer hover:text-blue-600 transition duration-300' />
                    <FaTwitter className='cursor-pointer hover:text-blue-400 transition duration-300' />
                    <FaLinkedinIn className='cursor-pointer hover:text-blue-700 transition duration-300' />
                </div>
          </div>
          
          {/* Column 2: Company Links */}
          <div>
            <p className='text-lg font-semibold mb-6 text-gray-800 uppercase tracking-wider'>COMPANY</p>
            <ul className='flex flex-col gap-3 text-gray-600'> 
              <li className='cursor-pointer hover:text-orange-500 transition duration-300'>Home</li>
              <li className='cursor-pointer hover:text-orange-500 transition duration-300'>About Us</li>
              <li className='cursor-pointer hover:text-orange-500 transition duration-300'>Delivery</li>
              <li className='cursor-pointer hover:text-orange-500 transition duration-300'>Privacy Policy</li>
            </ul>
          </div>
          
          {/* Column 3: Quick Links (New Column) */}
           <div>
            <p className='text-lg font-semibold mb-6 text-gray-800 uppercase tracking-wider'>QUICK LINKS</p>
            <ul className='flex flex-col gap-3 text-gray-600'> 
              <li className='cursor-pointer hover:text-orange-500 transition duration-300'>Careers</li>
              <li className='cursor-pointer hover:text-orange-500 transition duration-300'>Blog</li>
              <li className='cursor-pointer hover:text-orange-500 transition duration-300'>Help Center</li>
              <li className='cursor-pointer hover:text-orange-500 transition duration-300'>Testimonials</li>
            </ul>
          </div>

          {/* Column 4: Get In Touch */}
          <div>
            <p className='text-lg font-semibold mb-6 text-gray-800 uppercase tracking-wider'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-3 text-gray-600'>
              <li className='flex items-center gap-2'>
                {/* Assuming a phone icon is available in assets */}
                <span className='hover:text-orange-500 transition duration-300'>+855 98 765 4321</span>
              </li>
              <li className='flex items-center gap-2'>
                {/* Assuming an email icon is available in assets */}
                <span className='hover:text-orange-500 transition duration-300'>bonthanhfc10@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Separator and Copyright */}
        <div className='mt-12 pt-6 border-t border-gray-200'>
          <p className='text-xs text-center text-gray-500'>
            &copy; {new Date().getFullYear()} SOKBUNTHANH. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer