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
    useColorModeValue,
    useDisclosure,
    VStack,
    FormControl,
    FormLabel,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
  } from '@chakra-ui/react';
  import { BiMenu, BiPlus } from 'react-icons/bi';
  import { AiOutlineClose, AiOutlineShoppingCart, AiOutlineUsergroupAdd } from 'react-icons/ai';
  import { FaClipboardList } from 'react-icons/fa';
  import { MdOutlineInventory2 } from 'react-icons/md';
  import { Head, PreviewOptionsNavbar } from '@src/components';
  import { BrandName } from '@src/constants';
  import { Link } from 'react-router-dom';
  import { useState } from 'react';
  
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
  
  interface Order {
    id: string;
    date: string;
    deposit: number;
    status: string;
    userId: string;
  }
  
  const mockOrders = [
    { id: '1', date: '2024-12-15', deposit: 100, status: 'Pending', userId: '1' },
    { id: '2', date: '2024-12-16', deposit: 200, status: 'Completed', userId: '2' },
  ];
  
  export default function Orders() {
    const { isOpen, onClose, getButtonProps } = useDisclosure();
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  
    const [newOrder, setNewOrder] = useState<Order>({
      id: '',
      date: '',
      deposit: 0,
      status: 'Pending',
      userId: '',
    });
  
    const filteredOrders = orders.filter(
      (order) =>
        order.status.toLowerCase().includes(statusFilter.toLowerCase()) &&
        order.date.includes(dateFilter)
    );
  
    const handleAddOrder = () => {
      // Basic validation
      if (!newOrder.date || !newOrder.userId || newOrder.deposit <= 0) {
        alert('Please fill all the fields correctly.');
        return;
      }
  
      // Add the new order to the orders list
      const orderWithId = { ...newOrder, id: (orders.length + 1).toString() };
      setOrders((prevOrders) => [...prevOrders, orderWithId]);
  
      // Reset the form and close the drawer
      setNewOrder({ id: '', date: '', deposit: 0, status: 'Pending', userId: '' });
      setIsAddOrderOpen(false);
    };
  
    return (
      <>
        <Head>
          <title>Orders Page | {BrandName}</title>
        </Head>
        <PreviewOptionsNavbar />
        <Flex as="nav" alignItems="center" justifyContent="space-between" h="16" py="2.5" pr="2.5">
          <HStack spacing={2}>
            <IconButton {...getButtonProps()} fontSize="18px" variant="ghost" icon={<BiMenu />} aria-label="open menu" />
            <Heading as="h1" size="md">
              Orders
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
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
                <Input
                  placeholder="Filter by date (YYYY-MM-DD)"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </HStack>
            </VStack>
  
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Deposit</Th>
                    <Th>Status</Th>
                    <Th>User ID</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOrders.map((order) => (
                    <Tr key={order.id}>
                      <Td>{order.date}</Td>
                      <Td>{order.deposit}</Td>
                      <Td>{order.status}</Td>
                      <Td>{order.userId}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    value={newOrder.date}
                    onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
                  />
                </FormControl>
  
                <FormControl isRequired>
                  <FormLabel>Deposit</FormLabel>
                  <NumberInput
                    value={newOrder.deposit}
                    onChange={(valueString) => setNewOrder({ ...newOrder, deposit: parseInt(valueString) })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
  
                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </Select>
                </FormControl>
  
                <FormControl isRequired>
                  <FormLabel>User ID</FormLabel>
                  <Input
                    value={newOrder.userId}
                    onChange={(e) => setNewOrder({ ...newOrder, userId: e.target.value })}
                  />
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
        <ListItem as={HStack} spacing={0} h="10" pl="2.5" cursor="pointer" _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }} rounded="md">
          <ListIcon boxSize={5} as={icon} />
          {text && <Text>{text}</Text>}
        </ListItem>
      </Link>
    );
  };
  