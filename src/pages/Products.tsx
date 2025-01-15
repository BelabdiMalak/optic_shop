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
    VStack,
    Spinner,
    Drawer,
    DrawerContent,
    SimpleGrid,
    Card,
    CardHeader,
    CardBody,
    useToast,
    Select,
} from '@chakra-ui/react';
import { BiMenu } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import { FaCalendarDay, FaCalendarWeek, FaClipboardList } from 'react-icons/fa';
import { HiUsers } from "react-icons/hi2";
import { FaBoxOpen, FaCalendarCheck } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { IoCalendarNumber} from "react-icons/io5";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ThemeToggle from "@src/components/ThemeToggle";
import { Head, OverViewCard, PreviewOptionsNavbar } from '@src/components';
import { Link } from "react-router-dom";
import { BrandName } from '@src/constants';
import { IoEyeSharp } from "react-icons/io5";

const colorPalette = [
    '#6c9eaf', // Soft Blue
    '#74c2ba', // Muted Turquoise
    '#d3b69f', // Warm Beige
    '#c78e41', // Deep Gold
    '#8b67b1', // Dusty Purple
    '#db9f44', // Earthy Yellow
    '#f56a7d', // Soft Pink
    '#4fc8ab', // Deeper Mint Green
    '#f27a4f', // Rusty Orange
    '#5a1f26', // Dark Burgundy
    '#93b9a6', // Sage Green
    '#7e6e97', // Lavender Gray
    '#a4c3d2', // Stormy Blue
    '#9e9e9e', // Slate Gray
    '#4f6f68', // Charcoal Green
    '#758b6a', // Moss Green
    '#c0a0b3', // Dusty Rose
    '#b3b0d2', // Misty Purple
    '#d69b5a'  // Mustard Yellow
];

const GLASS = 'Verre Correcteur';
const SUNGLASS = 'Verre Solaire';
const LENSES = 'Lentille';
const GLASS_CLEANER = 'Nettoyant';
const LENS_CLEANER = 'Produit';

const HC = 'HC';
const HMC = 'HMC';
const TRHC = 'TRHC';
const BB = 'BB';
const TRB = 'TRB';

const VERT = 'VERT';
const BLEU = 'BLEU';
const MARRON = 'MARRON';
const GRIS = 'GRIS';

const SPICE = 'SPICE';
const JADE = 'JADE';
const BLUE = 'BLUE';
const PERLA = 'PERLA';
const GIALLO = 'GIALLO';

const JAZZ = 'JAZZ';
const GP = 'GP';
const AQUASOFT = 'AQUASOFT';
const BIO = 'BIO';

const DEFAULT = 'DEFAULT';

const GLASS_SUBTYPES = {
    HC,
    HMC,
    TRHC,
    BB,
    TRB
};

const SUNGLASS_SUBTYPES = {
    VERT,
    BLEU,
    MARRON,
    GRIS
};

const LENS_SUBTYPES = {
    SPICE,
    JADE,
    PERLA,
    BLUE,
    GIALLO
};

const LENS_CLEANER_SUBTYPES = {
    JAZZ,
    GP,
    AQUASOFT,
    BIO
};

const GLASS_CLEANER_SUBTYPES = {
    DEFAULT
};

// Define the type for valid subtypes
type Subtypes = Record<string, string>;

// Update getSubtypes function to return the correct subtype type
const getSubtypes = (typeName: string): Subtypes => {
    switch (typeName) {
        case GLASS:
            return GLASS_SUBTYPES;
        case SUNGLASS:
            return SUNGLASS_SUBTYPES;
        case LENSES:
            return LENS_SUBTYPES;
        case GLASS_CLEANER:
            return GLASS_CLEANER_SUBTYPES;
        case LENS_CLEANER:
            return LENS_CLEANER_SUBTYPES;
        default:
            return {}; // Return an empty object if no match
    }
};

// Define types for our data
interface SalesDataItem {
  productId: string;
  count: number;
  typeName: string;
  subTypeName: string;
}

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
    { text: 'Général', icon: IoMdHome },
    { text: 'Commandes', icon: FaClipboardList },
    { text: 'Clients', icon: HiUsers },
    { text: 'Stock', icon: FaBoxOpen },
    { text: 'Puissances', icon: IoEyeSharp },
];

