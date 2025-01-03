import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'

interface AddClientFormProps {
  onSubmit: (client: { name: string; surename: string; sphere: string; cylinder: string; axis: string }) => void
  onCancel: () => void
}

export default function AddClientForm({ onSubmit, onCancel }: AddClientFormProps) {
  const [name, setName] = useState('')
  const [surename, setSurename] = useState('')
  const [sphere, setSphere] = useState('')
  const [cylinder, setCylinder] = useState('')
  const [axis, setAxis] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, surename, sphere, cylinder, axis })
  }

  const buttonColorScheme = useColorModeValue('blue', 'teal')

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%" maxWidth="500px" margin="auto">
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Surname</FormLabel>
          <Input value={surename} onChange={(e) => setSurename(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Sphere</FormLabel>
          <Input value={sphere} onChange={(e) => setSphere(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Cylinder</FormLabel>
          <Input value={cylinder} onChange={(e) => setCylinder(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Axis</FormLabel>
          <Input value={axis} onChange={(e) => setAxis(e.target.value)} />
        </FormControl>
        <HStack spacing={4} justify="flex-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" colorScheme={buttonColorScheme}>
            Add Client
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
