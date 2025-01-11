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
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  useColorModeValue,
  VStack,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { BiMenu, BiPlus } from 'react-icons/bi';
import { AiOutlineClose, AiOutlineShoppingCart, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import { MdDelete, MdModeEditOutline, MdOutlineInventory2 } from 'react-icons/md';
import { Head, PreviewOptionsNavbar, ThemeToggle } from '@src/components';
import { BrandName } from '@src/constants';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { StockType } from 'types/stock.type';
import { Type, SubType, Product } from 'types/product.type';
import { LuFilterX } from "react-icons/lu";
import { IoMdHome } from 'react-icons/io';
import { HiUsers } from 'react-icons/hi2';

type ListItemType = {
  text?: string;
  icon: React.ElementType;
};

const listItems = [
    { text: 'Général', icon: IoMdHome },
    { text: 'Commandes', icon: FaClipboardList },
    { text: 'Clients', icon: HiUsers },
    { text: 'Stock', icon: FaBoxOpen },
];

export default function Stock() {
  const { isOpen, onClose, getButtonProps } = useDisclosure();
  const [stock, setStock] = useState<StockType[]>([]);
  const [newStock, setNewStock] = useState<Omit<StockType, 'id' | 'product' | 'createdAt' | 'updatedAt'>>({
    date: '',
    type: 'in',
    quantity: 0,
    productId: '',
  });
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [subtypeFilter, setSubtypeFilter] = useState('');
  const [typeFilterV2, setTypeFilterV2] = useState('');
  const [subtypeFilterV2, setSubtypeFilterV2] = useState('');
  const [typeFilterV3, setTypeFilterV3] = useState('');
  const [subtypeFilterV3, setSubtypeFilterV3] = useState('');
  const [stockTypeFilter, setStockTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<Type[]>([]); // List of types
  const [subtypes, setSubtypes] = useState<SubType[]>([]); // List of subtypes
  // for creation
  const [filteredSubtypes, setFilteredSubtypes] = useState<SubType[]>([]);
  // for filtering
  const [filteredSubtypesV2, setFilteredSubtypesV2] = useState<SubType[]>([]);
  // for edition
  const [filteredSubtypesV3, setFilteredSubtypesV3] = useState<SubType[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // List of products
  const [selectedType, setSelectedType] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState('');
  const [selectedTypeV2, setSelectedTypeV2] = useState('');
  const [selectedSubtypeV2, setSelectedSubtypeV2] = useState('');
  const [selectedTypeV3, setSelectedTypeV3] = useState('');
  const [selectedSubtypeV3, setSelectedSubtypeV3] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [dateFilter, setDateFilter] = useState('');
  // State for the stock being edited
  const [isEditStockOpen, setIsEditStockOpen] = useState(false);
  const [stockToEdit, setStockToEdit] = useState<StockType | null>(null);

  const toast = useToast();

  useEffect(() => {
    fetchStock();
    fetchData();
  }, []);

  const handleEditStock = (stock: StockType) => {
    // Définir les valeurs initiales pour le type et le sous-type
    setSelectedTypeV3(stock.product?.type.id || ''); // Utiliser l'ID du type
    setSelectedSubtypeV3(stock.product?.subType.id || ''); // Utiliser l'ID du sous-type
  
    // Filtrer les sous-types correspondant au type sélectionné
    const filtered = subtypes.filter((subtype) => subtype.typeId === stock.product?.type.id);
    setFilteredSubtypesV3(filtered);
  
    setStockToEdit(stock); // Stock en cours d'édition
    setIsEditStockOpen(true); // Ouvrir le formulaire
  };
  

  const handleUpdateStock = async () => {
    try {
      if (!stockToEdit) return;

      const product = products.find(
        (product) => product.typeId === selectedTypeV3 && product.subTypeId === selectedSubtypeV3
      ) || null
      const updatedStock = {
        ...stockToEdit,
        productId: product?.id || ''
      }

      delete updatedStock.product

      const {id, ...data} = updatedStock
      const response = await window.electron.updateStock(id, data);

      if (response?.status) {
        setStock((prevStocks) =>
          prevStocks.map((stock) =>
            stock.id === updatedStock.id ? updatedStock : stock
          )
        );
        toast({
          title: 'Stock mise à jour',
          description: 'Stock mise à jour avec succès.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setIsEditStockOpen(false); // Fermer le tiroir
      } else {
        throw new Error('Échec de la mise à jour du stock');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock :', error);
      toast({
        title: 'Erreur lors de la mise à jour du stock',
        description: 'Une erreur s\'est produite',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteStock = async (stockId: string) => {
    try {
      const confirmation = window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce stock ?"
      );
      if (!confirmation) return;
  
      await window.electron.deleteStock(stockId);
      setStock((prevStocks) => prevStocks.filter((stock) => stock.id !== stockId));
  
      toast({
        title: "Stock supprimée",
        description: "Le Sotck a été supprimée avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la stock :", error);
      toast({
        title: "Erreur lors de la suppression de la stock",
        description: "Une erreur est survenue lors de la suppression de la stock.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchData = async () => {
    try {
      const typesResponse = await window.electron.getTypes({});
      const subtypesResponse = await window.electron.getSubTypes({});
      const productsResponse = await window.electron.getProducts({});

      setTypes(typesResponse.data || []);
      setSubtypes(subtypesResponse.data || []);
      setProducts(productsResponse.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const fetchStock = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await window.electron.getStocks({});
      if (response && response.data && Array.isArray(response.data)) {
        setStock(response.data);
      } else {
        setStock([]);
      }
    } catch (error) {
      console.error('Error fetching stock:', error);
      setError('Failed to load stock. Please try again.');
      setStock([]);
      toast({
        title: 'Error fetching stock',
        description: 'There was an error loading the stock list. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    // Reset all filter states
    setTypeFilter('');
    setSubtypeFilter('');
    setTypeFilterV2('');
    setSubtypeFilterV2('');
    setStockTypeFilter('');
    setDateFilter('');
    setSelectedType('');
    setSelectedSubtype('');
    setSelectedTypeV2('');
    setSelectedSubtypeV2('');
  
    // You may also want to reset the pagination to the first page
    setCurrentPage(1);
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    const filtered = subtypes.filter((subtype) => subtype.typeId === typeId);
    setFilteredSubtypes(filtered);
    setSelectedSubtype('');
    setSubtypeFilter(''); // Reset subtype filter
    const selectedTypeName = types.find((type) => type.id === typeId)?.name || '';
    setTypeFilter(selectedTypeName.toLowerCase()); // Update type filter
  };
  
  const handleSubtypeChange = (subtypeId: string) => {
    setSelectedSubtype(subtypeId);
    const product = products.find(
      (product) => product.typeId === selectedType && product.subTypeId === subtypeId
    )
    if (product) {
      setNewStock({ ...newStock, productId: product.id });
    }
    const selectedSubtypeName = subtypes.find((subtype) => subtype.id === subtypeId)?.name || '';
    setSubtypeFilter(selectedSubtypeName.toLowerCase()); // Update subtype filter
  };  

  const handleTypeChangeV2 = (typeId: string) => {
    setSelectedTypeV2(typeId);
    const filtered = subtypes.filter((subtype) => subtype.typeId === typeId);
    setFilteredSubtypesV2(filtered);
    setSelectedSubtypeV2('');
    setSubtypeFilter(''); // Reset subtype filter
    const selectedTypeName = types.find((type) => type.id === typeId)?.name || '';
    setTypeFilterV2(selectedTypeName.toLowerCase()); // Update type filter
  };
  
  const handleSubtypeChangeV2 = (subtypeId: string) => {
    setSelectedSubtypeV2(subtypeId);
    const selectedSubtypeName = subtypes.find((subtype) => subtype.id === subtypeId)?.name || '';
    setSubtypeFilterV2(selectedSubtypeName.toLowerCase()); // Update subtype filter
  };  
  
  const handleTypeChangeV3 = (typeId: string) => {
    setSelectedTypeV3(typeId);
  
    const filtered = subtypes.filter((subtype) => subtype.typeId === typeId);
    setFilteredSubtypesV3(filtered); // Mise à jour correcte des sous-types
  
    setSelectedSubtypeV3(''); // Réinitialiser le sous-type sélectionné
  };
  
  
  const handleSubtypeChangeV3 = (subtypeId: string) => {
    setSelectedSubtypeV3(subtypeId);
    const selectedSubtypeName = subtypes.find((subtype) => subtype.id === subtypeId)?.name || '';
    setSubtypeFilterV3(selectedSubtypeName.toLowerCase()); // Update subtype filter
  };  
  const handleAddStock = async () => {
    if (!newStock.date || newStock.quantity <= 0 || !newStock.productId) {
      toast({
        title: 'Invalid input',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await window.electron.createStock(newStock);
      if (response && response.data && response.status === true) {
        setStock((prevStock) => [...prevStock, response.data]);
        setNewStock({ date: '', type: 'in', quantity: 0, productId: '' });
        setIsAddStockOpen(false);
        toast({
          title: 'Stock added',
          description: 'The new stock has been successfully added.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      toast({
        title: 'Error adding stock',
        description: 'Insufficient quantity for product.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredStock = stock.filter((item) => {
    const typeMatch = typeFilterV2 ? item.product?.type.name.toLowerCase() === typeFilterV2 : true;
    const subtypeMatch = subtypeFilterV2 ? item.product?.subType.name.toLowerCase() === subtypeFilterV2 : true;
    const stockTypeMatch = stockTypeFilter ? item.type.toLowerCase() === stockTypeFilter.toLowerCase() : true;
    const dateMatch = dateFilter ? new Date(item.date).toISOString().slice(0, 10) === dateFilter : true;

    return typeMatch && subtypeMatch && stockTypeMatch && dateMatch;
  });  

  // Pagination Logic
  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
  const currentStocks = filteredStock.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Head>
        <title>Page de Stock | {BrandName}</title>
      </Head>
      <PreviewOptionsNavbar />
      <Flex as="nav" alignItems="center" justifyContent="space-between" h="16" py="2.5" px="2.5">
        <HStack spacing={2}>
          <IconButton {...getButtonProps()} fontSize="18px" variant="ghost" icon={<BiMenu />} aria-label="ouvrir le menu" />
          <Heading as="h1" size="md">
            Stock
          </Heading>
        </HStack>
        <Flex justifyContent="flex-end" gap={2}>
            <ThemeToggle />
            <Button
                leftIcon={<BiPlus />}
                colorScheme="green"
                onClick={() => setIsAddStockOpen(true)}
            >
                Ajouter
            </Button>
        </Flex>
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

        <Box p={4} w="full">
          <VStack spacing={4} align="stretch" mb={4}>
            <HStack>
              <FormControl>
                <Select
                  placeholder="Sélectionner le Type"
                  value={selectedTypeV2}
                  onChange={(e) => handleTypeChangeV2(e.target.value)}
                >
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <Select
                  placeholder="Sélectionner le Sous-Type"
                  value={selectedSubtypeV2}
                  onChange={(e) => handleSubtypeChangeV2(e.target.value)}
                  isDisabled={!selectedTypeV2}
                >
                  {filteredSubtypesV2.map((subtype) => (
                    <option key={subtype.id} value={subtype.id}>
                      {subtype.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <Select
                  placeholder="Sélectionner le Type de Stock"
                  value={stockTypeFilter}
                  onChange={(e) => setStockTypeFilter(e.target.value)}
                >
                  <option value="in">Entrée</option>
                  <option value="out">Sortie</option>
                </Select>
              </FormControl>

              <FormControl>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value )}
                />
              </FormControl>
              <Button
              onClick={handleClearFilters}
              aria-label="Clear all filters"
            >
              <LuFilterX style={{ fontSize: '69px' }} />

            </Button>
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
              <>
                <Table fontSize={"sm"}>
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Type de Produit</Th>
                      <Th>Sous-Type de Produit</Th>
                      <Th>Type de Stock</Th>
                      <Th>Quantité</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentStocks.length === 0 ? (
                      <Tr>
                        <Td colSpan={5} textAlign="center">Aucun stock trouvé</Td>
                      </Tr>
                    ) : (
                      currentStocks.map((item) => (
                        <Tr key={item.id}>
                          <Td>{new Date(item.date).toLocaleDateString()}</Td>
                          <Td>{item.product ? item.product.type.name: '-'}</Td>
                          <Td>{item.product ? item.product.subType.name: '-'}</Td>
                          <Td>{item.type}</Td>
                          <Td>{item.quantity}</Td>
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
                            onClick={() => handleEditStock(item)}
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
                            onClick={() => handleDeleteStock(item.id)}
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
                    <Text>Articles par page :</Text>
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
              </>
            )}
          </Box>
        </Box>
      </HStack>

      {/* Ajouter un Stock */}
      <Drawer isOpen={isAddStockOpen} onClose={() => setIsAddStockOpen(false)}>
        <DrawerContent>
          <Box p="4">
            <Heading as="h3" size="md">
              Ajouter un Nouveau Stock
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={newStock.date}
                  onChange={(e) => setNewStock({ ...newStock, date: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Quantité</FormLabel>
                <NumberInput
                  value={newStock.quantity}
                  onChange={(valueString) => setNewStock({ ...newStock, quantity: parseInt(valueString, 10) || 0 })}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  value={newStock.type}
                  onChange={(e) => setNewStock({ ...newStock, type: e.target.value })}
                >
                  <option value="in">Entrée</option>
                  <option value="out">Sortie</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Type de Produit</FormLabel>
                <Select
                  placeholder="Sélectionner le Type"
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  {
                  
                  types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Sous-Type de Produit</FormLabel>
                <Select
                  placeholder="Sélectionner le Sous-Type"
                  value={selectedSubtype}
                  onChange={(e) => handleSubtypeChange(e.target.value)}
                  isDisabled={!selectedType}
                >
                  {filteredSubtypes.map((subtype) => (
                    <option key={subtype.id} value={subtype.id}>
                      {subtype.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <HStack spacing={4} mt={4}>
                <Button onClick={() => setIsAddStockOpen(false)} variant="outline">
                  Annuler
                </Button>
                <Button colorScheme="green" onClick={handleAddStock}>
                  Ajouter le Stock
                </Button>
              </HStack>
            </VStack>
          </Box>
        </DrawerContent>
      </Drawer>
      {/* Edit Stock Drawer */}
      <Drawer isOpen={isEditStockOpen} onClose={() => setIsEditStockOpen(false)}>
        <DrawerContent>
          <Box p="4">
            <Heading as="h3" size="md">
              Modifier le Stock
            </Heading>
            <VStack spacing={4} align="stretch">
              {
                stockToEdit && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Date</FormLabel>
                      <Input
                        type="date"
                        value={new Date(stockToEdit.date).toISOString().split('T')[0]}
                        onChange={(e) => setStockToEdit({ ...stockToEdit, date: e.target.value })}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Quantité</FormLabel>
                      <NumberInput
                        value={stockToEdit.quantity}
                        onChange={(valueString) => setStockToEdit({ ...stockToEdit, quantity: parseInt(valueString, 10) || 0 })}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Type</FormLabel>
                      <Select
                        value={stockToEdit.type}
                        onChange={(e) => setStockToEdit({ ...stockToEdit, type: e.target.value })}
                      >
                        <option value="in">Entrée</option>
                        <option value="out">Sortie</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Type de Produit</FormLabel>
                      <Select
                          placeholder="Sélectionner le Type"
                          value={selectedTypeV3}
                          onChange={(e) => {
                            handleTypeChangeV3(e.target.value);
                          }}
                        >
                        {types.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Sous-Type de Produit</FormLabel>
                      <Select
                        placeholder="Sélectionner le Sous-Type"
                        value={selectedSubtypeV3}
                        onChange={(e) => handleSubtypeChangeV3(e.target.value)}
                        isDisabled={!selectedTypeV3}
                      >
                        {filteredSubtypesV3.map((subtype) => (
                          <option key={subtype.id} value={subtype.id}>
                            {subtype.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <HStack spacing={4} mt={4}>
                      <Button onClick={() => setIsEditStockOpen(false)} variant="outline">
                        Annuler
                      </Button>
                      <Button colorScheme="green" onClick={() => handleUpdateStock()}>
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

const ListElement = ({ icon, text }: ListItemType) => {
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
