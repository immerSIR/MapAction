import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Button,
    Text,
    useColorMode,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Stack,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { IoLogOutOutline } from "react-icons/io5";
import { useMonth } from "Fonctions/Month";
import { useIncidentData } from "Fonctions/Dash_fonction";
import { useDisclosure } from "@chakra-ui/hooks";
import { useAuth } from "context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import { SearchBar } from "components/Navbars/SearchBar/SearchBar";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import { ItemContent } from "components/Menu/ItemContent";
import Select, { components } from "react-select"; // Ensure components is imported from react-select
import appLogoLight from "assets/img/logo.png";
import routes from "routes";
import { config } from "config";

const CustomOption = (props) => {
    return (
        <components.Option {...props}>
            <div>{props.data.label}</div>
        </components.Option>
    );
};

export default function HeaderLinks(props) {
    const {
        selectedMonth,
        handleMonthChange,
        selectedYear,
        yearsOptions,
        handleYearChange,
        ...rest // Include rest here
    } = useMonth();
    const { colorMode } = useColorMode();
    const [notifications, setNotifications] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedNotification, setSelectedNotification] = useState(null);
    const { monthsOptions } = useIncidentData();
    const [searchTerm, setSearchTerm] = useState("");
    const [allIncident, setAllIncident] = useState([]);

    let navbarIcon = useColorModeValue("gray.700", "gray.200");
    let menuBg = useColorModeValue("white", "navy.800");

    if (props.secondary) {
        navbarIcon = "white";
    }

    const searchIncidents = async (searchTerm) => {
        try {
            const response = await axios.get(`${config.url}/MapApi/Search/`, {
                params: { search_term: searchTerm },
                headers: {
                    Authorization: `Bearer ${sessionStorage.token}`,
                    "Content-Type": "application/json",
                },
            });
            setAllIncident(response.data);
        } catch (error) {
            console.error("Error searching incidents:", error);
        }
    };

    const handleSearch = async () => {
        searchIncidents(searchTerm);
    };

    const filteredIncident = allIncident.filter((incident) =>
        incident.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleClick = (notification) => {
        setSelectedNotification(notification);
        onOpen();
    };

    const handleAccept = () => {
        Swal.fire("Demande de collaboration acceptée");
        setNotifications(
            notifications.filter((n) => n !== selectedNotification)
        );
        onClose();
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(
                `${config.url}/MapApi/notifications/`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    useEffect(() => {
        fetchNotifications();
        searchIncidents(searchTerm);
    }, []);

    return (
        <Flex
            pe={{ sm: "0px", md: "16px" }}
            w={{ sm: "100%", md: "auto" }}
            alignItems="center"
            flexDirection="row"
        >
            <SearchBar
                me="18px"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
            />
            {searchTerm ? (
                filteredIncident.length > 0 ? (
                    filteredIncident.map((incident) => (
                        <Box key={incident.id} mb="2">
                            <Text fontWeight="bold" color="white">
                                {incident.title}
                            </Text>
                            <Text>{incident.description}</Text>
                        </Box>
                    ))
                ) : (
                    <Text>Aucun incident trouvé</Text>
                )
            ) : null}

            <SidebarResponsive
                hamburgerColor={"white"}
                logo={
                    <Stack
                        direction="row"
                        spacing="12px"
                        align="center"
                        justify="center"
                    >
                        <NavLink to="/admin/dashboard">
                            <Box
                                as="img"
                                src={appLogoLight}
                                alt="App Logo"
                                w="74px"
                                h="27px"
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
                    <BellIcon color={navbarIcon} w="18px" h="18px" ms="12px" />
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
                                    time={new Date(
                                        notification.created_at
                                    ).toLocaleString()}
                                    info={
                                        notification.message ||
                                        "Pas de message disponible"
                                    }
                                    boldInfo={
                                        notification.read ? "" : " Nouveau "
                                    }
                                    aName={
                                        typeof notification.user === "string"
                                            ? notification.user
                                            : "User"
                                    }
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
                                time={new Date(
                                    selectedNotification.created_at
                                ).toLocaleString()}
                                info={
                                    selectedNotification.message ||
                                    "Pas de message disponible"
                                }
                                boldInfo={
                                    selectedNotification.read ? "" : " Nouveau "
                                }
                                aName={
                                    typeof selectedNotification.user ===
                                    "string"
                                        ? selectedNotification.user
                                        : "User"
                                }
                                aSrc={selectedNotification.avatarSrc || ""}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={handleAccept}
                            >
                                Accepter
                            </Button>
                            <Button variant="ghost" onClick={onClose}>
                                Decliner
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

            <Select
                components={{ Option: CustomOption }}
                value={monthsOptions.find(
                    (option) => option.value === selectedMonth
                )}
                onChange={handleMonthChange}
                options={monthsOptions}
                styles={{
                    control: (provided) => ({
                        ...provided,
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        width: "200px",
                        height: "40px",
                        justifyContent: "space-around",
                        marginLeft: "16px",
                    }),
                }}
            />

            <Select
                components={{ Option: CustomOption }}
                value={yearsOptions.find(
                    (option) => option.value === selectedYear
                )}
                onChange={handleYearChange}
                options={yearsOptions}
                styles={{
                    control: (provided) => ({
                        ...provided,
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        width: "200px",
                        height: "40px",
                        justifyContent: "space-around",
                        marginLeft: "16px",
                    }),
                }}
            />

            <Flex me="16px" ms={{ base: "16px", xl: "20px" }}>
                <IoLogOutOutline
                    color={navbarIcon}
                    size={22}
                    onClick={handleLogout}
                    cursor="pointer"
                />
            </Flex>
        </Flex>
    );
}
