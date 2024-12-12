import { Box, Drawer, DrawerContent, Flex, HStack, Heading, IconButton, List, ListIcon, ListItem, Text,  useColorModeValue, useDisclosure  } from '@chakra-ui/react'
import { BiMenu } from 'react-icons/bi'
import { AiOutlineClose, AiOutlineHome, AiOutlineShoppingCart, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaClipboardList } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import { IoEarthOutline } from 'react-icons/io5'

import { Head, PreviewOptionsNavbar } from "@src/components"
import { BrandName } from "@src/constants"
import { Link } from 'react-router-dom';

type ListItem = {
    text?: string
    icon: React.ElementType
}

const listItems: ListItem[] = [
    {
        text: 'Home',
        icon: AiOutlineHome,
    },
    {
        text: 'Clients',
        icon: AiOutlineUsergroupAdd,
    },
    {
        text: 'Products',
        icon: AiOutlineShoppingCart,
    },
    {
        text: 'Orders',
        icon: FaClipboardList,
    },
    {
        text: 'Stock',
        icon: MdOutlineInventory2,
    },
];


  
export default function Stock() {
    const { getButtonProps, isOpen, onClose } = useDisclosure()
    const buttonProps = getButtonProps()

    return (
        <>
            <Head>
                <title>Toggle Sidebar and Navbar Layout | {BrandName}</title>
            </Head>
            <PreviewOptionsNavbar />
            <Flex as="nav" alignItems="center" justifyContent="space-between" h='16' py='2.5' pr="2.5">
                <HStack spacing={2}>
                    <IconButton {...buttonProps} fontSize="18px" variant='ghost' icon={<BiMenu />} aria-label='open menu'/>
                    <Heading as='h1' size="md">{BrandName}</Heading>
                </HStack>
                <HStack spacing="1">
                    <IconButton variant="ghost" isRound={true} size="lg" aria-label='earth icon' icon={<IoEarthOutline />}/>
                </HStack>
            </Flex>
            <HStack align="start" spacing={0}>
                <Drawer
                    autoFocus={false}
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="xs"
                >
                    <DrawerContent>
                        <Aside onClose={onClose} />
                    </DrawerContent>
                </Drawer>
                <Flex as="main" w='full' minH="90vh" align="center" justify="center" bg={useColorModeValue('gray.50', 'gray.900')}>
                    <Box textAlign="center">
                        <Heading as='h3'>Stock Heading</Heading>
                        <Text>Empty Stock Content</Text>
                    </Box>
                </Flex>
            </HStack>
        </>
    )
}

const Aside = ({ onClose }: {  onClose: () => void }) => {
    return (
        <Box borderRight="2px" borderColor={useColorModeValue('gray.200', 'gray.900')}>
            <HStack p="2.5" justify="space-between">
                <Heading as='h1' size="md">{BrandName}</Heading>
                <IconButton onClick={onClose} fontSize="18px" variant='ghost' icon={<AiOutlineClose />} aria-label='open menu'/>
            </HStack>
            <Box as="aside" minH="90vh"> 
                <List spacing={0} p="0.5">
                    {
                    listItems.map(item => (<ListElement icon={item.icon} text={item.text} />))
                    }
                </List>
            </Box>
        </Box>
    )
}

const ListElement = ({ icon, text }: ListItem) => {
    // Create a dynamic path based on the text (assuming it's in lowercase, like 'clients' -> '/clients')
    const path = text?.toLowerCase();

    return (
        <Link to={`/${path}`} style={{ textDecoration: 'none', width: '100%' }}>
            <ListItem
                as={HStack}
                spacing={0}
                h="10"
                pl="2.5"
                cursor="pointer"
                _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                rounded="md"
            >
                <ListIcon boxSize={5} as={icon} />
                {text && <Text>{text}</Text>}
            </ListItem>
        </Link>
    );
};

