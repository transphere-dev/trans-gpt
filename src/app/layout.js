// app/layout.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import AuthContextWrapper from './components/AuthContextWrapper'
import ChatContextWrapper from './components/ChatContextWrapper'
import Sidebar from './components/Sidebar'
import './globals.css'

export default function RootLayout({children}) {
  return (
    <html lang='en'>
      <head />
      <title>TransGPT | Your assistant AI language model</title>
      <body>
        <CacheProvider>
          <AuthContextWrapper>
          <ChatContextWrapper>
          <ChakraProvider>
            <Sidebar>{children}</Sidebar>
            </ChakraProvider>
          </ChatContextWrapper>
          </AuthContextWrapper>
        </CacheProvider>
      </body>
    </html>
  )
}