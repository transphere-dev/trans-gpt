// app/layout.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import ChatContextWrapper from './components/ChatContextWrapper'
import Sidebar from './components/Sidebar'
import './globals.css'

export default function RootLayout({
  children,
}) {
  return (
    <html lang='en'>
      <head />
      <body>
        <CacheProvider>
          <ChatContextWrapper>
          <ChakraProvider>
            <Sidebar children={children} />
            </ChakraProvider>
          </ChatContextWrapper>
        </CacheProvider>
      </body>
    </html>
  )
}