"use client"
import { MobileNav, SidebarContent } from '@/app/components/Sidebar';
import { Box, Drawer, DrawerContent, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React, { useContext } from 'react'

export default function Sidebar({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
  
  
    
    return (
      <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <SidebarContent
          onClose={() => onClose}
          display={{ base: 'none', md: 'block' }}
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full">
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} />
        <Box ml={{ base: 0, md: 60 ,lg: 300}} >
          {children}
         
        </Box>
       <Box h={'12rem'}>
  
       </Box>
      </Box>
    );
  }