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
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
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
import { IoEyeSharp } from 'react-icons/io5';

type ListItemType = {
  text?: string;
  icon: React.ElementType;
};

const listItems = [
    { text: 'Général', icon: IoMdHome },
    { text: 'Commandes', icon: FaClipboardList },
    { text: 'Clients', icon: HiUsers },
    { text: 'Stock', icon: FaBoxOpen },
    { text: 'Puissances', icon: IoEyeSharp },
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
    sphereL: '0', 
    sphereR: '0',
    cylinderL: '0',
    cylinderR: '0', 
    axisL: '0',
    axisR: '0',
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
    const toastId = toast({
      title: "Confirmation",
      description: "Êtes-vous sûr de vouloir supprimer ce client ?",
      status: "warning",
      duration: null, // Laisse le toast ouvert jusqu'à une action
      isClosable: true,
      position: "top",
      render: ({ onClose }) => (
        <Box p={3} bg={useColorModeValue('gray.50', 'gray.900')} borderRadius="md" boxShadow="md">
          <Text fontWeight="bold">Confirmation</Text>
          <Text mt={2}>Êtes-vous sûr de vouloir supprimer ce client ?</Text>
          <HStack justifyContent="flex-end" mt={3}>
            <Button size="sm" onClick={onClose} colorScheme="gray">
              Annuler
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={async () => {
                toast.close(toastId);
                try {
                  await window.electron.deleteUser(clientId);
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
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la suppression.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                }
              }}
            >
              Supprimer
            </Button>
          </HStack>
        </Box>
      ),
    });
  };
  
  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      
      const {id, isDeleted, createdAt, updatedAt, ...data} = updatedClient
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
        setNewClient({ name: '', surename: '', sphereL: '0', cylinderL: '0', axisL: '0', sphereR: '0', cylinderR: '0', axisR: '0' });
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
                      <Th>Sphère (D)</Th>
                      <Th>Cylindre (D)</Th>
                      <Th>Axe (D)</Th>
                      <Th>Sphère (G)</Th>
                      <Th>Cylindre (G)</Th>
                      <Th>Axe (G)</Th>
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
                          <Td>{client.sphereL}</Td>
                          <Td>{client.cylinderL}</Td>
                          <Td>{client.axisL}</Td>
                          <Td>{client.sphereR}</Td>
                          <Td>{client.cylinderR}</Td>
                          <Td>{client.axisR}</Td>
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


    <Drawer isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Ajouter un Nouveau Client</DrawerHeader>

        {/* This part becomes scrollable */}
        <DrawerBody>
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
              <FormLabel>Sphère (D)</FormLabel>
              <Input
                value={newClient.sphereR}
                onChange={(e) => setNewClient({ ...newClient, sphereR: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cylindre (D)</FormLabel>
              <Input
                value={newClient.cylinderR}
                onChange={(e) => setNewClient({ ...newClient, cylinderR: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Axe (D)</FormLabel>
              <Input
                value={newClient.axisR}
                onChange={(e) => setNewClient({ ...newClient, axisR: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Sphère (G)</FormLabel>
              <Input
                value={newClient.sphereL}
                onChange={(e) => setNewClient({ ...newClient, sphereL: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cylindre (G)</FormLabel>
              <Input
                value={newClient.cylinderL}
                onChange={(e) => setNewClient({ ...newClient, cylinderL: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Axe (G)</FormLabel>
              <Input
                value={newClient.axisL}
                onChange={(e) => setNewClient({ ...newClient, axisL: e.target.value })}
              />
            </FormControl>

          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <HStack spacing={4}>
            <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
              Annuler
            </Button>
            <Button colorScheme="green" onClick={handleAddClient}>
              Ajouter
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    <Drawer isOpen={isEditClientOpen} onClose={() => setIsEditClientOpen(false)}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          Modifier un Client
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} align="stretch">
            {clientToEdit && (
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
                  <FormLabel>Sphère (D)</FormLabel>
                  <Input
                    value={clientToEdit.sphereR}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, sphereR: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Cylindre (D)</FormLabel>
                  <Input
                    value={clientToEdit.cylinderR}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, cylinderR: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Axe (D)</FormLabel>
                  <Input
                    value={clientToEdit.axisR}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, axisR: e.target.value })}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Sphère (G)</FormLabel>
                  <Input
                    value={clientToEdit.sphereL}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, sphereL: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Cylindre (G)</FormLabel>
                  <Input
                    value={clientToEdit.cylinderL}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, cylinderL: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Axe (G)</FormLabel>
                  <Input
                    value={clientToEdit.axisL}
                    onChange={(e) => setClientToEdit({ ...clientToEdit, axisL: e.target.value })}
                  />
                </FormControl>

              </>
            )}
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <HStack spacing={4}>
            <Button onClick={() => setIsEditClientOpen(false)} variant="outline">
              Annuler
            </Button>
            <Button
              colorScheme="green"
              onClick={() => {
                if (clientToEdit) {
                  handleUpdateClient(clientToEdit);
                }
              }}
            >
              Mettre à jour
            </Button>

          </HStack>
        </DrawerFooter>
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
