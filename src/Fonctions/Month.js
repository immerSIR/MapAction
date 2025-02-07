import React, { createContext, useContext, useState } from 'react';

const MonthContext = createContext();

export const MonthProvider = ({ children }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const handleYearChange = (selectedOption) => {
        const yearValue = selectedOption.value;
        console.log("Selected year", yearValue);
        setSelectedYear(yearValue);
    };

    const handleMonthChange = (selectedOption) => {
        const monthValue = selectedOption.value;
        console.log("Selected month", monthValue);
        if (monthValue >= 1 && monthValue <= 12) {
            setSelectedMonth(monthValue);
        } else {
            console.error("Invalid month value:", monthValue);
        }
    };

    const yearsOptions = Array.from(
        { length: 10 },
        (v, i) => {
            const year = new Date().getFullYear() - i;
            return { value: year, label: year.toString() };
        }
    );

    return (
        <MonthContext.Provider value={{ selectedMonth, handleMonthChange, selectedYear, handleYearChange, yearsOptions }}>
            {children}
        </MonthContext.Provider>
    );
};

export const useMonth = () => {
    const context = useContext(MonthContext);
    console.log('useMonth context:', context); 
    if (!context) {
        throw new Error('useMonth must be used within a MonthProvider');
    }
    return context;
};

