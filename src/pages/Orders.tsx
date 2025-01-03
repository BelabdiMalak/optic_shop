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

interface Order {
  id: string;
  userId: string;
  productId: string;
  framePrice: number;
  productPrice: number;
  deposit: number;
  status: string;
}

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
  });
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [userFilter, setUserFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const { users, isLoading: isLoadingUsers } = useUsers();
  const { products, isLoading: isLoadingProducts } = useProducts();

  useEffect(() => {
    fetchOrders();
  }, []);

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
    const product = products.find((p) => p.id === order.productId);
  
    const userMatches = userFilter
      ? user?.name.toLowerCase().includes(userFilter.toLowerCase())
      : true; // No filter means include all
  
    const productMatches = productFilter
      ? product?.typeId.toLowerCase().includes(productFilter.toLowerCase())
      : true; // No filter means include all
  
    return userMatches && productMatches;
  });

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
  
    try {
      console.log('Sending order data:', newOrder);
      const response = await window.electron.createOrder(newOrder);
      console.log('Received response:', response);
  
      if (response?.status === false && response.message === 'Not enough quantity in stock') {
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
                placeholder="Filter by product"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              />
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
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Order ID</Th>
                    <Th>User</Th>
                    <Th>Product</Th>
                    <Th>Frame Price</Th>
                    <Th>Product Price</Th>
                    <Th>Deposit</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOrders.length === 0 ? (
                    <Tr>
                      <Td colSpan={7} textAlign="center">No orders found</Td>
                    </Tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <Tr key={order.id}>
                        <Td>{order.id}</Td>
                        <Td>{users.find(u => u.id === order.userId)?.name}</Td>
                        <Td>{products.find(p => p.id === order.productId)?.typeId}</Td>
                        <Td>{order.framePrice}</Td>
                        <Td>{order.productPrice}</Td>
                        <Td>{order.deposit}</Td>
                        <Td>{order.status}</Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
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
                <FormLabel>Product</FormLabel>
                <Select
                  placeholder="Select product"
                  value={newOrder.productId}
                  onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {`${product.typeId} - ${product.subTypeId}`}
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
