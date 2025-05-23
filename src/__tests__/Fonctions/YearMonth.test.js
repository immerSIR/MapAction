// const React = require('react');
// const { render, act } = require('@testing-library/react');
// const { DateFilterProvider, useDateFilter } = require('../../Fonctions/YearMonth');
// const { subDays, startOfMonth, endOfMonth } = require('date-fns');

// describe('DateFilterProvider', () => {
//   const TestComponent = () => {
//     const { filterType, customRange, handleFilterChange, handleDateChange, applyCustomRange, showDatePicker } = useDateFilter();
    
//     return (
//       <div>
//         <span data-testid="filter-type">{filterType}</span>
//         <span data-testid="start-date">{customRange[0].startDate.toISOString()}</span>
//         <span data-testid="end-date">{customRange[0].endDate.toISOString()}</span>
//         <span data-testid="show-picker">{showDatePicker.toString()}</span>
//         <button onClick={() => handleFilterChange('today')}>Today</button>
//         <button onClick={() => handleFilterChange('last_7_days')}>Last 7 Days</button>
//         <button onClick={() => handleFilterChange('custom_range')}>Custom</button>
//         <button onClick={applyCustomRange}>Apply Range</button>
//         <button 
//           data-testid="change-date" 
//           onClick={() => handleDateChange({ selection: { 
//             startDate: new Date(2024, 0, 1), 
//             endDate: new Date(2024, 0, 7), 
//             key: 'selection' } 
//           })}
//         >
//           Change Date
//         </button>
//       </div>
//     );
//   };
  

//   it('initialise avec les valeurs par défaut', () => {
//     const { getByTestId } = render(
//       <DateFilterProvider>
//         <TestComponent />
//       </DateFilterProvider>
//     );

//     expect(getByTestId('filter-type').textContent).toBe('today');
//     expect(getByTestId('show-picker').textContent).toBe('false');
//   });

//   it('gère le filtre "today" correctement', () => {
//     const { getByText, getByTestId } = render(
//       <DateFilterProvider>
//         <TestComponent />
//       </DateFilterProvider>
//     );

//     act(() => {
//       getByText('Today').click();
//     });

//     const today = new Date().toISOString().split('T')[0];
//     expect(getByTestId('start-date').textContent).toContain(today);
//     expect(getByTestId('end-date').textContent).toContain(today);
//   });

//   it('gère le filtre "last_7_days" correctement', () => {
//     const { getByText, getByTestId } = render(
//       <DateFilterProvider>
//         <TestComponent />
//       </DateFilterProvider>
//     );

//     act(() => {
//       getByText('Last 7 Days').click();
//     });

//     const sevenDaysAgo = subDays(new Date(), 7).toISOString().split('T')[0];
//     expect(getByTestId('start-date').textContent).toContain(sevenDaysAgo);
//   });

//   it('gère le mode custom_range correctement', () => {
//     const { getByText, getByTestId } = render(
//       <DateFilterProvider>
//         <TestComponent />
//       </DateFilterProvider>
//     );

//     act(() => {
//       getByText('Custom').click();
//     });

//     expect(getByTestId('show-picker').textContent).toBe('true');
//   });

//   it('applique la plage personnalisée correctement', () => {
//     const { getByText } = render(
//       <DateFilterProvider>
//         <TestComponent />
//       </DateFilterProvider>
//     );

//     act(() => {
//       getByText('Custom').click();
//       getByText('Apply Range').click();
//     });
//   });

//   it('gère les changements de dates correctement', () => {
//     const { getByTestId, getByText } = render(
//       <DateFilterProvider>
//         <TestComponent />
//       </DateFilterProvider>
//     );
  
//     act(() => {
//       getByText('Change Date').click();
//     });
  
//     expect(getByTestId('start-date').textContent).toContain('2024-01-01');
//     expect(getByTestId('end-date').textContent).toContain('2024-01-07');
//   });
  
// }); 

const React = require("react");
const { render, act, screen, fireEvent } = require("@testing-library/react");
const { DateFilterProvider, useDateFilter } = require("../../Fonctions/YearMonth"); // Ajuster le chemin si nécessaire
const { subDays, startOfMonth, endOfMonth, formatISO } = require("date-fns");

// Suppression des beforeAll/afterAll pour console.error ici

