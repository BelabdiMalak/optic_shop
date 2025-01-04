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
import { FaClipboardList } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import { Head, PreviewOptionsNavbar } from '@src/components';
import { BrandName } from '@src/constants';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { StockType } from 'types/stock.type';
import { Type, SubType, Product } from 'types/product.type';

type ListItemType = {
  text?: string;
  icon: React.ElementType;
};

const listItems: ListItemType[] = [
  { text: 'Orders', icon: FaClipboardList },
  { text: 'Clients', icon: AiOutlineUsergroupAdd },
  { text: 'Products', icon: AiOutlineShoppingCart },
  { text: 'Stock', icon: MdOutlineInventory2 },
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
  const [stockTypeFilter, setStockTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<Type[]>([]); // List of types
  const [subtypes, setSubtypes] = useState<SubType[]>([]); // List of subtypes
  const [filteredSubtypes, setFilteredSubtypes] = useState<SubType[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // List of products
  const [selectedType, setSelectedType] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const toast = useToast();

  useEffect(() => {
    fetchStock();
    fetchData();
  }, []);

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

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId); // Set the selected type
    const filtered = subtypes.filter((subtype) => subtype.typeId === typeId); // Filter subtypes based on selected type
    setFilteredSubtypes(filtered); // Update the filtered subtypes list
    setSelectedSubtype(''); // Reset selected subtype
    setSubtypeFilter(''); // Reset subtype filter
  };
  
  
  const handleSubtypeChange = (subtypeId: string) => {
    setSelectedSubtype(subtypeId);  // Set the selected subtype
    const product = products.find(
      (product) => product.typeId === selectedType && product.subTypeId === subtypeId
    );
    if (product) {
      setNewStock({ ...newStock, productId: product.id });
    }
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

  const filteredStock = stock.filter(
    (item) =>
      item.type.toLowerCase().includes(stockTypeFilter.toLowerCase()) &&
      item.product.type.name.toLowerCase().includes(typeFilter.toLowerCase()) &&
      item.product.subType.name.toLowerCase().includes(subtypeFilter.toLowerCase()) &&
      (!newStock.date || new Date(item.date).toISOString().slice(0, 10) === newStock.date)
  );
  

    // Pagination Logic
    const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
    const currentStocks = filteredStock.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  return (
    <>
      <Head>
        <title>Stock Page | {BrandName}</title>
      </Head>
      <PreviewOptionsNavbar />
      <Flex as="nav" alignItems="center" justifyContent="space-between" h="16" py="2.5" px="2.5">
        <HStack spacing={2}>
          <IconButton {...getButtonProps()} fontSize="18px" variant="ghost" icon={<BiMenu />} aria-label="open menu" />
          <Heading as="h1" size="md">
            Stock
          </Heading>
        </HStack>
        <Button leftIcon={<BiPlus />} colorScheme="blue" onClick={() => setIsAddStockOpen(true)}>
          Add Stock
        </Button>
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
        placeholder="Select Type"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        {types.map((type) => (
          <option key={type.id} value={type.name}>
            {type.name}
          </option>
        ))}
      </Select>
    </FormControl>

    <FormControl>
      <Select
        placeholder="Select Subtype"
        value={subtypeFilter}
        onChange={(e) => setSubtypeFilter(e.target.value)}
      >
        {subtypes.map((subtype) => (
          <option key={subtype.id} value={subtype.name}>
            {subtype.name}
          </option>
        ))}
      </Select>
    </FormControl>

    <FormControl>
      <Select
        placeholder="Select Stock Type"
        value={stockTypeFilter}
        onChange={(e) => setStockTypeFilter(e.target.value)}
      >
        <option value="in">In</option>
        <option value="out">Out</option>
      </Select>
    </FormControl>

    <FormControl>
      <Input
        type="date"
        value={newStock.date}
        onChange={(e) => setNewStock({ ...newStock, date: e.target.value })}
      />
    </FormControl>
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
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Product Type</Th>
                    <Th>Product Subtype</Th>
                    <Th>Stock Type</Th>
                    <Th>Quantity</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentStocks.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center">No stock found</Td>
                    </Tr>
                  ) : (
                    currentStocks.map((item) => (
                      <Tr key={item.id}>
                        <Td>{new Date(item.date).toLocaleDateString()}</Td>
                        <Td>{item.product.type.name}</Td>
                        <Td>{item.product.subType.name}</Td>
                        <Td>{item.type}</Td>
                        <Td>{item.quantity}</Td>
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
                        colorScheme={page === currentPage ? 'blue' : 'gray'}
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
                    <Text>Items per page:</Text>
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

      {/* Add Stock Drawer */}
      <Drawer isOpen={isAddStockOpen} onClose={() => setIsAddStockOpen(false)}>
        <DrawerContent>
          <Box p="4">
            <Heading as="h3" size="md">
              Add New Stock
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
                <FormLabel>Quantity</FormLabel>
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
                  <option value="in">In</option>
                  <option value="out">Out</option>
                </Select>
              </FormControl>
                <FormControl isRequired>
                  <FormLabel>Product Type</FormLabel>
                  <Select
                    placeholder="Select Type"
                    value={selectedType}
                    onChange={(e) => handleTypeChange(e.target.value)}
                  >
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
              <FormLabel>Product Subtype</FormLabel>
              <Select
                placeholder="Select Subtype"
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
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleAddStock}>
                  Add Stock
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
