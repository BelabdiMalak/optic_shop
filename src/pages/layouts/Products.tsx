import {
    Box,
    Drawer,
    DrawerContent,
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
    Button,
    Input,
    Select,
    VStack,
    Td,
    Table,
    Thead,
    Th,
    Tr,
    Tbody,
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import { BiMenu, BiPlus } from 'react-icons/bi';
import { AiOutlineClose, AiOutlineShoppingCart, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaClipboardList } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import { Head, PreviewOptionsNavbar } from '@src/components';
import { BrandName } from '@src/constants';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

// Define the type for a product
interface Product {
    id: string;
    name: string;
    type: string;
    subtype: string;
    stockQuantity: number;
}

const listItems = [
    { text: 'Orders', icon: FaClipboardList },
    { text: 'Clients', icon: AiOutlineUsergroupAdd },
    { text: 'Products', icon: AiOutlineShoppingCart },
    { text: 'Stock', icon: MdOutlineInventory2 },
];

const mockProducts = [
    { id: '1', name: 'Sunglasses A', type: 'Sunglasses', subtype: 'Green', stockQuantity: 100 },
    { id: '2', name: 'Glasses B', type: 'Glasses', subtype: 'HMC', stockQuantity: 50 },
];

export default function Products() {
    const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose, getButtonProps: getSidebarButtonProps } = useDisclosure();
    const { isOpen: isAddProductOpen, onOpen: onAddProductOpen, onClose: onAddProductClose } = useDisclosure();

    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
        name: '',
        type: '',
        subtype: '',
        stockQuantity: 0,
    });

    const handleAddProduct = () => {
        // Basic validation
        if (!newProduct.name || !newProduct.type || newProduct.stockQuantity <= 0) {
            alert('Please fill all the fields correctly.');
            return;
        }

        // Add the new product to the list
        setProducts((prevProducts) => [
            ...prevProducts,
            { id: Date.now().toString(), ...newProduct },
        ]);

        // Reset the form and close the drawer
        setNewProduct({ name: '', type: '', subtype: '', stockQuantity: 0 });
        onAddProductClose();
    };

    return (
        <>
            <Head>
                <title>Products Page | {BrandName}</title>
            </Head>
            <PreviewOptionsNavbar />
            <Flex as="nav" alignItems="center" justifyContent="space-between" h="16" py="2.5" px="2.5">
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
                <Button leftIcon={<BiPlus />} colorScheme="blue" onClick={onAddProductOpen}>
                    Add Product
                </Button>
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
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Type</Th>
                                    <Th>Subtype</Th>
                                    <Th>Stock Quantity</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {products.map((product) => (
                                    <Tr key={product.id}>
                                        <Td>{product.name}</Td>
                                        <Td>{product.type}</Td>
                                        <Td>{product.subtype}</Td>
                                        <Td>{product.stockQuantity}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            </HStack>

            {/* Add Product Drawer */}
            <Drawer isOpen={isAddProductOpen} onClose={onAddProductClose} placement="right">
                <DrawerContent>
                    <Box p="4">
                        <Heading as="h3" size="md">
                            Add New Product
                        </Heading>
                        <VStack spacing={4} align="stretch" mt={4}>
                            <FormControl isRequired>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Type</FormLabel>
                                <Select
                                    value={newProduct.type}
                                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                                >
                                    <option value="Glasses">Glasses</option>
                                    <option value="Sunglasses">Sunglasses</option>
                                    <option value="Lenses">Lenses</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Subtype</FormLabel>
                                <Input
                                    value={newProduct.subtype}
                                    onChange={(e) => setNewProduct({ ...newProduct, subtype: e.target.value })}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Stock Quantity</FormLabel>
                                <Input
                                    type="number"
                                    value={newProduct.stockQuantity}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            stockQuantity: parseInt(e.target.value, 10) || 0,
                                        })
                                    }
                                />
                            </FormControl>

                            <HStack spacing={4} mt={4}>
                                <Button onClick={onAddProductClose} variant="outline">
                                    Cancel
                                </Button>
                                <Button colorScheme="blue" onClick={handleAddProduct}>
                                    Add Product
                                </Button>
                            </HStack>
                        </VStack>
                    </Box>
                </DrawerContent>
            </Drawer>
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
