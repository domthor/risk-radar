// Alerts.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// --- Global mocks used by tests 1-4 ---
// Mock the useCounties hook to return a test county.
jest.mock("../hooks/useCounties", () => ({
  useCounties: () => ({
    data: [
      { countyName: "Test County", fipsStateCode: "01", fipsCountyCode: "001" },
    ],
  }),
}));

// Mock the Autocomplete component with a simple input.
jest.mock("../components/Autocomplete", () => {
  return (props) => {
    return (
      <input
        data-testid="autocomplete"
        value={props.value?.countyName || ""}
        onChange={(e) => {
          // Call onChange with the input value (simulate selecting a county by string).
          const newValue = e.target.value;
          props.onChange(null, newValue);
        }}
      />
    );
  };
});

// For tests 1-4, mock RecentEventsCard to immediately render its content.
jest.mock("../components/RecentEventsCard", () => {
  return ({ route }) => (
    <div data-testid="recent-events-card">
      Events loaded from {route}
    </div>
  );
});

// Import the Alerts page component after setting up the mocks.
import Alerts from "../pages/Alerts";

describe("Alerts Page", () => {
  test("renders default view with search bar when no county is selected", () => {
    render(
      <MemoryRouter initialEntries={["/alerts"]}>
        <Alerts />
      </MemoryRouter>
    );
    // The heading for county selection is shown.
    expect(screen.getByText(/Select your county/)).toBeInTheDocument();
    // The prompt to select a county is visible.
    expect(screen.getByText(/Please select a county/)).toBeInTheDocument();
    // No RecentEventsCard should be rendered.
    expect(screen.queryByTestId("recent-events-card")).not.toBeInTheDocument();
  });

  test("renders hazard alerts when a county is selected", async () => {
    render(
      <MemoryRouter initialEntries={["/alerts"]}>
        <Alerts />
      </MemoryRouter>
    );

    const input = screen.getByTestId("autocomplete");
    // Simulate typing the county name to select it.
    fireEvent.change(input, { target: { value: "Test County" } });

    // Wait for the component to update with the county selection.
    await waitFor(() =>
      expect(
        screen.getByText(/Hazard Alerts for Test County/)
      ).toBeInTheDocument()
    );

    // Confirm that RecentEventsCard is rendered with the expected route.
    expect(screen.getByTestId("recent-events-card")).toHaveTextContent(
      "/api/disaster_summaries/?fipsStateCode=01&fipsCountyCode=001"
    );
  });

  test("clears selected county on location change", async () => {
    // Render Alerts within Routes so we can simulate navigation.
    const { rerender } = render(
      <MemoryRouter initialEntries={["/alerts"]}>
        <Routes>
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/other" element={<div>Other Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate selecting a county.
    const input = screen.getByTestId("autocomplete");
    fireEvent.change(input, { target: { value: "Test County" } });
    await waitFor(() =>
      expect(
        screen.getByText(/Hazard Alerts for Test County/)
      ).toBeInTheDocument()
    );

    // Simulate navigating to a different route.
    window.history.pushState({}, "Other page", "/other");
    rerender(
      <MemoryRouter initialEntries={["/other"]}>
        <Routes>
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/other" element={<div>Other Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Other Page")).toBeInTheDocument();

    // Simulate navigating back to /alerts.
    window.history.pushState({}, "Alerts page", "/alerts");
    rerender(
      <MemoryRouter initialEntries={["/alerts"]}>
        <Routes>
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/other" element={<div>Other Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    // The selected county should have been cleared.
    expect(screen.getByText(/Please select a county/)).toBeInTheDocument();
    expect(
      screen.queryByText(/Hazard Alerts for Test County/)
    ).not.toBeInTheDocument();
  });

  test("clears selected county when Autocomplete returns an empty value", async () => {
    render(
      <MemoryRouter initialEntries={["/alerts"]}>
        <Alerts />
      </MemoryRouter>
    );

    const input = screen.getByTestId("autocomplete");
    // First, select a county.
    fireEvent.change(input, { target: { value: "Test County" } });
    await waitFor(() =>
      expect(
        screen.getByText(/Hazard Alerts for Test County/)
      ).toBeInTheDocument()
    );

    // Then clear the selection by sending an empty value.
    fireEvent.change(input, { target: { value: "" } });
    await waitFor(() =>
      expect(screen.getByText(/Please select a county/)).toBeInTheDocument()
    );
    expect(
      screen.queryByText(/Hazard Alerts for Test County/)
    ).not.toBeInTheDocument();
  });

  test("renders loading fallback in Suspense when RecentEventsCard is loading", async () => {
    // For this test we need to simulate a lazy-loaded RecentEventsCard.
    // Reset modules and re‑mock RecentEventsCard to delay its resolution.
    jest.useFakeTimers();
    jest.resetModules();

    // Re‑mock the dependent modules for this test.
    jest.doMock("../hooks/useCounties", () => ({
      useCounties: () => ({
        data: [
          { countyName: "Test County", fipsStateCode: "01", fipsCountyCode: "001" },
        ],
      }),
    }));

    jest.doMock("../components/Autocomplete", () => {
      return (props) => {
        return (
          <input
            data-testid="autocomplete"
            value={props.value?.countyName || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              props.onChange(null, newValue);
            }}
          />
        );
      };
    });

    // Re‑mock RecentEventsCard as a lazy component that delays rendering.
    const React = require("react");
    jest.doMock("../components/RecentEventsCard", () => {
      return {
        __esModule: true,
        default: React.lazy(() =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                default: ({ route }) => (
                  <div data-testid="recent-events-card">
                    Delayed events loaded from {route}
                  </div>
                ),
              });
            }, 1000);
          })
        ),
      };
    });

    // Now re‑require the Alerts component so it uses the new mocks.
    const AlertsDelayed = require("../pages/Alerts").default;
    const { MemoryRouter } = require("react-router-dom");
    const { render: renderDelayed } = require("@testing-library/react");

    renderDelayed(
      <MemoryRouter initialEntries={["/alerts"]}>
        <AlertsDelayed />
      </MemoryRouter>
    );

    // Select the county.
    const autocompleteInput = screen.getByTestId("autocomplete");
    act(() => {
      autocompleteInput.value = "Test County";
      autocompleteInput.dispatchEvent(new Event("change", { bubbles: true }));
    });

    // Since the RecentEventsCard is lazy, Suspense should show the fallback.
    expect(screen.getByText("Loading events...")).toBeInTheDocument();

    // Advance timers so that the lazy component resolves.
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Wait for the lazy component to render.
    await waitFor(() =>
      expect(screen.getByTestId("recent-events-card")).toBeInTheDocument()
    );
    expect(screen.getByTestId("recent-events-card")).toHaveTextContent(
      "/api/disaster_summaries/?fipsStateCode=01&fipsCountyCode=001"
    );
    jest.useRealTimers();
  });
});
