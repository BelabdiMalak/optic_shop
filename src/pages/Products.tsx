import {
    Box,
    Flex,
    HStack,
    Heading,
    IconButton,
    List,
    ListIcon,
    ListItem,
    Text,
    useColorModeValue,
    useDisclosure,
    Input,
    VStack,
    Td,
    Table,
    Thead,
    Th,
    Tr,
    Tbody,
    Spinner,
    Drawer,
    DrawerContent,
} from '@chakra-ui/react';
import { BiMenu } from 'react-icons/bi';
import { AiOutlineClose, AiOutlineShoppingCart, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaClipboardList } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import { Head, PreviewOptionsNavbar } from '@src/components';
import { BrandName } from '@src/constants';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Product } from 'types/product.type';

const listItems = [
    { text: 'Orders', icon: FaClipboardList },
    { text: 'Clients', icon: AiOutlineUsergroupAdd },
    { text: 'Products', icon: AiOutlineShoppingCart },
    { text: 'Stock', icon: MdOutlineInventory2 },
];

const Products = () => {
    const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose, getButtonProps: getSidebarButtonProps } = useDisclosure();

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState('');
    const [subTypeFilter, setSubTypeFilter] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await window.electron.getProducts({});
            if (response && response.data && Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again.');
            setProducts([]);
            toast(
                'Error fetching products: There was an error loading the product list. Please try again.',
                {
                    duration: 5000,
                    icon: '❌',
                }
            );
        } finally {
            setIsLoading(false);
        }
    };


    const filteredProducts = products.filter(
        (product) =>
            (product.type?.name?.toLowerCase().includes(typeFilter.toLowerCase()) || false) &&
            (product.subType?.name?.toLowerCase().includes(subTypeFilter.toLowerCase()) || false)
    );
    

    return (
        <>
            <Head>
                <title>Products Page | {BrandName}</title>
            </Head>
            <PreviewOptionsNavbar />
            <Flex as="nav" alignItems="center" h="16" py="2.5" px="2.5">
                <HStack spacing={2}>
                    <IconButton
                        {...getSidebarButtonProps()}
                        fontSize="18px"
                        variant="ghost"
                        icon={<BiMenu />}
                        aria-label="open menu"
                        onClick={onSidebarOpen}
                    />
                    <Heading as="h1" size="md">Products</Heading>
                </HStack>
            </Flex>
            <HStack align="start" spacing={0}>
                <Drawer
                    autoFocus={false}
                    isOpen={isSidebarOpen}
                    placement="left"
                    onClose={onSidebarClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onSidebarClose}
                    size="xs"
                >
                    <DrawerContent>
                        <Aside onClose={onSidebarClose} />
                    </DrawerContent>
                </Drawer>
                <Box p={4} w="full">
                  <VStack spacing={4} align="stretch" mb={4}>
                    <HStack>
                      <Input
                        placeholder="Filter by type"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      />
                      <Input
                        placeholder="Filter by subtype"
                        value={subTypeFilter}
                        onChange={(e) => setSubTypeFilter(e.target.value)}
                      />
                    </HStack>
                  </VStack>
                    <Box overflowX="auto">
                        {isLoading ? (
                            <Flex justify="center" align="center" height="200px">
                                <Spinner />
                            </Flex>
                        ) : error ? (
                            <Text color="red.500" textAlign="center">{error}</Text>
                        ) : (
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Type</Th>
                                        <Th>Subtype</Th>
                                        <Th>Stock Quantity</Th>
                                        <Th>Created At</Th>
                                        <Th>Updated At</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {filteredProducts.length === 0 ? (
                                        <Tr>
                                            <Td colSpan={5} textAlign="center">No products found</Td>
                                        </Tr>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <Tr key={product.id}>
                                                <Td>{product.type.name}</Td>
                                                <Td>{product.subType.name}</Td>
                                                <Td>{product.stockQuantity}</Td>
                                                <Td>{new Date(product.createdAt).toLocaleDateString()}</Td>
                                                <Td>{new Date(product.updatedAt).toLocaleDateString()}</Td>
                                            </Tr>
                                        ))
                                    )}
                                </Tbody>
                            </Table>
                        )}
                    </Box>
                </Box>
            </HStack>
        </>
    );
}

const Aside = ({ onClose }: { onClose: () => void }) => {
    return (
        <Box borderRight="2px" borderColor={useColorModeValue('gray.200', 'gray.900')}>
            <HStack p="2.5" justify="space-between">
                <Heading as="h1" size="md">
                    {BrandName}
                </Heading>
                <IconButton onClick={onClose} fontSize="18px" variant="ghost" icon={<AiOutlineClose />} aria-label="close menu" />
            </HStack>
            <Box as="aside" minH="90vh">
                <List spacing={0} p="0.5">
                    {listItems.map((item) => (
                        <ListElement key={item.text} icon={item.icon} text={item.text} />
                    ))}
                </List>
            </Box>
        </Box>
    );
};

const ListElement = ({ icon, text }: { icon: React.ElementType; text?: string }) => {
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

export default Products;
