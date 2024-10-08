import React, { useState, useEffect } from "react";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Table,
  Tbody,
  Td,
  // Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import ZoneChart from "components/Charts/Chart_zone";
import IconBox from "components/Icons/IconBox";
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "components/Icons/Icons.js";
import { RiMessage2Fill } from "react-icons/ri";
import { IoStatsChart } from "react-icons/io5";

import Carte from "variables/maps";
import { useMonth } from "Fonctions/Month";

// Fonctions
import { useIncidentData } from "Fonctions/Dash_fonction";

const positions = [16.2833, -3.0833]



export default function Dashboard() {
  const organisation = sessionStorage.getItem("organisation")
  const [percentageAnonymous, setAnonymousPercentage] = useState(0);
  const { selectedMonth } = useMonth();
  const {
    onShowIncident,
    // selectedMonth,
    // setSelectedMonth,
    anonymousPercentage,
    registeredPercentage,
    _getActions,
    countActions,
    percentageVs,
    percentageVsTaken,
    percentageVsResolved,
    taken,
    incidents,
    setCountIncidents,
    setResolus,
    setRegisteredPercentage,
    setPercentageVs,
    setPercentageVsResolved,
    countIncidents,
    resolus,
    categoryData,
    zoneData,
    showOnlyTakenIntoAccount,
    setShowOnlyTakenIntoAccount,
    showOnlyResolved,
    setShowOnlyResolved,
    showOnlyDeclared,
    setShowOnlyDeclared,
    handleMonthChange,
    _getAnonymous,
    _getRegistered,
    _getIndicateur,
    _getPercentage,
    _getPercentageVsPreviousMonth,
    _getPercentageVsTaken,
    _getPercentageVsResolved,
    _getIncidents,
    _getIncidentsResolved,
    _getCategory,
    _getZone,
    filterIncidents,
    displayIcon,
    chartRef,
    IndicateurChart,
    preduct,
    TakenOnMap,
    DeclaredOnMap,
    ResolvedOnMap,
    PercentageIncrease
} = useIncidentData();

  // Chakra Color Mode
  const iconBlue = useColorModeValue("blue.500", "blue.500");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textTableColor = useColorModeValue("gray.500", "white");

  const { colorMode } = useColorMode();

  useEffect(() => {
    // Appel des fonctions pour récupérer les données
    async function fetchData() {
      const incidents = await _getIncidents();
      const incidentsResolved = await _getIncidentsResolved();
      const anonymous = await _getAnonymous();
      const registered = await _getRegistered();
      const percentage = await _getPercentage();
      const percentageVs = await _getPercentageVsPreviousMonth();
      const percentageResolved = await _getPercentageVsResolved();
      await _getPercentageVsTaken()
      await _getCategory()
      await _getActions()
    }

    fetchData();
  }, [selectedMonth]);

  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px' mb='20px'>
        <Card minH='125px'>
          <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'
              mb='25px'>
              <Stat me='auto'>
                <StatLabel
                  fontSize='xs'
                  color='gray.400'
                  fontWeight='bold'
                  textTransform='uppercase'>
                  Nombre d'incidents
                </StatLabel>
                <Flex>
                  <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                    {countIncidents}
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                >
                <IoStatsChart color="orange" size={40} /> 
              </IconBox>
            </Flex>
            <Text color='gray.400' fontSize='sm'>
              <Text as='span' color='green.400' fontWeight='bold'>
                {percentageVs}%{" "}
              </Text>
              Depuis le mois dernier
            </Text>
          </Flex>
        </Card>
        <Card minH='125px' cursor='pointer' onClick={() => TakenOnMap(setShowOnlyTakenIntoAccount, setShowOnlyResolved, setShowOnlyDeclared)}>
          <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'
              mb='25px'>
              <Stat me='auto'>
                <StatLabel
                  fontSize='xs'
                  color='gray.400'
                  fontWeight='bold'
                  textTransform='uppercase'>
                  Pourcentage pris en compte
                </StatLabel>
                <Flex>
                  <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                    {taken}%
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                >
                <IoStatsChart color="#cd49d1" size={40}/> 
              </IconBox>
            </Flex>
            <Text color='gray.400' fontSize='sm'>
              <Text as='span' color='green.400' fontWeight='bold'>
                {percentageVsTaken}%{" "}
              </Text>
              Depuis le mois dernier
            </Text>
          </Flex>
        </Card>
        <Card minH='125px' cursor='pointer' onClick={ResolvedOnMap}>
          <Flex direction='column'>
            <Flex
              flexDirection='row'
              align='center'
              justify='center'
              w='100%'
              mb='25px'>
              <Stat me='auto'>
                <StatLabel
                  fontSize='xs'
                  color='gray.400'
                  fontWeight='bold'
                  textTransform='uppercase'>
                  Pourcentage résolu
                </StatLabel>
                <Flex>
                  <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                    {resolus}%
                  </StatNumber>
                </Flex>
              </Stat>
              <IconBox
                >
                <IoStatsChart color="#4babeb" size={40}/> 
              </IconBox>
            </Flex>
            <Text color='gray.400' fontSize='sm'>
              <Text as='span' color='red.500' fontWeight='bold'>
              {percentageVsResolved}%{" "}
              </Text>
              Depuis le mois dernier
            </Text>
          </Flex>
        </Card>
        <Box onClick={TakenOnMap} cursor='pointer' minH='125px'>
          <Card>
            <Flex direction='column'>
              <Flex
                flexDirection='row'
                align='center'
                justify='center'
                w='100%'
                mb='25px'>
                <Stat me='auto'>
                  <StatLabel
                    fontSize='xs'
                    color='gray.400'
                    fontWeight='bold'
                    textTransform='uppercase'>
                    Incidents pris en compte par {organisation}
                  </StatLabel>
                  <Flex>
                    <StatNumber fontSize='lg' color={textColor} fontWeight='bold'>
                      {countActions} 
                    </StatNumber>
                  </Flex>
                </Stat>
                <IconBox
                  >
                  <RiMessage2Fill color="#a1b8c7" size={40}/>
                </IconBox>
              </Flex>
              <Text color='gray.400' fontSize='sm'>
                <Text as='span' color='green.400' fontWeight='bold'>
                  {PercentageIncrease}%{" "}
                </Text>
                Depuis le mois dernier
              </Text>
            </Flex>
          </Card>
        </Box>
       
      </SimpleGrid>
      <Grid
        templateColumns={{ sm: "1fr", lg: "2fr 1fr" }}
        templateRows={{ lg: "repeat(2, auto)" }}
        gap='20px'>
        <Card
          bg={
            colorMode === "dark"
              ? "navy.800"
              : "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
          }
          p='0px'
          maxW={{ sm: "320px", md: "100%" }}>
          <Flex direction='column' mb='40px' p='28px 0px 0px 22px' position="relative">
            <Text color='#fff' fontSize='lg' fontWeight='bold' mb='6px'>
              Carte interactive
            </Text>
            <Text color='#fff' fontSize='sm'>
              Carte interactive avec les points reportés par les utilisateurs de l'application mobile
            </Text>
          </Flex>
          <Box minH='400px' height='100%' width='100%' position="relative" overflow="hidden">
            <div id="map" style={{ position: 'absolute', top: 0, left: 10, right: 10, bottom: 0,}}>
              <Carte 
                positions={positions} 
                onShowIncident={onShowIncident} 
                showOnlyTakenIntoAccount={showOnlyTakenIntoAccount}
                showOnlyResolved={showOnlyResolved}
                showOnlyDeclared={showOnlyDeclared} 
              />
            </div>
          </Box>
        </Card>
        <Flex direction="column" gap="20px">
          <Card p='0px' maxW={{ sm: "320px", md: "100%" }}>
            <Flex direction='column' mb='40px' p='28px 0px 0px 22px'>
              <Text fontSize='lg' color={textColor} fontWeight='bold'>
                Incident par type d'utilisateur
              </Text>
            </Flex>
            <Box minH='300px'>
              <IndicateurChart />
            </Box>
          </Card>
          
          <Card p='0px' maxW={{ sm: "320px", md: "100%" }}>
            <Flex direction='column'>
              <Flex align='center' justify='space-between' p='22px'>
                <Text fontSize='lg' color={textColor} fontWeight='bold'>
                  Incidents par Zone
                </Text>
              </Flex>
              <Box minH='300px'>
                <ZoneChart />
              </Box>
            </Flex>
          </Card>
        </Flex>
      </Grid>
    </Flex>
  );
}