const Products: React.FC = () => {
    const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose, getButtonProps: getSidebarButtonProps } = useDisclosure();
    const [turnoverData, setTurnoverData] = useState<any>({ daily: 0, weekly: 0, monthly: 0, yearly: 0 });
    const [products, setProducts] = useState<GroupedProduct[]>([]);
    const [salesData, setSalesData] = useState<{ [key: string]: SalesDataItem[] }>({});
    const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();


    const fetchTurnoverData = async () => {
        try {
            setIsLoading(true);
            const response = await window.electron.getTurnOver();
            setTurnoverData(response.data);
        } catch (error) {
            console.error('Error fetching turnover data:', error);
            toast({
                title: 'Error fetching turnover data',
                description: 'There was an error loading the turnover data. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

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

    const fetchSalesData = async () => {
        try {
            setIsLoading(true);
            const response = await window.electron.getProductsSold();
            setSalesData(response.data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            toast({
                title: 'Error fetching sales data',
                description: 'There was an error loading the sales data. Please try again.',
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

    const prepareChartData = (data: { [key: string]: SalesDataItem[] }) => {
        if (!data || !data[selectedPeriod]) return [];
    
        const groupedData: { [key: string]: { [key: string]: number } } = {};
        const allSubTypes = new Set<string>();
    
        data[selectedPeriod].forEach((item) => {
            // Collect all unique subtypes
            allSubTypes.add(item.subTypeName);
    
            if (!groupedData[item.typeName]) {
                groupedData[item.typeName] = {};
            }
            groupedData[item.typeName][item.subTypeName] = item.count;
        });
    
        // Ensure every typeName includes all subtypes, even with 0 count
        return Object.entries(groupedData).map(([typeName, subTypes]) => ({
            typeName,
            ...Array.from(allSubTypes).reduce((acc, subTypeName) => {
                acc[subTypeName] = subTypes[subTypeName] || 0; // Default to 0 if not present
                return acc;
            }, {} as { [key: string]: number }),
        }));
    };

    const chartData = prepareChartData(salesData);
    useEffect(() => {
        // Always call these functions in the same order
        fetchProducts();
        fetchTurnoverData();
        fetchSalesData();
    }, []); // Empty dependency array means this runs once on component mount
    
    
    return (
        <>
            <Head>
                <title>Général</title>
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
                    <Heading as="h1" size="md">Général</Heading>
                </HStack>
                <ThemeToggle />
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
                            <>
                                {/* Section des données de Chiffre d'Affaires */}
                                <Box mb={6}>
                                <Heading 
                                    size="md" 
                                    mb={4} 
                                    textAlign="center" 
                                    color={useColorModeValue("gray.800", "gray.100")} 
                                    fontWeight="bold"
                                >
                                   Chiffres d'Affaires
                                </Heading>
                                    <SimpleGrid
                                        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                                        spacing={{ base: 4, md: 6 }}
                                        py={4}
                                    >
                                        <OverViewCard
                                            icon={FaCalendarDay}
                                            entity="Chiffre d'affaire quotidien"
                                            value={turnoverData.day}
                                            currency="DA"
                                        />
                                        <OverViewCard
                                            icon={FaCalendarWeek}
                                            entity="Chiffre d'affaire hebdomadaire"
                                            value={turnoverData.week}
                                            currency="DA"
                                        />
                                        <OverViewCard
                                            icon={IoCalendarNumber}
                                            entity="Chiffre d'affaire mensuel"
                                            value={turnoverData.month}
                                            currency="DA"
                                        />
                                        <OverViewCard
                                            icon={FaCalendarCheck}
                                            entity="Chiffre d'affaire annuel"
                                            value={turnoverData.year}
                                            currency="DA"
                                        />
                                    </SimpleGrid>
                                </Box>

                                {/* Section des produits */}
                                <Box>
                                <Heading 
                                    size="md" 
                                    mb={4} 
                                    textAlign="center" 
                                    color={useColorModeValue("gray.800", "gray.100")} 
                                    fontWeight="bold"
                                >
                                   Disponible en Stock
                                </Heading>
                                    <SimpleGrid
                                        columns={{ base: 1, sm: 2, md: 3, lg: 5 }}
                                        spacing={{ base: 4, md: 6 }}
                                        py={4}
                                    >
                                        {products.map((product) => (
                                            <Card
                                                key={product.typeName}
                                                p={6}
                                                width="240px"
                                                borderRadius="xl"
                                                borderWidth="1px"
                                                borderColor={useColorModeValue("gray.200", "gray.700")}
                                                bg={useColorModeValue("gray.50", "gray.900")}
                                                boxShadow="md"
                                                _hover={{
                                                    boxShadow: "lg",
                                                    transform: "translateY(-5px)",
                                                }}
                                                transition="all 0.3s"
                                            >
                                                <CardHeader p={2}>
                                                    <Heading size="md" textAlign="center" color={useColorModeValue("gray.800", "gray.100")}>
                                                        {product.typeName}
                                                    </Heading>
                                                </CardHeader>
                                                <CardBody p={2}>
                                                    <VStack align="stretch" spacing={2}>
                                                        {product.subtypes.map((subtype) => (
                                                            <HStack key={subtype.name} justify="space-between">
                                                                <Text fontSize="sm" color="gray.500">
                                                                    {subtype.name}:
                                                                </Text>
                                                                <Text fontSize="sm" fontWeight="bold" color={useColorModeValue("green.600", "green.100")}>
                                                                    {subtype.quantity}
                                                                </Text>
                                                            </HStack>
                                                        ))}
                                                    </VStack>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </SimpleGrid>
                                </Box>

                                {/* Section du graphique des ventes */}
                                <Box mt={6}>
                                <Heading 
                                    size="md" 
                                    mb={4} 
                                    textAlign="center" 
                                    color={useColorModeValue("gray.800", "gray.100")} 
                                    fontWeight="bold"
                                >
                                    Analyse des Ventes
                                </Heading>

                                    <Select
                                        value={selectedPeriod}
                                        onChange={(e) => setSelectedPeriod(e.target.value)}
                                        mb={4}
                                        width="200px"
                                    >
                                        <option value="day">Par Jour</option>
                                        <option value="week">Par Semaine</option>
                                        <option value="month">Par Mois</option>
                                        <option value="year">Par Année</option>
                                    </Select>
                                    <Box height="400px">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="typeName" />
                                                <YAxis />
                                                <Tooltip
                                                    content={({ payload }) => {
                                                        if (!payload || payload.length === 0) return null;
                                                        const typeName = payload[0].payload.typeName;
                                                        const validSubtypes = getSubtypes(typeName);
                                                        const subtypes = Object.keys(payload[0].payload)
                                                            .filter((key) => key !== "typeName")
                                                            .filter((key) => validSubtypes[key])
                                                            .map((key) => ({
                                                                name: key,
                                                                count: payload[0].payload[key],
                                                            }));
                                                        return (
                                                            <Box
                                                                p={2}
                                                                bg={useColorModeValue("gray.50", "gray.900")}
                                                                borderRadius="md"
                                                                boxShadow="lg"
                                                                border="1px"
                                                                borderColor={useColorModeValue("gray.200", "gray.700")}
                                                            >
                                                                <Heading size="sm">{typeName}</Heading>
                                                                <VStack align="start" spacing={1} mt={2}>
                                                                    {subtypes.map((subtype) => (
                                                                        <HStack key={subtype.name} justify="space-between" width="full">
                                                                            <Text fontSize="sm">{subtype.name}:</Text>
                                                                            <Text fontSize="sm" fontWeight="bold">{subtype.count}</Text>
                                                                        </HStack>
                                                                    ))}
                                                                </VStack>
                                                            </Box>
                                                        );
                                                    }}
                                                />
                                                <Legend />
                                                {Object.keys(chartData[0] || {})
                                                    .filter((key) => key !== "typeName")
                                                    .map((key, index) => (
                                                        <Bar key={key} dataKey={key} stackId="a" fill={colorPalette[index % colorPalette.length]} />
                                                    ))}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Box>
                            </>
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
