const React = require('react');
const { render, act } = require('@testing-library/react');
const { MonthProvider, useMonth } = require('../../Fonctions/Month');

describe('MonthProvider', () => {
  const TestComponent = () => {
    const { selectedMonth, selectedYear, handleMonthChange, handleYearChange, yearsOptions } = useMonth();
    return (
      <div>
        <span data-testid="month">{selectedMonth}</span>
        <span data-testid="year">{selectedYear}</span>
        <button onClick={() => handleMonthChange({ value: 6 })}>Change Month</button>
        <button onClick={() => handleYearChange({ value: 2023 })}>Change Year</button>
        <span data-testid="years-count">{yearsOptions.length}</span>
      </div>
    );
  };

  it('fournit les valeurs initiales correctes', () => {
    const { getByTestId } = render(
      <MonthProvider>
        <TestComponent />
      </MonthProvider>
    );

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    expect(getByTestId('month').textContent).toBe(currentMonth.toString());
    expect(getByTestId('year').textContent).toBe(currentYear.toString());
  });

  it('met à jour le mois correctement', () => {
    const { getByText, getByTestId } = render(
      <MonthProvider>
        <TestComponent />
      </MonthProvider>
    );

    act(() => {
      getByText('Change Month').click();
    });

    expect(getByTestId('month').textContent).toBe('6');
  });

  it('met à jour l\'année correctement', () => {
    const { getByText, getByTestId } = render(
      <MonthProvider>
        <TestComponent />
      </MonthProvider>
    );

    act(() => {
      getByText('Change Year').click();
    });

    expect(getByTestId('year').textContent).toBe('2023');
  });

  it('génère les bonnes options d\'années', () => {
    const { getByTestId } = render(
      <MonthProvider>
        <TestComponent />
      </MonthProvider>
    );

    expect(getByTestId('years-count').textContent).toBe('10');
  });

  it('gère les valeurs de mois invalides', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { getByTestId } = render(
      <MonthProvider>
        <TestComponent />
      </MonthProvider>
    );

    act(() => {
      const { handleMonthChange } = useMonth();
      handleMonthChange({ value: 13 });
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
}); 