import React, { useState, useEffect } from 'react';
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
    Spinner,
    Drawer,
    DrawerContent,
    SimpleGrid,
    Card,
    CardHeader,
    CardBody,
    useToast,
} from '@chakra-ui/react';
import { BiMenu } from 'react-icons/bi';
import { AiOutlineClose, AiOutlineShoppingCart, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaClipboardList } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import { Head, PreviewOptionsNavbar } from '@src/components';
import { BrandName } from '@src/constants';
import { Link } from 'react-router-dom';

// Define the Product type
interface Product {
    id: string;
    type: {
        name: string;
    };
    subType: {
        name: string;
    };
    stockQuantity: number;
}

// Define the grouped product type
interface GroupedProduct {
    typeName: string;
    subtypes: {
        name: string;
        quantity: number;
    }[];
}

const listItems = [
    { text: 'Orders', icon: FaClipboardList },
    { text: 'Clients', icon: AiOutlineUsergroupAdd },
    { text: 'Products', icon: AiOutlineShoppingCart },
    { text: 'Stock', icon: MdOutlineInventory2 },
];

const Products: React.FC = () => {
    const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose, getButtonProps: getSidebarButtonProps } = useDisclosure();

    const [products, setProducts] = useState<GroupedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await window.electron.getProducts({});
            if (response && response.data && Array.isArray(response.data)) {
                const groupedProducts = groupProductsByType(response.data);
                setProducts(groupedProducts);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast({
                title: 'Error fetching products',
                description: 'There was an error loading the product list. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const groupProductsByType = (products: Product[]): GroupedProduct[] => {
        const groupedProducts: { [key: string]: GroupedProduct } = {};

        products.forEach((product) => {
            if (!groupedProducts[product.type.name]) {
                groupedProducts[product.type.name] = {
                    typeName: product.type.name,
                    subtypes: [],
                };
            }

            const existingSubtype = groupedProducts[product.type.name].subtypes.find(
                (subtype) => subtype.name === product.subType.name
            );

            if (existingSubtype) {
                existingSubtype.quantity += product.stockQuantity;
            } else {
                groupedProducts[product.type.name].subtypes.push({
                    name: product.subType.name,
                    quantity: product.stockQuantity,
                });
            }
        });

        return Object.values(groupedProducts);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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
    <Box overflowX="auto">
        {isLoading ? (
            <Flex justify="center" align="center" height="200px">
                <Spinner size="xl" />
            </Flex>
        ) : (
            <Flex justify="center" align="center">
                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 5 }}
                    spacing={{ base: 4, md: 6 }}
                    py={4}
                >
                    {products.map((product) => (
                        <Card
                            key={product.typeName}
                            p={4}
                            width="240px"
                            borderWidth="1px"
                            borderRadius="lg"
                            boxShadow="lg"
                            _hover={{ boxShadow: "xl", transform: "translateY(-5px)" }}
                            transition="all 0.2s"
                        >
                            <CardHeader p={2}>
                                <Heading size="md" textAlign="center">
                                    {product.typeName}
                                </Heading>
                            </CardHeader>
                            <CardBody p={2}>
                                <VStack align="stretch" spacing={2}>
                                    {product.subtypes.map((subtype) => (
                                        <HStack key={subtype.name} justify="space-between">
                                            <Text fontSize="sm">{subtype.name}:</Text>
                                            <Text fontSize="sm" fontWeight="bold">
                                                {subtype.quantity}
                                            </Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
            </Flex>
        )}
    </Box>
</Box>

            </HStack>
        </>
    );
};
const Aside = ({ onClose }: { onClose: () => void }) => {
    return (
        <Box borderRight="2px" borderColor={useColorModeValue('gray.200', 'gray.900')}>
            <HStack p="2.5" justify="space-between">
                <Heading as="h1" size="md">{BrandName}</Heading>
                <IconButton
                    onClick={onClose}
                    fontSize="18px"
                    variant="ghost"
                    icon={<AiOutlineClose />}
                    aria-label="close menu"
                />
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

const ListElement = ({ icon, text }: { icon: React.ElementType; text: string }) => {
    const path = text.toLowerCase();
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
