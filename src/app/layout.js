// app/layout.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import AuthContextWrapper, { AuthProvider } from './components/AuthContextWrapper'
import ChatContextWrapper from './components/ChatContextWrapper'
import Sidebar from './components/Sidebar'
import './globals.css'
import NProgress from 'nprogress';
import Router from 'next/router';
// import '../../node_modules/nprogress/nprogress.css';


// NProgress.configure({ showSpinner: true });

// Router.events.on('routeChangeStart', () => {
//     NProgress.start();
// });

// Router.events.on('routeChangeComplete', () => {
//     NProgress.done();
// });

export default function RootLayout({children}) {
  return (
    <html lang='en'>
      <head />
      <title>TransGPT | Your assistant AI language model</title>
      <body>
        <CacheProvider>
          <AuthProvider>
          <ChatContextWrapper>
          <ChakraProvider>
            {children}
            </ChakraProvider>
          </ChatContextWrapper>
          </AuthProvider>
        </CacheProvider>
      </body>
    </html>
  )
}