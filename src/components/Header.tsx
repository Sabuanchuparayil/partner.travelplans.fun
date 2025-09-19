
import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Text,
} from "@chakra-ui/react";

const Header = () => {
  const handleProfile = () => {
    alert("Profile clicked");
  };

  const handleSettings = () => {
    alert("Settings clicked");
  };

  const handleLogout = () => {
    alert("Logout clicked");
  };

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={4}
      borderBottom="1px"
      borderColor="gray.200"
      bg="white"
    >
      <Box>
        <Text fontSize="lg">
          Welcome, <strong>Suresh Kumar</strong>
        </Text>
        <Tag size="sm" colorScheme="red" variant="soft">
          Admin
        </Tag>
      </Box>
      <Menu>
        <MenuButton
          as={Button}
          rounded="full"
          variant="link"
          cursor="pointer"
          minW={0}
        >
          <Avatar
            size="md"
            name="Suresh Kumar"
            src="https://bit.ly/suresh-kumar"
          />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleSettings}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Header;
