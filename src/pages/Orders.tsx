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
import { AiOutlineClose } from 'react-icons/ai';
import { FaBoxOpen, FaClipboardList } from 'react-icons/fa';
import { MdModeEditOutline, MdDelete } from 'react-icons/md';
import { Head, PreviewOptionsNavbar } from '@src/components';
import { BrandName } from '@src/constants';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useProducts } from '../hooks/useProducts';
import { Product, SubType, Type } from 'types/product.type';
import { Order } from 'types/order.type';
import ThemeToggle from "@src/components/ThemeToggle";
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

export default function OrderManagement() {
  // State for the order being edited
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const { isOpen, onClose, getButtonProps } = useDisclosure();
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState<Omit<Order, 'id'>>({
    userId: '',
    productId: '',
    framePrice: 0,
    productPrice: 0,
    deposit: 0,
    status: 'En attente',
    date: '',
    category: '0',
    sphereL: '0',
    cylinderL: '0',
    sphereR: '0',
    cylinderR: '0',
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
  const [_subtypeFilter, setSubtypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]); // List of products


  const toast = useToast();

  const { users, isLoading: isLoadingUsers } = useUsers();
  const { products, isLoading: isLoadingProducts } = useProducts();

  useEffect(() => {
    fetchOrders();
    fetchData();
  }, []);

  // Open edit order drawer
  const handleEditOrder = (order: Order) => {
    setOrderToEdit(order);
    setIsEditOrderOpen(true);
  };

  const fetchData = async () => {
    try {
      const typesResponse = await window.electron.getTypes({});
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
      console.log(fetchedOrders)
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
        description: 'Une erreur s\'est produite',
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
    const selectedType = types.find((type) => type.id === typeId);
    const selectedTypeName = selectedType?.name || '';
    console.log('selected type: ', selectedType)
    if (selectedTypeName === 'Verre Correcteur') {
      setNewOrder({ ...newOrder, category: 'spherique' });
    } else {
      setNewOrder({ ...newOrder, category: '' });
    }
  };
  
  const handleClearFilters = () => {
    setUserFilter('');
    setStatusFilter('');
    setDateFilter('');
    setSelectedType('');
    setSelectedSubtype('');
    setSubtypeFilter('');
    setFilteredSubtypes([]);
  };

  const handleSubtypeChange = (subtypeId: string) => {
    setSelectedSubtype(subtypeId);  // Set the selected subtype
    const product = allProducts.find(
      (product) => product.typeId === selectedType && product.subTypeId === subtypeId
    );
    console.log('selected product: ', product, subtypeId)
    if (product) {
      setNewOrder({ ...newOrder, productId: product.id });
    }
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      delete updatedOrder.createdAt;
      delete updatedOrder.updatedAt;
      delete updatedOrder.user;
      delete updatedOrder.product;
  
      const {id, ...data} = updatedOrder
      const response = await window.electron.updateOrder(id, data);
      console.log(response)
      if (response?.status) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
        toast({
          title: 'Commande mise à jour',
          description: 'Commande mise à jour avec succès.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setIsEditOrderOpen(false); // Fermer le tiroir
      } else {
        throw new Error('Échec de la mise à jour de la commande');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande :', error);
      toast({
        title: 'Erreur lors de la mise à jour de la commande',
        description: 'Une erreur s\'est produite',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const handleDeleteOrder = async (orderId: string) => {
    const toastId = toast({
      title: "Confirmation",
      description: "Êtes-vous sûr de vouloir supprimer cette commande ?",
      status: "warning",
      duration: null, // Laisse le toast ouvert jusqu'à une action
      isClosable: true,
      position: "top",
      render: ({ onClose }) => (
        <Box p={3} bg={useColorModeValue('gray.50', 'gray.900')} borderRadius="md" boxShadow="md">
          <Text fontWeight="bold">Confirmation</Text>
          <Text mt={2}>Êtes-vous sûr de vouloir supprimer cette commande ?</Text>
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
                  const response = await window.electron.deleteOrder(orderId);
  
                  if (response.status === false) {
                    toast({
                      title: "Erreur de suppression",
                      description: "Impossible de supprimer une commande complétée.",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                    return;
                  }
  
                  setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  
                  toast({
                    title: "Commande supprimée",
                    description: "La commande a été supprimée avec succès.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                } catch (error) {
                  console.error("Erreur lors de la suppression de la commande :", error);
                  toast({
                    title: "Erreur lors de la suppression",
                    description: "Une erreur est survenue lors de la suppression de la commande.",
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
  
  
  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentClients = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddOrder = async () => {
    console.log(newOrder)
    if (!newOrder.userId || !newOrder.productId) {
      toast({
        title: 'Invalid input',
        description: 'Veuillez sélectionner un utilisateur et un produit..',
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
    const status = rest === 0 ? 'Complétée' : 'En attente';
    const date = new Date();
  
    // Update the new order with the calculated status
    const updatedOrder = { ...newOrder, status, date };
  
    console.log(updatedOrder)
    try {
      console.log('Sending order data:', updatedOrder);
      const response = await window.electron.createOrder(updatedOrder);
      console.log('Received response:', response);
  
      if (response?.status === false) {
        // Handle insufficient stock
        toast({
          title: 'Insufficient Stock',
          description: `Seulement ${response.data.quantity} articles disponibles en stock.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return; // Exit the function to prevent further processing
      }
  
      if (response && response.data) {
        console.log('order added heeeeeeeeeeeeeeeeeee')
        // Order created successfully
        setOrders((prevOrders) => [...prevOrders, response.data]);
        setSelectedType('')
        setSelectedSubtype('')
        setNewOrder({
          userId: '',
          productId: '',
          framePrice: 0,
          productPrice: 0,
          deposit: 0,
          status: 'En attente',
          date: '',
          category: '0',
          sphereL: '0',
          cylinderL: '0',
          sphereR: '0',
          cylinderR: '0',
        });
        setIsAddOrderOpen(false);
        toast({
          title: 'Order added',
          description: `Commande ajoutée avec success.`,
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
        description: 'Une erreur s\'est produite',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
    
  return (
    <>
      <Head>
        <title>Gestion des Commandes</title>
      </Head>
      <PreviewOptionsNavbar />
      <Flex as="nav" alignItems="center" justifyContent="space-between" h="16" py="2.5" pr="2.5">
        <HStack spacing={2}>
          <IconButton {...getButtonProps()} fontSize="18px" variant="ghost" icon={<BiMenu />} aria-label="open menu" />
          <Heading as="h1" size="md">
            Gestion des Commandes
          </Heading>
        </HStack>
        <Flex justifyContent="flex-end" gap={2}>
            <ThemeToggle />
            <Button
                leftIcon={<BiPlus />}
                colorScheme="green"
                onClick={() => setIsAddOrderOpen(true)}
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
                placeholder="Filtrer par utilisateur"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
              <Input
                  type="date"
                  placeholder="Filter par date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              <Select
                placeholder="Filter par statut"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Complétée">Complétée</option>
                <option value="Annulée">Annulée</option>
                <option value="En attente">En attente</option>
              </Select>
              <Button
              onClick={handleClearFilters}
              aria-label="Clear all filters"
            >
              <LuFilterX style={{ fontSize: '53px' }} />

            </Button>
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
              <Table fontSize={'sm'}>
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
                  <Th>Statut</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentClients.length === 0 ? (
                  <Tr>
                    <Td colSpan={12} textAlign="center">Aucune commande trouvée</Td>
                  </Tr>
                ) : (
                  currentClients.map((order) => {
                    const user = users.find((u) => u.id === order.userId);
                    const product = products.find((p) => p.id === order.productId);
                    const total = order.framePrice + order.productPrice;
                    const rest = total - order.deposit;
                    const isCompleted = order.status === "Complétée" || order.status === "Annulée";

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
                        <Td>
                          <HStack spacing={2}>
                          <IconButton
                            aria-label="Edit Order"
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
                            onClick={() => handleEditOrder(order)}
                            isDisabled={isCompleted}
                          />
                          <IconButton
                            aria-label="Delete Order"
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
                            onClick={() => handleDeleteOrder(order.id)}
                            isDisabled={isCompleted}
                          />
                          </HStack>
                        </Td>
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
                    <Text>Article par page:</Text>
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
        <DrawerContent maxHeight="100vh" overflowY="auto">
          <Box p="4">
            <Heading as="h3" size="md">
              Ajouter une commande
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Utilisateur</FormLabel>
                <Select
                  placeholder="Select user"
                  value={newOrder.userId}
                  onChange={(e) => setNewOrder({ ...newOrder, userId: e.target.value })}
                >
                  {users
                  .filter(user => user.isDeleted===false)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {`${user.name} ${user.surename}`}
                    </option>
                  ))}
                </Select>
              </FormControl>

                <FormControl isRequired>
                  <FormLabel>Type produit</FormLabel>
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
              <FormLabel>Sous Type Produit</FormLabel>
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
                <FormLabel>Prix monture</FormLabel>
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
                <FormLabel>Prix produit</FormLabel>
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
                <FormLabel>Versement</FormLabel>
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

              {/* Show these fields only when the selected type is "Verre Correcteur" */}
              {selectedType && types.find((type) => type.id === selectedType)?.name === 'Verre Correcteur' && (
                <>
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={newOrder.category}
                      onChange={(e) => setNewOrder({ ...newOrder, category: e.target.value })}
                      isDisabled={!selectedType}
                    >
                      <option value="spherique">Sphérique</option>
                      <option value="torique">Torique</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sphère (D)</FormLabel>
                    <Input
                      value={newOrder.sphereR}
                      onChange={(e) => setNewOrder({ ...newOrder, sphereR: e.target.value })}
                      isDisabled={!selectedType}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Cylindre (D)</FormLabel>
                    <Input
                      value={newOrder.cylinderR}
                      onChange={(e) => setNewOrder({ ...newOrder, cylinderR: e.target.value })}
                      isDisabled={!selectedType}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Sphère (G)</FormLabel>
                    <Input
                      value={newOrder.sphereL}
                      onChange={(e) => setNewOrder({ ...newOrder, sphereL: e.target.value })}
                      isDisabled={!selectedType}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Cylindre (G)</FormLabel>
                    <Input
                      value={newOrder.cylinderL}
                      onChange={(e) => setNewOrder({ ...newOrder, cylinderL: e.target.value })}
                      isDisabled={!selectedType}
                    />
                  </FormControl>
                </>
              )}
              
              <HStack spacing={4} mt={4}>
                <Button onClick={() => setIsAddOrderOpen(false)} variant="outline">
                  Annuler
                </Button>
                <Button colorScheme="green" onClick={handleAddOrder}>
                  Ajouter
                </Button>
              </HStack>
            </VStack>
          </Box>
        </DrawerContent>
      </Drawer>

      {/*update order*/}
      <Drawer isOpen={isEditOrderOpen} onClose={() => setIsEditOrderOpen(false)}>
        <DrawerContent>
          <Box p="4">
            <Heading as="h3" size="md">
              Modifier une commande
            </Heading>
            <VStack spacing={4} align="stretch">
              {orderToEdit && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Utilisateur</FormLabel>
                    <Select
                      placeholder="Select user"
                      value={orderToEdit.userId}
                      onChange={(e) =>
                        setOrderToEdit({ ...orderToEdit, userId: e.target.value })
                      }
                    >
                      {users
                      .filter(user => user.isDeleted === false || user.id === orderToEdit.userId)
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {`${user.name} ${user.surename}`}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Prix Monture</FormLabel>
                    <NumberInput
                      value={orderToEdit.framePrice}
                      onChange={(valueString) =>
                        setOrderToEdit({
                          ...orderToEdit,
                          framePrice: parseFloat(valueString),
                        })
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Prix Produit</FormLabel>
                    <NumberInput
                      value={orderToEdit.productPrice}
                      onChange={(valueString) =>
                        setOrderToEdit({
                          ...orderToEdit,
                          productPrice: parseFloat(valueString),
                        })
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Versement</FormLabel>
                    <NumberInput
                      value={orderToEdit.deposit}
                      onChange={(valueString) =>
                        setOrderToEdit({
                          ...orderToEdit,
                          deposit: parseFloat(valueString),
                        })
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Statut</FormLabel>
                    <Select
                      value={orderToEdit.status}
                      onChange={(e) =>
                        setOrderToEdit({ ...orderToEdit, status: e.target.value })
                      }
                    >
                      <option value="Complétée">Complétée</option>
                      <option value="En attente">En attente</option>
                      <option value="Annulée">Annulée</option>
                    </Select>
                  </FormControl>

                <HStack spacing={4} mt={4}>
                  <Button onClick={() => setIsEditOrderOpen(false)} variant="outline">
                    Annuler
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={() => handleUpdateOrder(orderToEdit)}
                  >
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
