// app/layout.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { Box, ChakraProvider, useDisclosure } from '@chakra-ui/react'
import AuthContextWrapper, { AuthProvider, useAuth } from './components/AuthContextWrapper'
import ChatContextWrapper from './components/ChatContextWrapper'
import Sidebar from './components/Sidebar'
import './globals.css'
import NProgress from 'nprogress';
import Router from 'next/router';
import { NavBar } from './components/NavBar'
import { usePathname } from 'next/navigation'
// import '../../node_modules/nprogress/nprogress.css';


// NProgress.configure({ showSpinner: true });

// Router.events.on('routeChangeStart', () => {
//     NProgress.start();
// });

// Router.events.on('routeChangeComplete', () => {
//     NProgress.done();
// });

export default function RootLayout({children}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const path = usePathname();
  const {user} = useAuth();
  return (
    <html lang='en'>
      <head />
      <title>TransGPT | Your assistant AI language model</title>
      <body>
        <CacheProvider>
          <AuthProvider>
          <ChatContextWrapper>
          <ChakraProvider>
         <Box h={'100%'} position={'relative'}>
{/* {path === '/signup' || path === '/login' || path === '/forgotPassword' ?
<></>
:
<NavBar onOpen={onOpen}/>

} */}
{children}
         </Box>
            </ChakraProvider>
          </ChatContextWrapper>
          </AuthProvider>
        </CacheProvider>
      </body>
    </html>
  )
}