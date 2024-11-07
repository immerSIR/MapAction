// Mocking the ApexCharts component
jest.mock('react-apexcharts', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="apexchart-mock">Chart Mock</div>,
  };
});