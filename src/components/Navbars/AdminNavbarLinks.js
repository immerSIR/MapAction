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
  Select
} from "@chakra-ui/react";
import { useMonth,  } from "Fonctions/Month";
// Custom Icons
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
import { IoLogOutOutline } from "react-icons/io5";
import { components } from 'react-select';
// import Select from 'react-select';
import { useIncidentData } from "Fonctions/Dash_fonction";
import  { DateRange } from 'react-date-range';
import { fr } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useDateFilter } from "Fonctions/YearMonth";

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
  // const [showDatePicker, setShowDatePicker] = useState(false);
  const { filterType, customRange, handleFilterChange,handleDateChange, applyCustomRange, showDatePicker } = useDateFilter();
  const { selectedMonth, handleMonthChange, selectedYear, yearsOptions, handleYearChange } = useMonth();
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
    monthsOptions
  } = useIncidentData();
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allIncident, setAllIncident] = useState([]);

  const searchIncidents = async (searchTerm) => {
    try {
      const response = await axios.get(`${config.url}/MapApi/Search/`, {
        params: { search_term: searchTerm },
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data)
      setAllIncident(response.data);
    } catch (error) {
      console.error('Error searching incidents:', error);
      return [];
    }
  };
  
  const handleSearch = async () => {
    const results = await searchIncidents(searchTerm);
    setSearchResults(results);
  };

  const filteredIncident = allIncident.filter(incident=> {
    return incident.title.toLowerCase().includes(searchTerm.toLowerCase())
  })
  
  const handleClick = (notification) => {
    setSelectedNotification(notification);
    onOpen();
  };

  const handleAccept = () => {
    Swal.fire("Demande de collaboration acceptée");
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
      // console.log('Notifications response:', response.data);
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
    searchIncidents(searchTerm)
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
      <SearchBar
        me='18px'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
      />
        {searchTerm ? (
          filteredIncident.length > 0 ? (
            filteredIncident.map((incident) => (
              <Box key={incident.id} mb="2">
                <Text fontWeight="bold" color="white">{incident.title}</Text>
                <Text>{incident.description}</Text>
              </Box>
            ))
          ) : (
            <Text>Aucun incident trouvé</Text>
          )
        ) : null }
      <SidebarResponsive
        hamburgerColor={"white"}
        logo={
          <Stack direction='row' spacing='12px' align='center' justify='center'>
            <NavLink to="/admin/dashboard"> 
              <Box
                as='img'
                src={appLogoLight}
                alt='App Logo'
                w='74px'
                h='27px'
                cursor="pointer"
              />
            </NavLink>
          </Stack>
        }
        colorMode={colorMode}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />
      
      <Menu>
        <MenuButton>
          <BellIcon color={navbarIcon} w='18px' h='18px' ms="12px"/>
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
                  info={notification.message || "Pas de message disponible"}
                  boldInfo={notification.read ? "" : " Nouveau "}
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
                info={selectedNotification.message || "Pas de message disponible"}
                boldInfo={selectedNotification.read ? "" : " Nouveau "}
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
      {/* <Select
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
          }),
          indicatorSeparator: (provided, state) => ({
            ...provided,
            display: 'none'
          }),
        }}
      /> */}
      <Select
          value={filterType}
          onChange={(e) => handleFilterChange(e.target.value)} 
        >
          <option value="today">Aujourd'hui</option>
          <option value="yesterday">Hier</option>
          <option value="last_7_days">Les 7 derniers jours</option>
          <option value="last_30_days">Les 30 derniers jours</option>
          <option value="this_month">Ce mois</option>
          <option value="last_month">Le mois dernier</option>
          <option value="custom_range">Choix personnalisé</option>
        </Select>
        {filterType === 'custom_range' && showDatePicker && customRange.length > 0 && (
          <Flex ml={4} alignItems="center">
            <DateRange
              ranges={customRange}
              onChange={handleDateChange}
              locale={fr}
            />
            <Button ml={4} colorScheme="blue" onClick={applyCustomRange}>
              Appliquer
            </Button>
          </Flex>
        )}

      
      <Flex me='16px' ms={{ base: "16px", xl: "20px" }}>
        <IoLogOutOutline
          color={navbarIcon}
          size={22}
          onClick={handleLogout}
          cursor='pointer'
        />
      </Flex>
      
    </Flex>
  );
}
