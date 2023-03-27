import React, { ReactNode, useContext } from 'react';
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  Button,
  Image,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiMoon,
  FiSun,
  FiMessageCircle,
  FiPlus,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import ChatContext from '../contexts/ChatContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';



const LinkItems = [
  { name: 'Translate this passage into Simplified', icon: FiMessageCircle },
  { name: 'Translate this passage into Simplified', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms ', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
  { name: 'Explain quantum computing in simple terms', icon: FiMessageCircle },
];

const light_logo = '/images/logo-color.png';
const dark_logo = '/images/logo-white.png';

export default function Sidebar({children}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {chatMessages,setChatMessages,newChat} = useContext(ChatContext);
  const chatMsgs = {
    messages: [
      { name: "Explain quantum computing in simple terms",prompt: "Explain quantum computing in simple terms", id: "1",timestamp:5, msg:"Quantum computing is a type of computing where information is processed using quantum-mechanical phenomena, such as superposition and entanglement. In traditional computing, information is processed using bits, which can have a value of either 0 or 1. In quantum computing, information is processed using quantum bits, or qubits, which can exist in multiple states simultaneously. This allows quantum computers to perform certain types of calculations much faster than traditional computers."},
      { name: "Explain quantum computing in simple terms",prompt: "Explain quantum computing in simple terms", id: "2",timestamp:4, msg:"Quantum computing is a type of computing where information is processed using quantum-mechanical phenomena, such as superposition and entanglement. In traditional computing, information is processed using bits, which can have a value of either 0 or 1. In quantum computing, information is processed using quantum bits, or qubits, which can exist in multiple states simultaneously. This allows quantum computers to perform certain types of calculations much faster than traditional computers."},
      { name: "Explain quantum computing in simple terms",prompt: "Explain quantum computing in simple terms", id: "3",timestamp:3, msg:"Quantum computing is a type of computing where information is processed using quantum-mechanical phenomena, such as superposition and entanglement. In traditional computing, information is processed using bits, which can have a value of either 0 or 1. In quantum computing, information is processed using quantum bits, or qubits, which can exist in multiple states simultaneously. This allows quantum computers to perform certain types of calculations much faster than traditional computers."},
      { name: "Explain quantum computing in simple terms",prompt: "Explain quantum computing in simple terms", id: "4",timestamp:2, msg:"Quantum computing is a type of computing where information is processed using quantum-mechanical phenomena, such as superposition and entanglement. In traditional computing, information is processed using bits, which can have a value of either 0 or 1. In quantum computing, information is processed using quantum bits, or qubits, which can exist in multiple states simultaneously. This allows quantum computers to perform certain types of calculations much faster than traditional computers."},
      { name: "Explain quantum computing in simple terms",prompt: "Explain quantum computing in simple terms", id: "5",timestamp:1, msg:"Quantum computing is a type of computing where information is processed using quantum-mechanical phenomena, such as superposition and entanglement. In traditional computing, information is processed using bits, which can have a value of either 0 or 1. In quantum computing, information is processed using quantum bits, or qubits, which can exist in multiple states simultaneously. This allows quantum computers to perform certain types of calculations much faster than traditional computers."},
    ],
  };



  
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
      <Box ml={{ base: 0, md: 60 ,lg: 300}} p="4">
        {children}
      </Box>
    </Box>
  );
}


const SidebarContent = ({ onClose, ...rest }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const {chatList,setChatlist} = useContext(ChatContext)

    // Add new chat to the chat list

    const addNewChat = () => {

      setChatlist( currentChats => {
        
      })

    }

  return (
    <Box
    color={ colorMode === 'light' ? '#343541': '#D1D5DB'}
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 ,lg: 300 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        {colorMode === 'light' ? <Image src={light_logo} /> : <Image src={dark_logo}   />}
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Box p={4}
      
       overflowY={'auto'}
       h={'70%'}
      >
        <Button color={'#F79229'} borderColor={'#F79229'} mb={0} mt={'auto'} variant={'outline'} borderWidth={2} w={'100%'} leftIcon={<FiPlus />} onClick={addNewChat}>
                New Chat
              </Button>

      {chatList?.chats?.map((link) => (
        <NavItem colorMode={colorMode} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
      </Box>
       <Box p={'4'}>
       <Button mb={0} mt={'auto'} variant={'outline'} borderWidth={2} w={'100%'} leftIcon={colorMode === 'light' ? <FiMoon /> : <FiSun />} onClick={toggleColorMode}>
                {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
       </Box>
    </Box>
  );
};


const NavItem = ({ icon, children, colorMode, ...rest }) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
      isTruncated
      noOfLines={1}
      mt={"0.7em"}
        align="center"
        bg="#444654"
        p="4"
        color={ colorMode === 'light' ? '#343541': '#D1D5DB'}
        borderRadius="6"
        role="group"
        cursor="pointer"
        _hover={{
          bg: '#F79229',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
        
      </Flex>
    </Link>
  );
};


const MobileNav = ({ onOpen, ...rest }) => {
    const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        {/* {colorMode === 'light' ? <Image src={light_logo} /> : <Image src={dark_logo}   />} */}
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">Justina Clark</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};