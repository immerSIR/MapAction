import React, { createContext, useContext, useState } from 'react';

const MonthContext = createContext();

export const MonthProvider = ({ children }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const handleMonthChange = (selectedOption) => {
        const monthValue = selectedOption.value;
        console.log("Selected month", monthValue)
        if (monthValue >= 1 && monthValue <= 12) {
            setSelectedMonth(monthValue);
        } else {
            console.error("Invalid month value:", monthValue);
        }
    };

    return (
        <MonthContext.Provider value={{ selectedMonth, handleMonthChange }}>
            {children}
        </MonthContext.Provider>
    );
};

export const useMonth = () => {
    return useContext(MonthContext);
};
