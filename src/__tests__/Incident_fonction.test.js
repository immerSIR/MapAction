// import { renderHook, act, waitFor } from "@testing-library/react-hooks";
// import { IncidentData } from "../Fonctions/Incident_fonction";
// import axios from "axios";
// import { useHistory, useLocation, useParams } from "react-router-dom";

// // Mock all external dependencies
// jest.mock("axios");
// jest.mock("react-router-dom", () => ({
//     useHistory: jest.fn(),
//     useLocation: jest.fn(),
//     useParams: jest.fn(),
// }));

// // Instead, just add this line
// jest.mock("config");

// describe("IncidentData", () => {
//     // Setup common mocks before each test
//     beforeEach(() => {
//         // Mock useParams
//         useParams.mockImplementation(() => ({
//             incidentId: "123",
//             userId: "456",
//         }));

//         // Mock useHistory
//         const mockNavigate = jest.fn();
//         useHistory.mockImplementation(() => ({
//             push: mockNavigate,
//         }));

//         // Mock useLocation
//         useLocation.mockImplementation(() => ({
//             state: {
//                 pictUrl: "test-url",
//                 nearbyPlaces: [],
//             },
//         }));

//         // Reset all mocks
//         jest.clearAllMocks();

//         // Reset axios mock
//         axios.get.mockReset();
//         axios.post.mockReset();
//     });

//     it("should fetch user data successfully", async () => {
//         // Mock successful API response
//         axios.get.mockResolvedValueOnce({
//             data: {
//                 data: {
//                     id: "456",
//                     name: "Test User",
//                 },
//             },
//         });

//         const { result, waitForNextUpdate } = renderHook(() => IncidentData());

//         // Wait for the useEffect to complete
//         await waitForNextUpdate();

//         expect(axios.get).toHaveBeenCalledWith(
//             expect.stringContaining("/MapApi/user_retrieve/"),
//             expect.any(Object)
//         );
//     });

//     it("should handle user data fetch error", async () => {
//         // Mock API error
//         const errorMessage = "API Error";
//         axios.get.mockRejectedValueOnce(new Error(errorMessage));

//         // Spy on console.error
//         const consoleSpy = jest.spyOn(console, "error");

//         const { result } = renderHook(() => IncidentData());

//         // Wait for the effect to complete
//         await act(async () => {
//             await new Promise((resolve) => setTimeout(resolve, 100));
//         });

//         expect(consoleSpy).toHaveBeenCalled();
//         consoleSpy.mockRestore();
//     });

//     it("should handle status change", async () => {
//         const { result } = renderHook(() => IncidentData());

//         const mockEvent = {
//             preventDefault: jest.fn(),
//             target: { value: "resolved" },
//         };

//         await act(async () => {
//             result.current.handleChangeStatus(mockEvent);
//         });

//         expect(mockEvent.preventDefault).toHaveBeenCalled();
//     });

//     it("should handle navigation", () => {
//         const { result } = renderHook(() => IncidentData());
//         const mockHistory = useHistory();

//         act(() => {
//             result.current.handleNavigate();
//         });

//         expect(mockHistory.push).toHaveBeenCalled();
//     });

//     it("should handle LLM navigation", () => {
//         const { result } = renderHook(() => IncidentData());
//         const mockHistory = useHistory();

//         act(() => {
//             result.current.handleNavigateLLM();
//         });

//         expect(mockHistory.push).toHaveBeenCalled();
//     });

//     it("should handle type selection change", () => {
//         const { result } = renderHook(() => IncidentData());
//         const mockEvent = {
//             target: {
//                 value: "test-type",
//             },
//         };

//         act(() => {
//             result.current.handleSelectChange(mockEvent);
//         });

//         // Add assertions based on what handleSelectChange should do
//     });

//     it("should handle prediction error", async () => {
//         const errorMessage = "Prediction Error";
//         axios.post.mockRejectedValueOnce(new Error(errorMessage));

//         const consoleSpy = jest.spyOn(console, "error");

//         const { result } = renderHook(() => IncidentData());

//         await act(async () => {
//             await result.current.sendPrediction();
//         });

//         expect(consoleSpy).toHaveBeenCalled();
//         consoleSpy.mockRestore();
//     });

//     it("should fetch predictions successfully", async () => {
//         axios.get.mockResolvedValueOnce({ data: { predictions: [] } });

//         const { result } = renderHook(() => IncidentData());

//         await act(async () => {
//             await result.current.fetchPredictions();
//         });

//         expect(axios.get).toHaveBeenCalled();
//     });

//     it("should return all required properties", () => {
//         const { result } = renderHook(() => IncidentData());

//         // Check that all required properties are returned
//         expect(result.current).toHaveProperty("handleChangeStatus");
//         expect(result.current).toHaveProperty("latitude");
//         expect(result.current).toHaveProperty("longitude");
//         expect(result.current).toHaveProperty("videoUrl");
//         expect(result.current).toHaveProperty("imgUrl");
//         expect(result.current).toHaveProperty("audioUrl");
//         expect(result.current).toHaveProperty("optionstype");
//         expect(result.current).toHaveProperty("description");
//         expect(result.current).toHaveProperty("position");
//         expect(result.current).toHaveProperty("date");
//         expect(result.current).toHaveProperty("heure");
//         expect(result.current).toHaveProperty("videoIsLoading");
//         expect(result.current).toHaveProperty("handleNavigate");
//         expect(result.current).toHaveProperty("setVideoIsLoading");
//         expect(result.current).toHaveProperty("incident");
//         expect(result.current).toHaveProperty("analysis");
//         expect(result.current).toHaveProperty("ndvi_heatmap");
//         expect(result.current).toHaveProperty("ndvi_ndwi_plot");
//         expect(result.current).toHaveProperty("landcover_plot");
//         expect(result.current).toHaveProperty("piste_solution");
//         expect(result.current).toHaveProperty("type_incident");
//         expect(result.current).toHaveProperty("zone");
//         expect(result.current).toHaveProperty("EditIncident");
//         expect(result.current).toHaveProperty("handleSelectChange");
//         expect(result.current).toHaveProperty("fetchPredictions");
//         expect(result.current).toHaveProperty("handleNavigateLLM");
//         expect(result.current).toHaveProperty("sendPrediction");
//     });
// });
