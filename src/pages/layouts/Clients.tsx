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
  
  interface Client {
    id: string;
    name: string;
    surename: string;
    sphere: string;
    cylinder: string;
    axis: string;
  }
  
  const mockClients = [
    { id: '1', name: 'John', surename: 'Doe', sphere: '+2.00', cylinder: '-0.50', axis: '180' },
    { id: '2', name: 'Jane', surename: 'Smith', sphere: '-1.75', cylinder: '-0.25', axis: '90' },
  ];
  
  export default function Clients() {
    const { isOpen, onClose, getButtonProps } = useDisclosure();
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
      name: '',
      surename: '',
      sphere: '',
      cylinder: '',
      axis: '',
    });
    const [isAddClientOpen, setIsAddClientOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [surnameFilter, setSurnameFilter] = useState('');
  
    const filteredClients = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        client.surename.toLowerCase().includes(surnameFilter.toLowerCase())
    );
  
    const handleAddClient = () => {
      // Basic validation
      if (!newClient.name || !newClient.surename) {
        alert('Please fill all the required fields.');
        return;
      }
  
      // Add the new client to the clients list
      const clientWithId = { ...newClient, id: (clients.length + 1).toString() };
      setClients((prevClients) => [...prevClients, clientWithId]);
  
      // Reset the form and close the drawer
      setNewClient({ name: '', surename: '', sphere: '', cylinder: '', axis: '' });
      setIsAddClientOpen(false);
    };
  
    return (
      <>
        <Head>
          <title>Clients Page | {BrandName}</title>
        </Head>
        <PreviewOptionsNavbar />
        <Flex as="nav" alignItems="center" justifyContent="space-between" h="16" py="2.5" pr="2.5">
          <HStack spacing={2}>
            <IconButton {...getButtonProps()} fontSize="18px" variant="ghost" icon={<BiMenu />} aria-label="open menu" />
            <Heading as="h1" size="md">
              Clients
            </Heading>
          </HStack>
          <Button leftIcon={<BiPlus />} colorScheme="blue" onClick={() => setIsAddClientOpen(true)}>
            Add Client
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
                  placeholder="Filter by name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
                <Input
                  placeholder="Filter by surname"
                  value={surnameFilter}
                  onChange={(e) => setSurnameFilter(e.target.value)}
                />
              </HStack>
            </VStack>
  
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Surname</Th>
                    <Th>Sphere</Th>
                    <Th>Cylinder</Th>
                    <Th>Axis</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredClients.map((client) => (
                    <Tr key={client.id}>
                      <Td>{client.name}</Td>
                      <Td>{client.surename}</Td>
                      <Td>{client.sphere}</Td>
                      <Td>{client.cylinder}</Td>
                      <Td>{client.axis}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </HStack>
  
        {/* Add Client Drawer */}
        <Drawer isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)}>
          <DrawerContent>
            <Box p="4">
              <Heading as="h3" size="md">
                Add New Client
              </Heading>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  />
                </FormControl>
  
                <FormControl isRequired>
                  <FormLabel>Surname</FormLabel>
                  <Input
                    value={newClient.surename}
                    onChange={(e) => setNewClient({ ...newClient, surename: e.target.value })}
                  />
                </FormControl>
  
                <FormControl>
                  <FormLabel>Sphere</FormLabel>
                  <Input
                    value={newClient.sphere}
                    onChange={(e) => setNewClient({ ...newClient, sphere: e.target.value })}
                  />
                </FormControl>
  
                <FormControl>
                  <FormLabel>Cylinder</FormLabel>
                  <Input
                    value={newClient.cylinder}
                    onChange={(e) => setNewClient({ ...newClient, cylinder: e.target.value })}
                  />
                </FormControl>
  
                <FormControl>
                  <FormLabel>Axis</FormLabel>
                  <Input
                    value={newClient.axis}
                    onChange={(e) => setNewClient({ ...newClient, axis: e.target.value })}
                  />
                </FormControl>
  
                <HStack spacing={4} mt={4}>
                  <Button onClick={() => setIsAddClientOpen(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleAddClient}>
                    Add Client
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
  