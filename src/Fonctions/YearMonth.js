import React, { createContext, useContext, useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const DateFilterContext = createContext();

export const DateFilterProvider = ({ children }) => {
    const [filterType, setFilterType] = useState('all');
    const [customRange, setCustomRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
        color: '#1890ff',
    }]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (ranges) => {
        const selectedRange = ranges.selection || ranges.range1;
        
        if (selectedRange) {
            const { startDate, endDate, key, color } = selectedRange;
            setCustomRange([{ startDate, endDate, key: key || 'selection', color: color || '#1890ff' }]);
        } else {
            console.error('Invalid ranges object:', ranges);
        }
    };
    
    
    
    const applyCustomRange = () => {
        const start = customRange[0].startDate;
        const end = customRange[0].endDate;
        handleFilterChange('custom_range', start, end);
        setShowDatePicker(false);
    };

    const handleFilterChange = (type, startDate = null, endDate = null) => {
        setFilterType(type);
        if (type === 'custom_range') {
            setShowDatePicker(true); 
        } else {
            setShowDatePicker(false);
        }

        switch (type) {
            case 'all':
            setCustomRange([]); // Vide car pas de date
            break;

            case 'today':
                setCustomRange([{
                    startDate: new Date(),
                    endDate: new Date(),
                }]);
                break;
            case 'yesterday':
                const yesterday = subDays(new Date(), 1);
                setCustomRange([{
                    startDate: yesterday,
                    endDate: yesterday,
                }]);
                break;
            case 'last_7_days':
                setCustomRange([{
                    startDate: subDays(new Date(), 7),
                    endDate: new Date(),
                }]);
                break;
            case 'last_30_days':
                setCustomRange([{
                    startDate: subDays(new Date(), 30),
                    endDate: new Date(),
                }]);
                break;
            case 'this_month':
                setCustomRange([{
                    startDate: startOfMonth(new Date()),
                    endDate: new Date(),
                }]);
                break;
            case 'last_month':
                const lastMonthStart = startOfMonth(subDays(new Date(), 30));
                const lastMonthEnd = endOfMonth(subDays(new Date(), 30));
                setCustomRange([{
                    startDate: lastMonthStart,
                    endDate: lastMonthEnd,
                }]);
                break;
            case 'custom_range':
                setCustomRange([{
                    startDate: startDate || new Date(),
                    endDate: endDate || new Date(),
                }]);
                break;
            
            default:
                console.error('Unknown filter type:', type);
        }
    };

    return (
        <DateFilterContext.Provider value={{ filterType, customRange, handleFilterChange, handleDateChange, applyCustomRange, showDatePicker }}>
            {children}
        </DateFilterContext.Provider>
    );
};

export const useDateFilter = () => {
    return useContext(DateFilterContext);
};
