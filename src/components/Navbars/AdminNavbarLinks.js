// // Chakra Icons
// import { BellIcon } from "@chakra-ui/icons";
// // Chakra Imports
// import {
//   Box,
//   Button,
//   Flex,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuList,
//   Stack,
//   Text,
//   useColorMode,
//   useColorModeValue,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
// } from "@chakra-ui/react";
// // Assets
// import avatar1 from "assets/img/avatars/avatar1.png";
// import avatar2 from "assets/img/avatars/avatar2.png";
// import avatar3 from "assets/img/avatars/avatar3.png";
// // Custom Icons
// import { ArgonLogoDark, ArgonLogoLight, ChakraLogoDark, ChakraLogoLight, ProfileIcon, SettingsIcon } from "components/Icons/Icons";
// import appLogoLight from "../../assets/img/logo.png"; 
// // Custom Components
// import { ItemContent } from "components/Menu/ItemContent";
// import { SearchBar } from "components/Navbars/SearchBar/SearchBar";
// import { SidebarResponsive } from "components/Sidebar/Sidebar";
// import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
// import routes from "routes.js";
// // axios
// import axios from "axios";
// import { config } from "config";
// import { useAuth } from "context/AuthContext";
// import Swal from "sweetalert2";

// export default function HeaderLinks(props) {
//   const {
//     variant,
//     children,
//     fixed,
//     scrolled,
//     secondary,
//     onOpen : onOpenProp,
//     ...rest
//   } = props;

//   const { colorMode } = useColorMode();
//   const [notifications, setNotifications] = useState([]);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [selectedNotification, setSelectedNotification] = useState(null);

//   const handleClick = (notification) => {
//     setSelectedNotification(notification);
//     onOpen();
//   };

//   const handleAccept = () => {
//     Swal.fire("Demande de collaboration acceptée");
//     console.log("Demande de collaboration acceptée");
//     setNotifications(notifications.filter(n => n !== selectedNotification));
//     onClose();
//   };

//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get(`${config.url}/MapApi/notifications/`, {
//         headers: {
//           Authorization: `Bearer ${sessionStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       console.log('Notifications response:', response.data);
//       setNotifications(response.data);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   const { logout } = useAuth();
//   const handleLogout = () => {
//     logout();
//     window.location.href = "/";
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   // Chakra Color Mode
//   let navbarIcon =
//     fixed && scrolled
//       ? useColorModeValue("gray.700", "gray.200")
//       : useColorModeValue("white", "gray.200");
//   let menuBg = useColorModeValue("white", "navy.800");
//   if (secondary) {
//     navbarIcon = "white";
//   }

//   return (
//     <Flex
//       pe={{ sm: "0px", md: "16px" }}
//       w={{ sm: "100%", md: "auto" }}
//       alignItems='center'
//       flexDirection='row'>
//       <SearchBar me='18px' />
//       <SidebarResponsive
//         hamburgerColor={"white"}
//         logo={
//           <Stack direction='row' spacing='12px' align='center' justify='center'>
//             <Box
//               as='img'
//               src={appLogoLight}
//               alt='App Logo'
//               w='74px'
//               h='27px'
//             />
//           </Stack>
//         }
//         colorMode={colorMode}
//         secondary={props.secondary}
//         routes={routes}
//         {...rest}
//       />
//       <SettingsIcon
//         cursor='pointer'
//         ms={{ base: "16px", xl: "0px" }}
//         me='16px'
//         onClick={handleLogout}
//         color={navbarIcon}
//         w='18px'
//         h='18px'
//       />
//       <Menu>
//         <MenuButton>
//           <BellIcon color={navbarIcon} w='18px' h='18px' />
//         </MenuButton>
//         <MenuList p="16px 8px" bg={menuBg}>
//           <Flex flexDirection="column">
//             {notifications.map((notification, index) => (
//               <MenuItem
//                 borderRadius="8px"
//                 mb="10px"
//                 key={index}
//                 onClick={() => handleClick(notification)}
//               >
//                 <ItemContent
//                   time={new Date(notification.created_at).toLocaleString()}
//                   info={notification.message || "No message available"}
//                   boldInfo={notification.read ? "" : "New "}
//                   aName={typeof notification.user === 'string' ? notification.user : "User"}
//                   aSrc={notification.avatarSrc || ""}
//                 />
//               </MenuItem>
//             ))}
//           </Flex>
//         </MenuList>
//       </Menu>
//       {selectedNotification && (
//         <Modal isOpen={isOpen} onClose={onClose}>
//           <ModalOverlay />
//           <ModalContent>
//             <ModalHeader>Notification</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               <ItemContent
//                 time={new Date(selectedNotification.created_at).toLocaleString()}
//                 info={selectedNotification.message || "No message available"}
//                 boldInfo={selectedNotification.read ? "" : "New "}
//                 aName={typeof selectedNotification.user === 'string' ? selectedNotification.user : "User"}
//                 aSrc={selectedNotification.avatarSrc || ""}
//               />
//             </ModalBody>
//             <ModalFooter>
//               <Button colorScheme="blue" mr={3} onClick={handleAccept}>
//                 Accepter
//               </Button>
//               <Button variant="ghost" onClick={onClose}>Decliner</Button>
//             </ModalFooter>
//           </ModalContent>
//         </Modal>
//       )}
//     </Flex>
//   );
// }