describe("DateFilterProvider Enhanced Coverage", () => {
  // Helper component pour accéder au contexte
  const TestComponent = () => {
    const { filterType, customRange, handleFilterChange, handleDateChange, applyCustomRange, showDatePicker } = useDateFilter();

    return (
      <div>
        <span data-testid="filter-type">{filterType}</span>
        {/* Gérer le cas où customRange est vide */}
        <span data-testid="range-length">{customRange.length}</span>
        {customRange.length > 0 && (
          <>
            <span data-testid="start-date">{customRange[0].startDate.toISOString()}</span>
            <span data-testid="end-date">{customRange[0].endDate.toISOString()}</span>
            <span data-testid="key">{customRange[0].key}</span>
            <span data-testid="color">{customRange[0].color}</span>
          </>
        )}
        <span data-testid="show-picker">{showDatePicker.toString()}</span>
        
        {/* Boutons pour déclencher les changements */}
        <button onClick={() => handleFilterChange("all")}>All</button>
        <button onClick={() => handleFilterChange("today")}>Today</button>
        <button onClick={() => handleFilterChange("yesterday")}>Yesterday</button>
        <button onClick={() => handleFilterChange("last_7_days")}>Last 7 Days</button>
        <button onClick={() => handleFilterChange("last_30_days")}>Last 30 Days</button>
        <button onClick={() => handleFilterChange("this_month")}>This Month</button>
        <button onClick={() => handleFilterChange("last_month")}>Last Month</button>
        <button onClick={() => handleFilterChange("custom_range")}>Custom</button>
        <button onClick={() => handleFilterChange("invalid_type")}>Invalid Type</button> 
        <button onClick={() => handleFilterChange("custom_range", new Date(2024, 1, 10), new Date(2024, 1, 20))}>Set Custom Dates</button>
        <button onClick={applyCustomRange}>Apply Range</button>
        
        {/* Boutons pour handleDateChange */}
        <button 
          data-testid="change-date-valid"
          onClick={() => handleDateChange({ selection: { 
            startDate: new Date(2024, 0, 1), 
            endDate: new Date(2024, 0, 7), 
            key: "customKey", 
            color: "#ff0000" 
          }})}
        >
          Change Date Valid
        </button>
         <button 
          data-testid="change-date-range1"
          onClick={() => handleDateChange({ range1: { // Tester avec range1 au lieu de selection
            startDate: new Date(2024, 2, 10), 
            endDate: new Date(2024, 2, 15), 
            key: "rangeKey" 
          }})}
        >
          Change Date Range1
        </button>
        <button 
          data-testid="change-date-invalid"
          onClick={() => handleDateChange({ invalidKey: {} })} // Objet invalide
        >
          Change Date Invalid
        </button>
      </div>
    );
  };

  // Mocker console.error AVANT chaque test
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // Restaurer les mocks APRÈS chaque test
  afterEach(() => {
    jest.restoreAllMocks(); // Restaure tous les mocks créés avec jest.spyOn
  });

  // --- Tests --- 

  it("initialise avec filterType=\"all\" et customRange vide", () => {
    const { getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    expect(getByTestId("filter-type").textContent).toBe("all"); 
    expect(getByTestId("range-length").textContent).toBe("0");
    expect(getByTestId("show-picker").textContent).toBe("false");
  });

  it("gère le filtre \"today\"", () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("Today").click(); });
    const today = new Date().toISOString().split("T")[0];
    expect(getByTestId("start-date").textContent).toContain(today);
    expect(getByTestId("end-date").textContent).toContain(today);
    expect(getByTestId("filter-type").textContent).toBe("today");
    expect(getByTestId("show-picker").textContent).toBe("false");
  });

  it("gère le filtre \"last_7_days\"", () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("Last 7 Days").click(); });
    const sevenDaysAgo = subDays(new Date(), 7).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    expect(getByTestId("start-date").textContent).toContain(sevenDaysAgo);
    expect(getByTestId("end-date").textContent).toContain(today);
    expect(getByTestId("filter-type").textContent).toBe("last_7_days");
  });

  it("gère le mode custom_range et affiche le date picker", () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("Custom").click(); });
    expect(getByTestId("filter-type").textContent).toBe("custom_range");
    expect(getByTestId("show-picker").textContent).toBe("true");
  });

  it("applique la plage personnalisée et cache le date picker", () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("Custom").click(); });
    expect(getByTestId("show-picker").textContent).toBe("true");
    act(() => { getByText("Apply Range").click(); });
    expect(getByTestId("filter-type").textContent).toBe("custom_range"); 
    expect(getByTestId("show-picker").textContent).toBe("false");
  });

  it("gère les changements de dates via handleDateChange (avec selection)", () => {
    const { getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { fireEvent.click(getByTestId("change-date-valid")); });
    expect(getByTestId("start-date").textContent).toContain("2024-01-01");
    expect(getByTestId("end-date").textContent).toContain("2024-01-07");
    expect(getByTestId("key").textContent).toBe("customKey");
    expect(getByTestId("color").textContent).toBe("#ff0000");
  });

  it("gère le filtre \"all\" et vide customRange", () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("Today").click(); });
    expect(getByTestId("range-length").textContent).toBe("1");
    act(() => { getByText("All").click(); });
    expect(getByTestId("filter-type").textContent).toBe("all");
    expect(getByTestId("range-length").textContent).toBe("0");
    expect(getByTestId("show-picker").textContent).toBe("false");
  });

  it("gère le filtre \"yesterday\"", () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("Yesterday").click(); });
    const yesterday = subDays(new Date(), 1).toISOString().split("T")[0];
    expect(getByTestId("start-date").textContent).toContain(yesterday);
    expect(getByTestId("end-date").textContent).toContain(yesterday);
    expect(getByTestId("filter-type").textContent).toBe("yesterday");
  });

  it("gère le filtre \"last_30_days\"", () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("Last 30 Days").click(); });
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    expect(getByTestId("start-date").textContent).toContain(thirtyDaysAgo);
    expect(getByTestId("end-date").textContent).toContain(today);
    expect(getByTestId("filter-type").textContent).toBe("last_30_days");
  });

  it("gère le filtre \"this_month\"", () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("This Month").click(); });
    const start = startOfMonth(new Date()).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    expect(getByTestId("start-date").textContent).toContain(start);
    expect(getByTestId("end-date").textContent).toContain(today);
    expect(getByTestId("filter-type").textContent).toBe("this_month");
  });

  it("gère le filtre \"last_month\"", () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("Last Month").click(); });
    const lastMonthStart = startOfMonth(subDays(new Date(), 30)).toISOString().split("T")[0];
    const lastMonthEnd = endOfMonth(subDays(new Date(), 30)).toISOString().split("T")[0];
    expect(getByTestId("start-date").textContent).toContain(lastMonthStart);
    expect(getByTestId("end-date").textContent).toContain(lastMonthEnd);
    expect(getByTestId("filter-type").textContent).toBe("last_month");
  });

  it("appelle console.error pour un type de filtre inconnu", () => {
    const { getByText } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("Invalid Type").click(); });
    // Vérifier que le mock a été appelé
    expect(console.error).toHaveBeenCalledWith("Unknown filter type:", "invalid_type");
  });

  it("met à jour customRange lors de l'appel à handleFilterChange avec type custom_range et dates", () => {
    const { getByText, getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { getByText("Set Custom Dates").click(); });
    expect(getByTestId("filter-type").textContent).toBe("custom_range");
    expect(getByTestId("start-date").textContent).toContain("2024-02-10");
    expect(getByTestId("end-date").textContent).toContain("2024-02-20");
    expect(getByTestId("show-picker").textContent).toBe("true");
  });

  it("gère les changements de dates via handleDateChange (avec range1)", () => {
    const { getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { fireEvent.click(getByTestId("change-date-range1")); });
    expect(getByTestId("start-date").textContent).toContain("2024-03-10");
    expect(getByTestId("end-date").textContent).toContain("2024-03-15");
    expect(getByTestId("key").textContent).toBe("rangeKey");
    expect(getByTestId("color").textContent).toBe("#1890ff");
  });

  it("appelle console.error dans handleDateChange si l'objet ranges est invalide", () => {
    const { getByTestId } = render(
      <DateFilterProvider>
        <TestComponent />
      </DateFilterProvider>
    );
    act(() => { fireEvent.click(getByTestId("change-date-invalid")); });
    // Vérifier que le mock a été appelé
    expect(console.error).toHaveBeenCalledWith("Invalid ranges object:", { invalidKey: {} });
  });

});
