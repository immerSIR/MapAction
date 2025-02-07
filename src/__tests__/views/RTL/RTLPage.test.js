const React = require('react');
const { render, screen } = require('@testing-library/react');
const { ChakraProvider } = require('@chakra-ui/react');
const RTLPage = require('../../../views/RTL/RTLPage').default;

// Mocks des composants Charts
jest.mock('../../../components/Charts/LineChart', () => {
  return function MockLineChart() {
    return <div data-testid="line-chart">Line Chart</div>;
  };
});

jest.mock('../../../components/Charts/BarChart', () => {
  return function MockBarChart() {
    return <div data-testid="bar-chart">Bar Chart</div>;
  };
});

describe('RTLPage', () => {
  const renderWithChakra = (component) => {
    return render(
      <ChakraProvider>
        {component}
      </ChakraProvider>
    );
  };

  it('rend correctement les statistiques', () => {
    renderWithChakra(<RTLPage />);
    
    expect(screen.getByText("Today's Money")).toBeInTheDocument();
    expect(screen.getByText("Today's Users")).toBeInTheDocument();
    expect(screen.getByText("New Clients")).toBeInTheDocument();
    expect(screen.getByText("Total Sales")).toBeInTheDocument();
  });

  it('affiche les graphiques', () => {
    renderWithChakra(<RTLPage />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('rend les tableaux de données', () => {
    renderWithChakra(<RTLPage />);
    
    expect(screen.getByText('Page visits')).toBeInTheDocument();
    expect(screen.getByText('Social traffic')).toBeInTheDocument();
  });

  it('affiche les pourcentages de progression', () => {
    renderWithChakra(<RTLPage />);
    
    expect(screen.getByText('+3.48%')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
    expect(screen.getByText('-2.82%')).toBeInTheDocument();
    expect(screen.getByText('+8.12%')).toBeInTheDocument();
  });
}); 