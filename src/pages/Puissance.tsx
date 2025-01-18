import React, { useState, useEffect } from 'react';
import {
    Table,
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
    Spinner,
    Drawer,
    DrawerContent,
    Select,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Button,
} from '@chakra-ui/react';
import { BiMenu } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import { HiUsers } from "react-icons/hi2";
import { FaBoxOpen } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import ThemeToggle from "@src/components/ThemeToggle";
import { Head, PreviewOptionsNavbar } from '@src/components';
import { Link } from "react-router-dom";
import { BrandName } from '@src/constants';
import { LuFilterX } from 'react-icons/lu';
import { FaClipboardList } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';

interface ProductDetail {
    id: string;
    product: {
        subType: {
            name: string;
        };
    };
    category: string;
    sphere: string;
    cylinder: string;
    quantity: number;
}

const listItems = [
    { text: 'Général', icon: IoMdHome },
    { text: 'Commandes', icon: FaClipboardList },
    { text: 'Clients', icon: HiUsers },
    { text: 'Stock', icon: FaBoxOpen },
    { text: 'Puissances', icon: IoEyeSharp },
];

const Puissances: React.FC = () => {
    const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose, getButtonProps: getSidebarButtonProps } = useDisclosure();
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [details, setDetails] = useState<ProductDetail[]>([]);
    const [filteredDetails, setFilteredDetails] = useState<ProductDetail[]>([]);
    const [filters, setFilters] = useState({
        product: '',
        category: '',
        sphere: '',
        cylinder: ''
    });

    const handleClearAllFilters = () => {
        // Reset all filters to their default state (empty or initial value)
        setFilters({
          product: '',
          category: '',
          sphere: '',
          cylinder: ''
        });
        setFilteredDetails(details);
        setCurrentPage(1);
      };

      const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const response = await window.electron.getProductDetails();
            const data = response?.data || [];
            setDetails(data);
            setFilteredDetails(data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        } finally {
            setIsLoading(false); // Ensure loading is set to false
        }
    };    

    const handleFilterChange = (column: string, value: string) => {
        const updatedFilters = { ...filters, [column]: value };
        setFilters(updatedFilters);

        // Filter details based on the updated filters
        setFilteredDetails(
            details.filter((detail) => {
                return (
                    (updatedFilters.product ? detail?.product?.subType?.name.includes(updatedFilters.product) : true) &&
                    (updatedFilters.category ? detail?.category.includes(updatedFilters.category) : true) &&
                    (updatedFilters.sphere ? detail?.sphere.includes(updatedFilters.sphere) : true) &&
                    (updatedFilters.cylinder ? detail?.cylinder.includes(updatedFilters.cylinder) : true)
                );
            })
        );

        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);
    const currentDetails = filteredDetails.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        fetchDetails();
    }, []); // Empty dependency array means this runs once on component mount
    
    
    return (
        <>
            <Head>
                <title>Puissances</title>
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
                    <Heading as="h1" size="md">Puissances</Heading>
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
                                {/* Table for Verre Correcteur */}
                                <Box mt={6}>
                                    {/* Filters */}
                                    <Box mb={4} display="flex" gap={4} alignItems="center">
                                        <Select
                                        placeholder="Filter par produit"
                                        onChange={(e) => handleFilterChange('product', e.target.value)}
                                        value={filters.product}
                                        >
                                        <option value="">Tous les produits</option>
                                        {Array.from(new Set(details.map((detail) => detail.product.subType.name))).map((product) => (
                                            <option key={product} value={product}>
                                            {product}
                                            </option>
                                        ))}
                                        </Select>

                                        <Select
                                        placeholder="Filtrer par catégorie"
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        value={filters.category}
                                        >
                                        <option value="">tous les catégories</option>
                                        {Array.from(new Set(details.map((detail) => detail.category))).map((category) => (
                                            <option key={category} value={category}>
                                            {category}
                                            </option>
                                        ))}
                                        </Select>

                                        <Select
                                        placeholder="Filtrer par Sphère"
                                        onChange={(e) => handleFilterChange('sphere', e.target.value)}
                                        value={filters.sphere}
                                        >
                                        <option value="">Tous les spheres</option>
                                        {Array.from(new Set(details.map((detail) => detail.sphere))).map((sphere) => (
                                            <option key={sphere} value={sphere}>
                                            {sphere}
                                            </option>
                                        ))}
                                        </Select>

                                        <Select
                                        placeholder="Filtrer par cylindre"
                                        onChange={(e) => handleFilterChange('cylinder', e.target.value)}
                                        value={filters.cylinder}
                                        >
                                        <option value="">Tous les cylindres</option>
                                        {Array.from(new Set(details.map((detail) => detail.cylinder))).map((cylinder) => (
                                            <option key={cylinder} value={cylinder}>
                                            {cylinder}
                                            </option>
                                        ))}
                                        </Select>
                                        <Button
                                            onClick={handleClearAllFilters}
                                            aria-label="Clear all filters"
                                        >
                                            <LuFilterX style={{ fontSize: '53px' }} />
                            
                                        </Button>
                                    </Box>

                                    {/* Table */}
                                    <Box overflowX="auto" fontSize={"sm"}>
                                    <Table>
                  <Thead>
                    <Tr>
                      <Th>Produit</Th>
                      <Th>Catégorie</Th>
                      <Th>Sphère</Th>
                      <Th>Cylindre</Th>
                      <Th>Quantité</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                  {currentDetails.length === 0 ? (
                    <Tr>
                        <Td colSpan={5} textAlign="center">
                        <Text>
                            Aucune puissance trouvée.
                        </Text>
                        </Td>
                    </Tr>
                    ) : (
                    currentDetails.map((detail) => (
                        <Tr key={detail.id}>
                        <Td>{detail.product.subType.name}</Td>
                        <Td>{detail.category}</Td>
                        <Td>{detail.sphere}</Td>
                        <Td>{detail.cylinder}</Td>
                        <Td>{detail.quantity}</Td>
                        </Tr>
                    ))
                    )}

                  </Tbody>
                </Table>

                {/* Pagination */}
                <Flex mt={4} justifyContent="space-between" alignItems="center">
                  <HStack spacing={2}>
                    <Button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      isDisabled={currentPage === 1}
                    >
                      &lt;
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        colorScheme={page === currentPage ? 'green' : 'gray'}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      isDisabled={currentPage === totalPages}
                    >
                      &gt;
                    </Button>
                  </HStack>

                  <HStack>
                    <Text>Articles par page:</Text>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </HStack>
                </Flex>
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

export default Puissances;
