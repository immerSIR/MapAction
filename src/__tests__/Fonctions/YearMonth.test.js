const React = require('react');
const { render, act } = require('@testing-library/react');
const { DateFilterProvider, useDateFilter } = require('../../Fonctions/YearMonth');
const { subDays, startOfMonth, endOfMonth } = require('date-fns');

describe('DateFilterProvider', () => {
  const TestComponent = () => {
    const { filterType, customRange, handleFilterChange, handleDateChange, applyCustomRange, showDatePicker } = useDateFilter();
    
    return (
      <div>
        <span data-testid="filter-type">{filterType}</span>
        <span data-testid="start-date">{customRange[0].startDate.toISOString()}</span>
        <span data-testid="end-date">{customRange[0].endDate.toISOString()}</span>
        <span data-testid="show-picker">{showDatePicker.toString()}</span>
        <button onClick={() => handleFilterChange('today')}>Today</button>
        <button onClick={() => handleFilterChange('last_7_days')}>Last 7 Days</button>
        <button onClick={() => handleFilterChange('custom_range')}>Custom</button>
        <button onClick={applyCustomRange}>Apply Range</button>
        <button 
          data-testid="change-date" 
          onClick={() => handleDateChange({ selection: { 
            startDate: new Date(2024, 0, 1), 
            endDate: new Date(2024, 0, 7), 
            key: 'selection' } 
          })}
        >
          Change Date
        </button>
      </div>
    );
  };
  

  it('initialise avec les valeurs par défaut', () => {
    const { getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );

    expect(getByTestId('filter-type').textContent).toBe('today');
    expect(getByTestId('show-picker').textContent).toBe('false');
  });

  it('gère le filtre "today" correctement', () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );

    act(() => {
      getByText('Today').click();
    });

    const today = new Date().toISOString().split('T')[0];
    expect(getByTestId('start-date').textContent).toContain(today);
    expect(getByTestId('end-date').textContent).toContain(today);
  });

  it('gère le filtre "last_7_days" correctement', () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );

    act(() => {
      getByText('Last 7 Days').click();
    });

    const sevenDaysAgo = subDays(new Date(), 7).toISOString().split('T')[0];
    expect(getByTestId('start-date').textContent).toContain(sevenDaysAgo);
  });

  it('gère le mode custom_range correctement', () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );

    act(() => {
      getByText('Custom').click();
    });

    expect(getByTestId('show-picker').textContent).toBe('true');
  });

  it('applique la plage personnalisée correctement', () => {
    const { getByText } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );

    act(() => {
      getByText('Custom').click();
      getByText('Apply Range').click();
    });
  });

  it('gère les changements de dates correctement', () => {
    const { getByTestId, getByText } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
  
    act(() => {
      getByText('Change Date').click();
    });
  
    expect(getByTestId('start-date').textContent).toContain('2024-01-01');
    expect(getByTestId('end-date').textContent).toContain('2024-01-07');
  });
  
}); 