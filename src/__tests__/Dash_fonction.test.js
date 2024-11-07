import { renderHook } from "@testing-library/react-hooks";
import { act } from "react";
import { waitFor } from "@testing-library/react";
import axios from "axios";
import { useIncidentData } from "../Fonctions/Dash_fonction";
import { useMonth } from "../Fonctions/Month";
import { useDateFilter } from "../Fonctions/YearMonth";

// Mock axios
jest.mock("axios");

// Mock useMonth and useDateFilter hooks
jest.mock("../Fonctions/Month", () => ({
  useMonth: jest.fn(),
}));

jest.mock("../Fonctions/YearMonth", () => ({
  useDateFilter: jest.fn(),
}));

describe("useIncidentData", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    axios.get.mockClear();
    useMonth.mockReturnValue({ selectedMonth: 1 });
    useDateFilter.mockReturnValue({
      filterType: "monthly",
      customRange: [],
    });

    // Mock sessionStorage
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: jest.fn(() => "mockToken"),
        setItem: jest.fn(() => null),
        token: "mockToken",
      },
      writable: true,
    });
  });

  it("should fetch anonymous percentage correctly", async () => {
    const mockData = [{ user_id: null }, { user_id: 1 }, { user_id: null }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useIncidentData());

    await act(async () => {
      await waitFor(() => {
        expect(result.current.anonymousPercentage).toBe("66.67");
      });
    });
  });

  it("should handle API error gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    const { result } = renderHook(() => useIncidentData());

    await act(async () => {
      await waitFor(() => {
        expect(result.current.anonymousPercentage).toBe(0);
      });
    });
  });
});
