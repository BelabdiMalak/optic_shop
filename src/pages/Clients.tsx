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
} from '@chakra-ui/react';
import { BiMenu, BiPlus } from 'react-icons/bi';
import { AiOutlineClose, AiOutlineShoppingCart, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaClipboardList } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import { Head, PreviewOptionsNavbar } from '@src/components';
import { BrandName } from '@src/constants';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Client } from 'types/client.type';

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

export default function Clients() {
  const { isOpen, onClose, getButtonProps } = useDisclosure();
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    surename: '',
    sphere: '', 
    cylinder: '', 
    axis: '', 
  });
  
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [surnameFilter, setSurnameFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const toast = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await window.electron.getUsers({});
      if (response && response.data && Array.isArray(response.data)) {
        setClients(response.data);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Failed to load clients. Please try again.');
      setClients([]);
      toast({
        title: 'Error fetching clients',
        description: 'There was an error loading the client list. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>{
      return client.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      client.surename.toLowerCase().includes(surnameFilter.toLowerCase())
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.surename) {
      toast({
        title: 'Invalid input',
        description: 'Please fill in at least the name and surname fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await window.electron.createUser(newClient);
      if (response && response.data) {
        setClients((prevClients) => [...prevClients, response.data]);
        setNewClient({ name: '', surename: '', sphere: '', cylinder: '', axis: '' });
        setIsAddClientOpen(false);
        toast({
          title: 'Client added',
          description: 'The new client has been successfully added.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: 'Error adding client',
        description: 'There was an error adding the new client. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
                      <Th>Name</Th>
                      <Th>Surname</Th>
                      <Th>Sphere</Th>
                      <Th>Cylinder</Th>
                      <Th>Axis</Th>
                      <Th>createdAt</Th>
                      <Th>updatedAt</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentClients.length === 0 ? (
                      <Tr>
                        <Td colSpan={7} textAlign="center">No clients found</Td>
                      </Tr>
                    ) : (
                      currentClients.map((client) => (
                        <Tr key={client.id}>
                          <Td>{client.name}</Td>
                          <Td>{client.surename}</Td>
                          <Td>{client.sphere}</Td>
                          <Td>{client.cylinder}</Td>
                          <Td>{client.axis}</Td>
                          <Td>{new Date(client.createdAt).toLocaleDateString()}</Td>
                          <Td>{new Date(client.updatedAt).toLocaleDateString()}</Td>
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
                onChange={(e) =>
                  setNewClient({ ...newClient, sphere: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cylinder</FormLabel>
              <Input
                value={newClient.cylinder}
                onChange={(e) =>
                  setNewClient({ ...newClient, cylinder: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Axis</FormLabel>
              <Input
                value={newClient.axis}
                onChange={(e) =>
                  setNewClient({ ...newClient, axis: e.target.value })
                }
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
