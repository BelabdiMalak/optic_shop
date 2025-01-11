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
import { AiOutlineClose } from 'react-icons/ai';
import { FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import { Head, PreviewOptionsNavbar, ThemeToggle } from '@src/components';
import { BrandName } from '@src/constants';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Client } from 'types/client.type';
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

export default function Clients() {
  // State for the order being edited
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

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

  // Open edit order drawer
  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    setIsEditClientOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const confirmation = window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce client ?"
      );
      if (!confirmation) return;
  
      const de = await window.electron.deleteUser(clientId);
      console.log('suppression : ', de)
      setClients((prevClients) => prevClients.filter((client) => client.id !== clientId));
  
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du client :", error);
      toast({
        title: "Erreur lors de la suppression du client",
        description: "Une erreur est survenue lors de la suppression du client.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      delete updatedClient.createdAt;
      delete updatedClient.updatedAt;
      
      const {id, ...data} = updatedClient
      const response = await window.electron.updateUser(id, data);
      console.log(response)
      if (response?.status) {
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === updatedClient.id ? updatedClient : client
          )
        );
        toast({
          title: 'Client mis à jour',
          description: 'Client mis à jour avec succès.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setIsEditClientOpen(false); // Fermer le tiroir
      } else {
        throw new Error('Échec de la mise à jour du client');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client :', error);
      toast({
        title: 'Erreur lors de la mise à jour du client',
        description: 'Une erreur s\'est produite',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

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
      console.error('Erreur lors de la récupération des clients :', error);
      setError('Impossible de charger les clients. Veuillez réessayer.');
      setClients([]);
      toast({
        title: 'Erreur lors de la récupération des clients',
        description: 'Une erreur s\'est produite lors du chargement de la liste des clients. Veuillez réessayer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    return (
      !client.isDeleted &&
      client.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      client.surename.toLowerCase().includes(surnameFilter.toLowerCase())
    );
  });  

  // Logique de pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setNameFilter('');
    setSurnameFilter('');
  };
  
  const handleAddClient = async () => {
    if (!newClient.name || !newClient.surename) {
      toast({
        title: 'Entrée invalide',
        description: 'Veuillez remplir au moins les champs prénom et nom.',
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
          title: 'Client ajouté',
          description: 'Le nouveau client a été ajouté avec succès.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error('Structure de réponse invalide');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client :', error);
      toast({
        title: 'Erreur lors de l\'ajout du client',
        description: 'Une erreur s\'est produite lors de l\'ajout du client. Veuillez réessayer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Page des Clients | {BrandName}</title>
      </Head>
      <PreviewOptionsNavbar />
      <Flex as="nav" alignItems="center" justifyContent="space-between" h="16" py="2.5" pr="2.5">
        <HStack spacing={2}>
          <IconButton {...getButtonProps()} fontSize="18px" variant="ghost" icon={<BiMenu />} aria-label="ouvrir le menu" />
          <Heading as="h1" size="md">
            Clients
          </Heading>
        </HStack>
        <Flex justifyContent="flex-end" gap={2}>
            <ThemeToggle />
            <Button
                leftIcon={<BiPlus />}
                colorScheme="green"
                onClick={() => setIsAddClientOpen(true)}
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
              <Input
                placeholder="Filtrer par prénom"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
              <Input
                placeholder="Filtrer par nom"
                value={surnameFilter}
                onChange={(e) => setSurnameFilter(e.target.value)}
              />
              <Button
              onClick={handleClearFilters}
              aria-label="Clear all filters"
            >
              <LuFilterX style={{ fontSize: '35px' }} />

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
                <Table fontSize={'sm'}>
                  <Thead>
                    <Tr>
                      <Th>Prénom</Th>
                      <Th>Nom</Th>
                      <Th>Sphère</Th>
                      <Th>Cylindre</Th>
                      <Th>Axe</Th>
                      <Th>Date de création</Th>
                      <Th>Date de mise à jour</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentClients.length === 0 ? (
                      <Tr>
                        <Td colSpan={7} textAlign="center">Aucun client trouvé</Td>
                      </Tr>
                    ) : (
                      currentClients.map((client) => (
                        <Tr key={client.id}>
                          <Td>{client.name}</Td>
                          <Td>{client.surename}</Td>
                          <Td>{client.sphere}</Td>
                          <Td>{client.cylinder}</Td>
                          <Td>{client.axis}</Td>
                          <Td>{client.createdAt ? new Date(client.createdAt).toLocaleDateString() : '-'}</Td>
                          <Td>{client.updatedAt ? new Date(client.updatedAt).toLocaleDateString() : '-'}</Td>

                        <Td>
                          <HStack spacing={2}>
                          <IconButton
                            aria-label="Edit Client"
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
                            onClick={() => handleEditClient(client)}
                          />
                          <IconButton
                            aria-label="Delete CLient"
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
                            onClick={() => handleDeleteClient(client.id)}
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

      {/* Ajouter un Client */}
      <Drawer isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)}>
        <DrawerContent>
          <Box p="4">
            <Heading as="h3" size="md">
              Ajouter un Nouveau Client
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Prénom</FormLabel>
                <Input
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Nom</FormLabel>
                <Input
                  value={newClient.surename}
                  onChange={(e) => setNewClient({ ...newClient, surename: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Sphère</FormLabel>
                <Input
                  value={newClient.sphere}
                  onChange={(e) =>
                    setNewClient({ ...newClient, sphere: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Cylindre</FormLabel>
                <Input
                  value={newClient.cylinder}
                  onChange={(e) =>
                    setNewClient({ ...newClient, cylinder: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Axe</FormLabel>
                <Input
                  value={newClient.axis}
                  onChange={(e) =>
                    setNewClient({ ...newClient, axis: e.target.value })
                  }
                />
              </FormControl>

              <HStack spacing={4} mt={4}>
                <Button onClick={() => setIsAddClientOpen(false)} variant="outline">
                  Annuler
                </Button>
                <Button colorScheme="green" onClick={handleAddClient}>
                  Ajouter
                </Button>
              </HStack>
            </VStack>
          </Box>
        </DrawerContent>
      </Drawer>
      {/* Modifier un Client */}
      <Drawer isOpen={isEditClientOpen} onClose={() => setIsEditClientOpen(false)}>
        <DrawerContent>
          <Box p="4">
            <Heading as="h3" size="md">
              Modifier un Client
            </Heading>
            <VStack spacing={4} align="stretch">
              { clientToEdit && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Prénom</FormLabel>
                    <Input
                      value={clientToEdit.name}
                      onChange={(e) => setClientToEdit({ ...clientToEdit, name: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Nom</FormLabel>
                    <Input
                      value={clientToEdit.surename}
                      onChange={(e) => setClientToEdit({ ...clientToEdit, surename: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Sphère</FormLabel>
                    <Input
                      value={clientToEdit.sphere}
                      onChange={(e) =>
                        setClientToEdit({ ...clientToEdit, sphere: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Cylindre</FormLabel>
                    <Input
                      value={clientToEdit.cylinder}
                      onChange={(e) =>
                        setClientToEdit({ ...clientToEdit, cylinder: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Axe</FormLabel>
                    <Input
                      value={clientToEdit.axis}
                      onChange={(e) =>
                        setClientToEdit({ ...clientToEdit, axis: e.target.value })
                      }
                    />
                  </FormControl>

                  <HStack spacing={4} mt={4}>
                    <Button onClick={() => setIsEditClientOpen(false)} variant="outline">
                      Annuler
                    </Button>
                    <Button colorScheme="green" onClick={() => handleUpdateClient(clientToEdit)}>
                      Mettre à jour
                    </Button>
                  </HStack>
                </>
              )}
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
