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
  const [newStock, setNewStock] = useState<Omit<StockType, 'id' | 'product'| 'createdAt' | 'updatedAt'>>({
    date: '',
    type: 'in',
    quantity: 0,
    productId: '',
  });
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchStock();
  }, []);

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
      if (response && response.data) {
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
        description: 'There was an error adding the new stock. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredStock = stock.filter(
    (item) =>
      item.type.toLowerCase().includes(typeFilter.toLowerCase()) &&
      item.product.id.toLowerCase().includes(productFilter.toLowerCase())
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
              <Input
                placeholder="Filter by type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
              <Input
                placeholder="Filter by product"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
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
                    <Th>Date</Th>
                    <Th>Type</Th>
                    <Th>Quantity</Th>
                    <Th>Product</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredStock.length === 0 ? (
                    <Tr>
                      <Td colSpan={4} textAlign="center">No stock found</Td>
                    </Tr>
                  ) : (
                    filteredStock.map((item) => (
                      <Tr key={item.id}>
                        <Td>{new Date(item.date).toLocaleDateString()}</Td>
                        <Td>{item.type}</Td>
                        <Td>{item.quantity}</Td>
                        <Td>{item.product.id}</Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
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
                  <option value="in">Incoming</option>
                  <option value="out">Outgoing</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Product ID</FormLabel>
                <Input
                  value={newStock.productId}
                  onChange={(e) => setNewStock({ ...newStock, productId: e.target.value })}
                />
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
