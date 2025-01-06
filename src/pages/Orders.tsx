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
  useToast,
  Spinner,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/react';
import { BiMenu, BiPlus } from 'react-icons/bi';
import { AiOutlineClose, AiOutlineShoppingCart, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaClipboardList } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import { Head, PreviewOptionsNavbar } from '@src/components';
import { BrandName } from '@src/constants';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useProducts } from '../hooks/useProducts';
import { SubType, Type } from 'types/product.type';
import { Product } from '@prisma/client';
import { Order } from 'types/order.type';

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

export default function OrderManagement() {
  const { isOpen, onClose, getButtonProps } = useDisclosure();
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState<Omit<Order, 'id'>>({
    userId: '',
    productId: '',
    framePrice: 0,
    productPrice: 0,
    deposit: 0,
    status: 'Pending',
    date: ''
  });
  const [types, setTypes] = useState<Type[]>([]); // List of types
  const [subtypes, setSubtypes] = useState<SubType[]>([]); // List of subtypes
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [userFilter, setUserFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedType, setSelectedType] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState('');
  const [filteredSubtypes, setFilteredSubtypes] = useState<SubType[]>([]);
  const [subtypeFilter, setSubtypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]); // List of products


  const toast = useToast();

  const { users, isLoading: isLoadingUsers } = useUsers();
  const { products, isLoading: isLoadingProducts } = useProducts();

  useEffect(() => {
    fetchOrders();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const typesResponse = await window.electron.getTypes({});
      console.log(typesResponse)
      const subtypesResponse = await window.electron.getSubTypes({});
      const productsResponse = await window.electron.getProducts({});

      setTypes(typesResponse.data || []);
      setSubtypes(subtypesResponse.data || []);
      setAllProducts(productsResponse.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedOrders = await window.electron.getOrders({});
      if (fetchedOrders && fetchedOrders.data && Array.isArray(fetchedOrders.data)) {
        setOrders(fetchedOrders.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
      toast({
        title: 'Error fetching orders',
        description: 'There was an error loading the order list. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const user = users.find((u) => u.id === order.userId);
    const orderDate = new Date(order.date).toLocaleDateString();
    const selectedDate = dateFilter ? new Date(dateFilter).toLocaleDateString() : null;
    const dateMatches = selectedDate ? orderDate === selectedDate : true;

    const userMatches = userFilter
      ? (user?.name.toLowerCase().includes(userFilter.toLowerCase()) ||
         user?.surename.toLowerCase().includes(userFilter.toLowerCase()))
      : true;

    const statusMatches = statusFilter
      ? order.status.toLowerCase() === statusFilter.toLowerCase()
      : true; // Filter by status

    return dateMatches && userMatches && statusMatches;
  });

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId); // Set the selected type
    const filtered = subtypes.filter((subtype) => subtype.typeId === typeId); // Filter subtypes based on selected type
    setFilteredSubtypes(filtered); // Update the filtered subtypes list
    setSelectedSubtype(''); // Reset selected subtype
    setSubtypeFilter(''); // Reset subtype filter
  };
  
  
  const handleSubtypeChange = (subtypeId: string) => {
    setSelectedSubtype(subtypeId);  // Set the selected subtype
    const product = allProducts.find(
      (product) => product.typeId === selectedType && product.subTypeId === subtypeId
    );
    if (product) {
      setNewOrder({ ...newOrder, productId: product.id });
    }
  };

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentClients = filteredOrders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const handleAddOrder = async () => {
      if (!newOrder.userId || !newOrder.productId) {
        toast({
          title: 'Invalid input',
          description: 'Please select a user and a product.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    
      // Calculate the total price and the rest value
      const total = newOrder.framePrice + newOrder.productPrice;
      const rest = total - newOrder.deposit;
    
      // Set the status based on the rest value
      const status = rest === 0 ? 'completed' : 'pending';
    
      // Update the new order with the calculated status
      const updatedOrder = { ...newOrder, status };
    
      try {
        console.log('Sending order data:', updatedOrder);
        const response = await window.electron.createOrder(updatedOrder);
        console.log('Received response:', response);
    
        if (response?.status === false) {
          // Handle insufficient stock
          toast({
            title: 'Insufficient Stock',
            description: `Only ${response.data.quantity} items available in stock.`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return; // Exit the function to prevent further processing
        }
    
        if (response && response.data) {
          // Order created successfully
          setOrders((prevOrders) => [...prevOrders, response.data]);
          setNewOrder({
            userId: '',
            productId: '',
            framePrice: 0,
            productPrice: 0,
            deposit: 0,
            status: 'pending',
            date: ''
          });
          setIsAddOrderOpen(false);
          toast({
            title: 'Order added',
            description: `Order #${response.data.id} has been successfully added.`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          await fetchOrders(); // Refresh the order list
        } else {
          // Handle unexpected response
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error adding order:', error);
        toast({
          title: 'Error adding order',
          description: 'There was an error adding the new order. Please check the console for more details.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
  

  return (
    <>
      <Head>
        <title>Order Management | {BrandName}</title>
      </Head>
      <PreviewOptionsNavbar />
      <Flex as="nav" alignItems="center" justifyContent="space-between" h="16" py="2.5" pr="2.5">
        <HStack spacing={2}>
          <IconButton {...getButtonProps()} fontSize="18px" variant="ghost" icon={<BiMenu />} aria-label="open menu" />
          <Heading as="h1" size="md">
            Order Management
          </Heading>
        </HStack>
        <Button leftIcon={<BiPlus />} colorScheme="blue" onClick={() => setIsAddOrderOpen(true)}>
          Add Order
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
                placeholder="Filter by user"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
              <Input
                  type="date"
                  placeholder="Filter by date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              <Select
                placeholder="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
                <option value="pending">Pending</option>
              </Select>
            </HStack>
          </VStack>

          <Box overflowX="auto">
            {isLoading || isLoadingUsers || isLoadingProducts ? (
              <Flex justify="center" align="center" height="200px">
                <Spinner />
              </Flex>
            ) : error ? (
              <Text color="red.500" textAlign="center">{error}</Text>
            ) : (
            <>
              <Table>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Nom</Th>
                  <Th>Prénom</Th>
                  <Th>Type</Th>
                  <Th>Sous Type</Th>
                  <Th>Prix Monture</Th>
                  <Th>Prix Produit</Th>
                  <Th>Versement</Th>
                  <Th>Total</Th>
                  <Th>Reste</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentClients.length === 0 ? (
                  <Tr>
                    <Td colSpan={10} textAlign="center">No orders found</Td>
                  </Tr>
                ) : (
                  currentClients.map((order) => {
                    const user = users.find(u => u.id === order.userId);
                    const product = products.find(p => p.id === order.productId);
                    const total = order.framePrice + order.productPrice;
                    const rest = total - order.deposit;
                    return (
                      <Tr key={order.id}>
                        <Td>{new Date(order.date).toLocaleDateString()}</Td>
                        <Td>{user?.name}</Td>
                        <Td>{user?.surename}</Td>
                        <Td>{product?.type?.name}</Td>
                        <Td>{product?.subType?.name}</Td>
                        <Td>{order.framePrice}</Td>
                        <Td>{order.productPrice}</Td>
                        <Td>{order.deposit}</Td>
                        <Td>{total}</Td>
                        <Td>{rest}</Td>
                        <Td>{order.status}</Td>
                      </Tr>
                    );
                  })
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

      {/* Add Order Drawer */}
      <Drawer isOpen={isAddOrderOpen} onClose={() => setIsAddOrderOpen(false)}>
        <DrawerContent>
          <Box p="4">
            <Heading as="h3" size="md">
              Add New Order
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>User</FormLabel>
                <Select
                  placeholder="Select user"
                  value={newOrder.userId}
                  onChange={(e) => setNewOrder({ ...newOrder, userId: e.target.value })}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {`${user.name} ${user.surename}`}
                    </option>
                  ))}
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
              <FormControl>
                <FormLabel>Frame Price</FormLabel>
                <NumberInput
                  value={newOrder.framePrice}
                  onChange={(valueString) => setNewOrder({ ...newOrder, framePrice: Number(valueString) })}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Product Price</FormLabel>
                <NumberInput
                  value={newOrder.productPrice}
                  onChange={(valueString) => setNewOrder({ ...newOrder, productPrice: Number(valueString) })}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Deposit</FormLabel>
                <NumberInput
                  value={newOrder.deposit}
                  onChange={(valueString) => setNewOrder({ ...newOrder, deposit: Number(valueString) })}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <HStack spacing={4} mt={4}>
                <Button onClick={() => setIsAddOrderOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleAddOrder}>
                  Add Order
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
