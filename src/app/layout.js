// app/layout.tsx
'use client'
import { CacheProvider } from '@chakra-ui/next-js'
import { Box, ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './components/AuthContextWrapper'
import ChatContextWrapper from './components/ChatContextWrapper'
import './globals.css'
import { GptProvider } from './components/GptProvider'

// import '../../node_modules/nprogress/nprogress.css';


// NProgress.configure({ showSpinner: true });

// Router.events.on('routeChangeStart', () => {
//     NProgress.start();
// });

// Router.events.on('routeChangeComplete', () => {
//     NProgress.done();
// });

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head />
      <title>TransGPT | Your assistant AI language model</title>
      <body>
        <CacheProvider>
          <ChakraProvider>
            <AuthProvider>
              <GptProvider>
                <ChatContextWrapper>
                  <Box h={'100%'} position={'relative'}>
                    {children}
                  </Box>
                </ChatContextWrapper>
              </GptProvider>
            </AuthProvider>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}