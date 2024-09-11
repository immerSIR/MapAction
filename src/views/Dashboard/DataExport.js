import { 
  Accordion, 
  Box, 
  Heading, 
  Flex, 
  useColorMode,
  useColorModeValue,
  Text,
  Button,
  IconButton,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Input,
  theme
} from "@chakra-ui/react";
import CardBody from "components/Card/CardBody";
import Card from "components/Card/Card";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "config";
import { ChevronRightIcon } from "@chakra-ui/icons";

const DataExport = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("blue.500", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");
  const [period, setPeriod] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  const handleExport = async () => {
    try {
      let response;
      if (period === 'day') {
        response = await axios.get(`${config.url}/MapApi/incident-filter/?filter_type="today"`, {
          
          headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        });
        const csvData = convertToCSV(response.data);
        downloadFile(csvData, `incidents_${selectedDate}.csv`);
      } else if (period === 'month') {
        const monthNumber = new Date(selectedMonth + '-01').getMonth() + 1;
        response = await axios.get(`${config.url}/MapApi/incidentByMonth/`, {
          params: {
            month: monthNumber,
          },
          headers: {
            Authorization: `Bearer ${sessionStorage.token}`,
          },
        });
        console.log(response.data.data)
        const csvData = convertToCSV(response.data.data);
        downloadFile(csvData, `incidents_${selectedMonth}.csv`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'exportation des données :', error.message);
    }
  };
  
  const convertToCSV = (data) => {
    if (!data || !data.length) return '';
    const headers = Object.keys(data[0]).map(header => `"${header}"`).join(',') + '\n';
    const rows = data.map(row => {
      return Object.values(row).map(value => 
          typeof value === 'object' ? JSON.stringify(value) : `"${value}"`
      ).join(',');
    }).join('\n');
    return headers + rows;
  };
  
  const downloadFile = (data, filename) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
      <Flex
        direction={{ sm: "column", md: "row" }}
        mb='48px' 
        maxH='330px'
        justifyContent={{ sm: "center", md: "space-between" }}
        align='center'
        backdropFilter='blur(21px)'
        boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
        border='1.5px solid'
        borderColor={borderProfileColor}
        bg={bgProfile}
        p='24px'   
        borderRadius='20px'
       >
        <Heading as="h1" mb={10} fontSize={theme.fontSizes.lg}>Exportation des données</Heading>
      </Flex>
      <Card p='16px' my='24px'>
        <CardBody>
          <Box p={5}>
            <Text fontSize='lg' color={textColor} fontWeight='bold'>
              Export des données
            </Text>
            <RadioGroup value={period} onChange={setPeriod}>
              <Flex mb={4}>
                <Radio value='day'>Par Jour</Radio>
                <Radio value='month' ml={4}>Par Mois</Radio>
              </Flex>
            </RadioGroup>
            {period === 'day' && (
              <FormControl mt={4}>
                <FormLabel htmlFor="datePicker">Sélectionnez une Date:</FormLabel>
                <Input
                  type="date"
                  id="datePicker"
                  value={selectedDate.toISOString().slice(0, 10)}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </FormControl>
            )}
            {period === 'month' && (
              <FormControl mt={4}>
                <FormLabel htmlFor="monthPicker">Sélectionnez un Mois:</FormLabel>
                <Input
                  type="month"
                  id="monthPicker"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </FormControl>
            )}
            <Button colorScheme='blue' mt={4} onClick={handleExport}>Exporter les Données</Button> 
          </Box>
        </CardBody> 
      </Card>
    </Flex>
  );
};

export default DataExport;
