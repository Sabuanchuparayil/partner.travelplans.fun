
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tag,
  IconButton,
  Avatar,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useData } from "../context/DataContext";
import { useState } from "react";
import { Customer } from "../types";

const CustomerManagement = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "green";
      case "Pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setCurrentCustomer(null);
    onOpen();
  };

  const handleEditClick = (customer: Customer) => {
    setIsEditing(true);
    setCurrentCustomer(customer);
    onOpen();
  };

  const handleDelete = (customerId: string) => {
    deleteCustomer(customerId);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const customerData = Object.fromEntries(formData.entries());

    if (isEditing && currentCustomer) {
      updateCustomer({ ...currentCustomer, ...customerData } as Customer);
    } else {
      addCustomer(customerData as Omit<Customer, 'id' | 'registrationDate' | 'bookingStatus' | 'documents'>);
    }
    onClose();
  };

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading as="h1" size="xl" fontWeight="bold">
          Customer Management
        </Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          variant="solid"
          size="lg"
          bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, blue.500, blue.600, blue.700)",
          }}
          onClick={handleAddClick}
        >
          Add New Customer
        </Button>
      </Flex>

      <Box bg="white" borderRadius="lg" boxShadow="md" p={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Date of Birth</Th>
              <Th>Booking Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers.map((customer) => (
              <Tr key={customer.id} _hover={{ bg: "gray.50" }}>
                <Td>
                  <HStack>
                    <Avatar size="sm" name={`${customer.firstName} ${customer.lastName}`} />
                    <Box>{`${customer.firstName} ${customer.lastName}`}</Box>
                  </HStack>
                </Td>
                <Td>{customer.email}</Td>
                <Td>{customer.dob}</Td>
                <Td>
                  <Tag colorScheme={getStatusColor(customer.bookingStatus)}>
                    {customer.bookingStatus}
                  </Tag>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    variant="ghost"
                    size="sm"
                    mr={2}
                    onClick={() => handleEditClick(customer)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(customer.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Customer" : "Add New Customer"}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSave}>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input name="firstName" defaultValue={currentCustomer?.firstName} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Last Name</FormLabel>
                <Input name="lastName" defaultValue={currentCustomer?.lastName} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Email</FormLabel>
                <Input name="email" type="email" defaultValue={currentCustomer?.email} />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Date of Birth</FormLabel>
                <Input name="dob" type="date" defaultValue={currentCustomer?.dob} />
              </FormControl>
              {isEditing && (
                <FormControl mt={4}>
                  <FormLabel>Booking Status</FormLabel>
                  <Select name="bookingStatus" defaultValue={currentCustomer?.bookingStatus}>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                  </Select>
                </FormControl>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CustomerManagement;