// Ajoutez cette importation en haut de votre fichier
// import Select from "react-select";

// Chakra Icons
import { BellIcon } from "@chakra-ui/icons";
// Chakra Imports
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
// Assets
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
// Custom Icons
import { ArgonLogoDark, ArgonLogoLight, ChakraLogoDark, ChakraLogoLight, ProfileIcon, SettingsIcon } from "components/Icons/Icons";
import appLogoLight from "../../assets/img/logo.png"; 
// Custom Components
import { ItemContent } from "components/Menu/ItemContent";
import { SearchBar } from "components/Navbars/SearchBar/SearchBar";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import routes from "routes.js";
// axios
import axios from "axios";
import { config } from "config";
import { useAuth } from "context/AuthContext";
import Swal from "sweetalert2";

import { components } from 'react-select';
import Select from 'react-select';
import { useIncidentData } from "Fonctions/Dash_fonction";

// CustomOption Component
const CustomOption = (props) => {
  return (
    <components.Option {...props}>
      <div>
        {props.data.label}
      </div>
    </components.Option>
  );
};
export default function HeaderLinks(props) {
  const {
    variant,
    children,
    fixed,
    scrolled,
    secondary,
    onOpen : onOpenProp,
    ...rest
  } = props;

  const { colorMode } = useColorMode();
  const [notifications, setNotifications] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const {
    selectedMonth,
    setSelectedMonth,
    handleMonthChange,
    monthsOptions
} = useIncidentData();

  const handleClick = (notification) => {
    setSelectedNotification(notification);
    onOpen();
  };

  const handleAccept = () => {
    Swal.fire("Demande de collaboration acceptée");
    console.log("Demande de collaboration acceptée");
    setNotifications(notifications.filter(n => n !== selectedNotification));
    onClose();
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${config.url}/MapApi/notifications/`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Notifications response:', response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Chakra Color Mode
  let navbarIcon =
    fixed && scrolled
      ? useColorModeValue("gray.700", "gray.200")
      : useColorModeValue("white", "gray.200");
  let menuBg = useColorModeValue("white", "navy.800");
  if (secondary) {
    navbarIcon = "white";
  }

  

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems='center'
      flexDirection='row'>
      <SearchBar me='18px' />
      <SidebarResponsive
        hamburgerColor={"white"}
        logo={
          <Stack direction='row' spacing='12px' align='center' justify='center'>
            <Box
              as='img'
              src={appLogoLight}
              alt='App Logo'
              w='74px'
              h='27px'
            />
          </Stack>
        }
        colorMode={colorMode}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />
      <SettingsIcon
        cursor='pointer'
        ms={{ base: "16px", xl: "0px" }}
        me='16px'
        onClick={handleLogout}
        color={navbarIcon}
        w='18px'
        h='18px'
      />
      <Menu>
        <MenuButton>
          <BellIcon color={navbarIcon} w='18px' h='18px' />
        </MenuButton>
        <MenuList p="16px 8px" bg={menuBg}>
          <Flex flexDirection="column">
            {notifications.map((notification, index) => (
              <MenuItem
                borderRadius="8px"
                mb="10px"
                key={index}
                onClick={() => handleClick(notification)}
              >
                <ItemContent
                  time={new Date(notification.created_at).toLocaleString()}
                  info={notification.message || "No message available"}
                  boldInfo={notification.read ? "" : "New "}
                  aName={typeof notification.user === 'string' ? notification.user : "User"}
                  aSrc={notification.avatarSrc || ""}
                />
              </MenuItem>
            ))}
          </Flex>
        </MenuList>
      </Menu>
      {selectedNotification && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Notification</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ItemContent
                time={new Date(selectedNotification.created_at).toLocaleString()}
                info={selectedNotification.message || "No message available"}
                boldInfo={selectedNotification.read ? "" : "New "}
                aName={typeof selectedNotification.user === 'string' ? selectedNotification.user : "User"}
                aSrc={selectedNotification.avatarSrc || ""}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAccept}>
                Accepter
              </Button>
              <Button variant="ghost" onClick={onClose}>Decliner</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Select
        components={{ CustomOption }}
        value={monthsOptions.find(option => option.value === selectedMonth)}
        onChange={handleMonthChange}
        options={monthsOptions}
        styles={{
          control: (provided, state) => ({
            ...provided,
            border: '1px solid #ccc',
            borderRadius: '10px',
            width: '200px',
            height: '40px',
            justifyContent: 'space-around',
            marginLeft: '16px',
            marginRight: '-35px',
            // marginBottom: '16px'
          }),
          indicatorSeparator: (provided, state) => ({
            ...provided,
            display: 'none'
          }),
        }}
      />
    </Flex>
  );
}
