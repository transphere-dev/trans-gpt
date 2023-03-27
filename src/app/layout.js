// app/layout.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
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
          <ChakraProvider>
            <Sidebar children={children} />
            </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}