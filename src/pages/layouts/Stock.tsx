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
  
  interface Stock {
    id: string;
    date: string;
    type: string;
    quantity: number;
    productId: string;
  }
  
  const mockStock = [
    { id: '1', date: '2024-12-15', type: 'Incoming', quantity: 50, productId: 'p1' },
    { id: '2', date: '2024-12-16', type: 'Outgoing', quantity: 30, productId: 'p2' },
  ];
  
  export default function Stock() {
    const { isOpen, onClose, getButtonProps } = useDisclosure();
    const [stock, setStock] = useState<Stock[]>(mockStock);
    const [newStock, setNewStock] = useState<Stock>({
      id: '',
      date: '',
      type: 'Incoming',
      quantity: 0,
      productId: '',
    });
    const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  
    const handleAddStock = () => {
      // Basic validation
      if (!newStock.date || newStock.quantity <= 0 || !newStock.productId) {
        alert('Please fill all the fields correctly.');
        return;
      }
  
      // Add the new stock to the stock list
      const stockWithId = { ...newStock, id: (stock.length + 1).toString() };
      setStock((prevStock) => [...prevStock, stockWithId]);
  
      // Reset the form and close the drawer
      setNewStock({ id: '', date: '', type: 'Incoming', quantity: 0, productId: '' });
      setIsAddStockOpen(false);
    };
  
    return (
      <>
        <Head>
          <title>Stock Page | {BrandName}</title>
        </Head>
        <PreviewOptionsNavbar />
        <Flex as="nav" alignItems="center" justifyContent="space-between" h="16" py="2.5" pr="2.5">
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
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Type</Th>
                    <Th>Quantity</Th>
                    <Th>Product ID</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stock.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.date}</Td>
                      <Td>{item.type}</Td>
                      <Td>{item.quantity}</Td>
                      <Td>{item.productId}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
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
                    onChange={(valueString) => setNewStock({ ...newStock, quantity: parseInt(valueString) })}
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
                    <option value="Incoming">Incoming</option>
                    <option value="Outgoing">Outgoing</option>
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
  