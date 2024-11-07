import React from 'react'
import { render, screen, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react'; // Chakra provider for styling
import BarChart from 'components/Charts/BarChart';

jest.mock("react-apexcharts", () => ({
    __esModule: true,
    default: () => <div data-testid="apexchart-mock">Chart Mock</div>,
  }))

// Helper Wrapper to include ChakraProvider
const Wrapper = ({ children }) => <ChakraProvider>{children}</ChakraProvider>;

describe('BarChart Component', () => {
  const defaultProps = {
    chartData: [
      { data: [10, 20, 30] },
      { data: [15, 25, 35] },
    ],
    chartOptions: {
      chart: {
        id: 'bar-chart',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar'],
      },
    },
  };

  it('renders without crashing', () => {
    render(<BarChart {...defaultProps} />, { wrapper: Wrapper });
    expect(screen.getByText('Chart Mock')).toBeInTheDocument();
  });


});
