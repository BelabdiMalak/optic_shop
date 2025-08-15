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
    VStack,
    FormControl,
    FormLabel,
    Input,
    // NumberInput,
    // NumberInputField,
    // NumberInputStepper,
    // NumberIncrementStepper,
    useToast,
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
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { SubType } from 'types/product.type';

interface ProductDetail {
    id: string;
    product: {
        subType: {
            name: string;
        };
    };
    productId: string;
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
    const [isEditPuissanceOpen, setIsEditPuissanceOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [details, setDetails] = useState<ProductDetail[]>([]);
    const [filteredDetails, setFilteredDetails] = useState<ProductDetail[]>([]);
    const [puissanceToEdit, setPuissanceToEdit] = useState<ProductDetail | null>(null);
    const [subtypes, setSubtypes] = useState<SubType[]>([]); // List of subtypes
    const [filters, setFilters] = useState({
        subType: '',
        category: '',
    });
    const toast = useToast();
    const handleEditPuissance = (puissance: ProductDetail) => {
        setPuissanceToEdit(puissance); // Stock en cours d'édition
        setIsEditPuissanceOpen(true); // Ouvrir le formulaire
    };

    const handleUpdatePuissance = async () => {
        try {

          if (!puissanceToEdit) return;
    
          const {id, productId, quantity, product, ...data} = puissanceToEdit
          const response = await window.electron.updateProductDetails(id, data);
          console.log(response)
          if (response?.status) {
            toast({
              title: 'verre mise à jour',
              description: 'verre mise à jour avec succès.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            setIsEditPuissanceOpen(false); // Fermer le tiroir
          } else {
            throw new Error('Échec de la mise à jour du verre');
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du verre :', error);
          toast({
            title: 'Erreur lors de la mise à jour du verre',
            description: 'Une erreur s\'est produite',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };

    const handleClearAllFilters = () => {
        // Reset all filters to their default state (empty or initial value)
        setFilters({
          subType: '',
          category: '',
        });
        setFilteredDetails(details);
        setCurrentPage(1);
      };

      const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const subtypesResponse = await window.electron.getSubTypes({});
            const subtypes = subtypesResponse.data.filter((t: { typeId: string; }) => t.typeId === "47bc886e-e136-4821-abf1-99ffbab1c22c")
            setSubtypes(subtypes || []);
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
        console.log(updatedFilters)
        setFilters(updatedFilters);

        // Filter details based on the updated filters
        setFilteredDetails(
            details.filter((detail) => {
                return (
                    (updatedFilters.subType ? detail?.product?.subType?.name.includes(updatedFilters.subType) : true) &&
                    (updatedFilters.category ? detail?.category.includes(updatedFilters.category) : true)
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
                                        {/* Filtre par Sous-Type (seulement Verre Correcteur) */}
                                        <Select
                                            placeholder="Filtrer par Sous-Type"
                                            onChange={(e) => handleFilterChange('subType', e.target.value)}
                                            value={filters.subType}
                                        >
                                            {subtypes.map((subType) => (
                                                <option key={subType.name} value={subType.name}>
                                                    {subType.name}
                                                </option>
                                            ))}
                                        </Select>

                                        {/* Filtre par Catégorie (Torique ou Sphérique) */}
                                        <Select
                                            placeholder="Filtrer par Catégorie"
                                            onChange={(e) => handleFilterChange('category', e.target.value)}
                                            value={filters.category}
                                        >
                                            <option value="torique">Torique</option>
                                            <option value="spherique">Sphérique</option>
                                        </Select>

                                        <Button onClick={handleClearAllFilters} aria-label="Clear all filters">
                                            <LuFilterX style={{ fontSize: '30px' }} />
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
                                                <Td>
                                                <HStack spacing={2}>
                                                <IconButton
                                                    aria-label="Edit Order"
                                                    icon={<MdModeEditOutline />}
                                                    variant="ghost"
                                                    color="blue.400" // Subtle blue for inactive state
                                                    border="1px" // Adds a border
                                                    borderColor="blue.200" // Border matches the subtle icon color
                                                    _hover={{
                                                    bg: "blue.50",
                                                    color: "blue.500", // Stronger blue on hover
                                                    borderColor: "blue.500", // Border color matches hover icon
                                                    }}
                                                    onClick={() => handleEditPuissance(detail)}
                                                    isDisabled={true}
                                                />
                                                <IconButton
                                                    aria-label="Delete Stock"
                                                    icon={<MdDelete />}
                                                    variant="ghost"
                                                    color="red.400" // Subtle red for inactive state
                                                    border="1px" // Adds a border
                                                    borderColor="red.200" // Border matches the subtle icon color
                                                    _hover={{
                                                    bg: "red.50",
                                                    color: "red.500", // Stronger red on hover
                                                    borderColor: "red.500", // Border color matches hover icon
                                                    }}
                                                    isDisabled={true}
                                                />
                                                </HStack>
                                                </Td>
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

                                    {/* Edit Stock Drawer */}
                                    <Drawer isOpen={isEditPuissanceOpen} onClose={() => setIsEditPuissanceOpen(false)}>
                                        <DrawerContent>
                                        <Box p="4">
                                            <Heading as="h3" size="md">
                                            Modifier la puissance
                                            </Heading>
                                            <VStack spacing={4} align="stretch">
                                            {
                                                puissanceToEdit && (
                                                <>
                                                    <FormControl>
                                                        <FormLabel>Category</FormLabel>
                                                        <Select
                                                            placeholder="Sélectionner la Catégorie"
                                                            value={puissanceToEdit.category}
                                                            onChange={(e) => setPuissanceToEdit({ ...puissanceToEdit, category: e.target.value })}
                                                        >
                                                            <option value="spherique">Sphérique</option>
                                                            <option value="torique">Torique</option>
                                                        </Select>
                                                    </FormControl>

                                                    <FormControl>
                                                        <FormLabel>Sphère</FormLabel>
                                                        <Input
                                                        value={puissanceToEdit.sphere}
                                                        onChange={(e) => setPuissanceToEdit({ ...puissanceToEdit, sphere: e.target.value })}
                                                        />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Cylindre</FormLabel>
                                                        <Input
                                                        value={puissanceToEdit.cylinder}
                                                        onChange={(e) => setPuissanceToEdit({ ...puissanceToEdit, cylinder: e.target.value })}
                                                        />
                                                    </FormControl>

                                                    <HStack spacing={4} mt={4}>
                                                    <Button onClick={() => setIsEditPuissanceOpen(false)} variant="outline">
                                                        Annuler
                                                    </Button>
                                                    <Button colorScheme="green" onClick={() => handleUpdatePuissance()}>
                                                        Mettre à jour
                                                    </Button>
                                                    </HStack>
                                                </>
                                                )
                                            }
                                            </VStack>
                                        </Box>
                                        </DrawerContent>
                                    </Drawer>
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
