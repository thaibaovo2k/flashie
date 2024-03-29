'use client'

import Image from 'next/image'
// import { Logo } from '~/assets/icon'

export default function RootLayout({ children }) {
  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
      <div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
        {/* <p className='mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white'>
          <Logo size={150} />
          
        </p> */}
        <Image src={'/img/logo.png'} width={220} height={100} />
        <div className='w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0'>
          {children}
        </div>
      </div>
    </section>
  )
}
