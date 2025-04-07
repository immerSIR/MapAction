// // Chakra Imports
// import {
//     Box,
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     Flex,
//     Link,
//     useColorModeValue,
// } from "@chakra-ui/react";
// import React, { useEffect, useState } from "react";
// import AdminNavbarLinks from "./AdminNavbarLinks";
// import { useHistory } from "react-router-dom";

// Chakra Imports
import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Flex,
    Link,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AdminNavbarLinks from "./AdminNavbarLinks";
import { useHistory } from "react-router-dom";

export default function AdminNavbar(props) {
    const [scrolled, setScrolled] = useState(false);
    const history = useHistory();
    const [previousPage, setPreviousPage] = useState("");

    useEffect(() => {
        const unlisten = history.listen((location, action) => {
            if (action === "PUSH") {
                setPreviousPage(history.location.pathname);
            }
        });
        return () => {
            unlisten();
        };
    }, [history]);

    useEffect(() => {
        window.addEventListener("scroll", changeNavbar);

        return () => {
            window.removeEventListener("scroll", changeNavbar);
        };
    });

    const changeNavbar = () => {
        if (window.scrollY > 1) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    const {
        variant,
        children,
        fixed,
        secondary,
        brandText,
        onOpen,
        ...rest
    } = props;

    // Move all useColorModeValue hooks here, so they are not called conditionally
    const mainTextColorFixedScrolled = useColorModeValue(
        "gray.700",
        "gray.200"
    );
    const mainTextColorDefault = useColorModeValue("white", "gray.200");

    const secondaryTextColorFixedScrolled = useColorModeValue(
        "gray.700",
        "gray.200"
    );
    const secondaryTextColorDefault = useColorModeValue("white", "gray.200");

    const navbarShadowValue = useColorModeValue(
        "0px 7px 23px rgba(0, 0, 0, 0.05)",
        "none"
    );
    const navbarBgValue = useColorModeValue(
        "linear-gradient(112.83deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)",
        "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
    );
    const navbarBorderValue = useColorModeValue(
        "#FFFFFF",
        "rgba(255, 255, 255, 0.31)"
    );
    const navbarFilterValue = useColorModeValue(
        "none",
        "drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))"
    );

    let mainText =
        fixed && scrolled ? mainTextColorFixedScrolled : mainTextColorDefault;
    let secondaryText =
        fixed && scrolled
            ? secondaryTextColorFixedScrolled
            : secondaryTextColorDefault;
    let navbarPosition = "absolute";
    let navbarFilter = "none";
    let navbarBackdrop = "none";
    let navbarShadow = "none";
    let navbarBg = "none";
    let navbarBorder = "transparent";
    let secondaryMargin = "0px";
    let paddingX = "15px";

    if (props.fixed === true && scrolled === true) {
        navbarPosition = "fixed";
        navbarShadow = navbarShadowValue;
        navbarBg = navbarBgValue;
        navbarBorder = navbarBorderValue;
        navbarFilter = navbarFilterValue;
    }

    if (props.secondary) {
        navbarBackdrop = "none";
        navbarPosition = "absolute";
        mainText = "white";
        secondaryText = "white";
        secondaryMargin = "22px";
        paddingX = "30px";
    }

    return (
        <Flex
            position={navbarPosition}
            boxShadow={navbarShadow}
            bg={navbarBg}
            borderColor={navbarBorder}
            filter={navbarFilter}
            backdropFilter={navbarBackdrop}
            borderWidth="1.5px"
            borderStyle="solid"
            transitionDelay="0s, 0s, 0s, 0s"
            transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
            transitionProperty="box-shadow, background-color, filter, border"
            transitionTimingFunction="linear, linear, linear, linear"
            alignItems={{ xl: "center" }}
            borderRadius="16px"
            display="flex"
            minH="75px"
            justifyContent={{ xl: "center" }}
            lineHeight="25.6px"
            mx="auto"
            mt={secondaryMargin}
            pb="8px"
            left={document.documentElement.dir === "rtl" ? "30px" : ""}
            right={document.documentElement.dir === "rtl" ? "" : "30px"}
            px={{
                sm: paddingX,
                md: "30px",
            }}
            ps={{
                xl: "12px",
            }}
            pt="8px"
            top="18px"
            w={{ sm: "calc(100vw - 30px)", xl: "calc(100vw - 75px - 275px)" }}
        >
            <Flex
                w="100%"
                flexDirection={{
                    sm: "column",
                    md: "row",
                }}
                alignItems={{ xl: "center" }}
            >
                <Box mb={{ sm: "8px", md: "0px" }}>
                    <Breadcrumb>
                        <BreadcrumbItem color={mainText}>
                            <BreadcrumbLink
                                onClick={(e) => {
                                    e.preventDefault();
                                    history.goBack();
                                }}
                                color={secondaryText}
                            >
                                Page précédente
                            </BreadcrumbLink>

                        </BreadcrumbItem>

                        <BreadcrumbItem color={mainText}>
                            <BreadcrumbLink href="#" color={mainText}>
                                {brandText}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Link
                        color={mainText}
                        href="#"
                        bg="inherit"
                        borderRadius="inherit"
                        fontWeight="bold"
                        _hover={{ color: { mainText } }}
                        _active={{
                            bg: "inherit",
                            transform: "none",
                            borderColor: "transparent",
                        }}
                        _focus={{
                            boxShadow: "none",
                        }}
                    >
                        {brandText}
                    </Link>
                </Box>
                <Box ms="auto" w={{ sm: "100%", md: "unset" }}>
                    <AdminNavbarLinks
                        onOpen={props.onOpen}
                        logoText={props.logoText}
                        secondary={props.secondary}
                        fixed={props.fixed}
                        scrolled={scrolled}
                    />
                </Box>
            </Flex>
        </Flex>
    );
}
