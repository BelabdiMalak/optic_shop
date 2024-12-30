import { Box, Button, FormControl, FormLabel, Input, Select, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';

interface AddProductFormProps {
  onSubmit: (product: { name: string; type: string; subtype: string; stockQuantity: number }) => void;
  onCancel: () => void;
}

export default function AddProductForm({ onSubmit, onCancel }: AddProductFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [subtype, setSubtype] = useState('');
  const [stockQuantity, setStockQuantity] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, type, subtype, stockQuantity });
  };

  const buttonColorScheme = useColorModeValue('blue', 'teal');

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%" maxWidth="500px" margin="auto">
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Type</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Glasses">Glasses</option>
            <option value="Sunglasses">Sunglasses</option>
            <option value="Lenses">Lenses</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Subtype</FormLabel>
          <Select value={subtype} onChange={(e) => setSubtype(e.target.value)}>
            <option value="HMC">HMC</option>
            <option value="TP">TP</option>
            <option value="Green">Green</option>
            <option value="Blue">Blue</option>
            <option value="Spice">Spice</option>
            <option value="Perla">Perla</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Stock Quantity</FormLabel>
          <Input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} />
        </FormControl>
        <HStack spacing={4} justify="flex-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" colorScheme={buttonColorScheme}>
            Add Product
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
