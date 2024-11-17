import React, { createContext, useContext } from "react";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const MonthContext = createContext({
    selectedMonth: new Date(),
    setSelectedMonth: jest.fn(),
    currentMonth: months[new Date().getMonth()],
    months: months,
    handleMonthChange: jest.fn(),
});

export const MonthProvider = ({ children }) => {
    const value = {
        selectedMonth: new Date(),
        setSelectedMonth: jest.fn(),
        currentMonth: months[new Date().getMonth()],
        months: months,
        handleMonthChange: jest.fn(),
    };

    return (
        <MonthContext.Provider value={value}>{children}</MonthContext.Provider>
    );
};

export const useMonthContext = () => {
    const context = useContext(MonthContext);
    if (!context) {
        throw new Error("useMonthContext must be used within a MonthProvider");
    }
    return context;
};
