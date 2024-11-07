// Mocking the ApexCharts component
jest.mock("react-apexcharts", () => {
  return jest.fn(() => <div>Mocked ApexCharts</div>);
});
