import React, { useState } from 'react';
import { Box, Select, Button, Flex, Input } from '@chakra-ui/react';
import { DateRange } from 'react-date-range';
import { fr } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const IncidentFilter = ({ onFilter }) => {
  const [filterType, setFilterType] = useState('');
  const [customRange, setCustomRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    if (e.target.value === 'custom_range') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
      onFilter(e.target.value, null, null); 
    }
  };

  const handleDateChange = (ranges) => {
    setCustomRange([ranges.selection]);
  };

  const applyCustomRange = () => {
    const start = customRange[0].startDate.toISOString().split('T')[0];
    const end = customRange[0].endDate.toISOString().split('T')[0];
    onFilter('custom_range', start, end);
  };

  return (
    <Box>
      <Flex direction="column" pt={{ base: "120px", md: "75px", lg: "100px" }} color="#ccc">
        <Select
          placeholder="Sélectionner un filtre"
          value={filterType}
          onChange={handleFilterChange}
        >
          <option value="today">Aujourd'hui</option>
          <option value="yesterday">Hier</option>
          <option value="last_7_days">Les 7 derniers jours</option>
          <option value="last_30_days">Les 30 derniers jours</option>
          <option value="this_month">Ce mois</option>
          <option value="last_month">Le mois dernier</option>
          <option value="custom_range">Choix personnalisé</option>
        </Select>
        {showDatePicker && (
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
      </Flex>
    </Box>
  );
};

export default IncidentFilter;
