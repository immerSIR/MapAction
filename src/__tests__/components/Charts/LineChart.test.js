const React = require('react');
const { render, screen, waitFor } = require('@testing-library/react');
const LineChart = require('../../../components/Charts/LineChart').default;
const { lineChartData, lineChartOptions } = require('../../../variables/charts');

// Mock ReactApexChart
jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: function MockChart({ options, series, type, width, height }) {
    return (
      <div data-testid="mock-line-chart">
        <span data-testid="chart-type">{type}</span>
        <span data-testid="chart-width">{width}</span>
        <span data-testid="chart-height">{height}</span>
        <span data-testid="chart-series">{JSON.stringify(series)}</span>
        <span data-testid="chart-options">{JSON.stringify(options)}</span>
      </div>
    );
  }
}));

describe('LineChart Component', () => {
  it('rend correctement le composant avec les props par défaut', () => {
    render(<LineChart />);
    
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('chart-type')).toHaveTextContent('area');
    expect(screen.getByTestId('chart-width')).toHaveTextContent('100%');
    expect(screen.getByTestId('chart-height')).toHaveTextContent('100%');
  });

  it('initialise correctement les données du graphique', async () => {
    render(<LineChart />);

    await waitFor(() => {
      const seriesElement = screen.getByTestId('chart-series');
      const optionsElement = screen.getByTestId('chart-options');
      
      expect(seriesElement).toHaveTextContent(JSON.stringify(lineChartData));
      expect(optionsElement).toHaveTextContent(JSON.stringify(lineChartOptions));
    });
  });

  it('met à jour correctement l\'état après le montage', async () => {
    render(<LineChart />);

    await waitFor(() => {
      const seriesElement = screen.getByTestId('chart-series');
      expect(JSON.parse(seriesElement.textContent)).toEqual(lineChartData);
    });
  });

  it('conserve les dimensions spécifiées', () => {
    render(<LineChart />);
    
    expect(screen.getByTestId('chart-width')).toHaveTextContent('100%');
    expect(screen.getByTestId('chart-height')).toHaveTextContent('100%');
  });
}); 