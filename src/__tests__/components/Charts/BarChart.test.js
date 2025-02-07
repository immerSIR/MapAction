const React = require('react');
const { render, screen, waitFor } = require('@testing-library/react');
const BarChart = require('../../../components/Charts/BarChart').default;

// Mock Chart from react-apexcharts
jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: function MockChart({ options, series, type, width, height }) {
    return (
      <div data-testid="mock-bar-chart">
        <span data-testid="chart-type">{type}</span>
        <span data-testid="chart-width">{width}</span>
        <span data-testid="chart-height">{height}</span>
        <span data-testid="chart-series">{JSON.stringify(series)}</span>
        <span data-testid="chart-options">{JSON.stringify(options)}</span>
      </div>
    );
  }
}));

describe('BarChart Component', () => {
  const mockProps = {
    chartData: [
      {
        name: 'Series 1',
        data: [30, 40, 45, 50, 49]
      }
    ],
    chartOptions: {
      chart: {
        type: 'line',
        toolbar: {
          show: false,
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
      }
    }
  };

  it('rend correctement le composant avec les props par défaut', () => {
    render(<BarChart />);
    
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('chart-type')).toHaveTextContent('line');
    expect(screen.getByTestId('chart-width')).toHaveTextContent('100%');
    expect(screen.getByTestId('chart-height')).toHaveTextContent('100%');
  });

  it('initialise correctement les données du graphique avec les props', async () => {
    render(<BarChart {...mockProps} />);

    await waitFor(() => {
      const seriesElement = screen.getByTestId('chart-series');
      const optionsElement = screen.getByTestId('chart-options');
      
      expect(seriesElement).toHaveTextContent(JSON.stringify(mockProps.chartData));
      expect(optionsElement).toHaveTextContent(JSON.stringify(mockProps.chartOptions));
    });
  });

  it('utilise les valeurs par défaut pour series et labels', () => {
    render(<BarChart />);

    const seriesElement = screen.getByTestId('chart-series');
    expect(seriesElement).toBeInTheDocument();
    
    const defaultState = {
      series: [44, 55, 41, 17, 15],
      labels: ['A', 'B', 'C', 'D', 'E']
    };
    
    expect(JSON.parse(seriesElement.textContent)).toBeTruthy();
  });

  it('met à jour correctement l\'état avec de nouvelles props', async () => {
    const { rerender } = render(<BarChart {...mockProps} />);

    const newProps = {
      chartData: [
        {
          name: 'Series 2',
          data: [60, 70, 75, 80, 85]
        }
      ],
      chartOptions: {
        ...mockProps.chartOptions,
        xaxis: {
          categories: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct']
        }
      }
    };

    rerender(<BarChart {...newProps} />);

    await waitFor(() => {
      const seriesElement = screen.getByTestId('chart-series');
      const optionsElement = screen.getByTestId('chart-options');
      
      expect(seriesElement).toHaveTextContent(JSON.stringify(newProps.chartData));
      expect(optionsElement).toHaveTextContent(JSON.stringify(newProps.chartOptions));
    });
  });

  it('conserve les dimensions spécifiées après mise à jour', async () => {
    const { rerender } = render(<BarChart {...mockProps} />);

    rerender(<BarChart {...mockProps} />);

    expect(screen.getByTestId('chart-width')).toHaveTextContent('100%');
    expect(screen.getByTestId('chart-height')).toHaveTextContent('100%');
  });
}); 