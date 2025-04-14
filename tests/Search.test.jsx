// Search.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Search from "../pages/Search";

// --- Mock the useCounties hook ---
jest.mock("../hooks/useCounties", () => ({
  useCounties: () => ({
    data: [
      { countyName: "Test County", fipsStateCode: "01", fipsCountyCode: "001" },
      { countyName: "Another County", fipsStateCode: "02", fipsCountyCode: "002" },
    ],
  }),
}));

// --- Mock the Autocomplete component ---
// Here we simulate an Autocomplete by rendering a simple input element.
// The input’s value reflects the selected county’s name (if provided).
jest.mock("../components/Autocomplete", () => {
  return (props) => {
    return (
      <input
        data-testid="autocomplete"
        value={props.value ? props.value.countyName : ""}
        onChange={(e) => {
          // Simulate the selection by passing the new value to the onChange handler.
          const newValue = e.target.value;
          props.onChange(null, newValue);
        }}
      />
    );
  };
});

describe("Search Page", () => {
  test('renders header "Select Your County"', () => {
    render(<Search selectedCounty={null} setSelectedCounty={() => {}} />);
    expect(
      screen.getByText("Select Your County")
    ).toBeInTheDocument();
  });

  test("renders the Autocomplete input", () => {
    render(<Search selectedCounty={null} setSelectedCounty={() => {}} />);
    expect(screen.getByTestId("autocomplete")).toBeInTheDocument();
  });

  test("Autocomplete input is empty when no county is selected", () => {
    render(<Search selectedCounty={null} setSelectedCounty={() => {}} />);
    expect(screen.getByTestId("autocomplete").value).toBe("");
  });

  test("Autocomplete input shows selectedCounty value if provided", () => {
    const selectedCounty = {
      countyName: "Test County",
      fipsStateCode: "01",
      fipsCountyCode: "001",
    };
    render(
      <Search selectedCounty={selectedCounty} setSelectedCounty={() => {}} />
    );
    expect(screen.getByTestId("autocomplete").value).toBe("Test County");
  });

  test("calls setSelectedCounty when the Autocomplete input changes", () => {
    const mockSetSelectedCounty = jest.fn();
    render(
      <Search selectedCounty={null} setSelectedCounty={mockSetSelectedCounty} />
    );
    const input = screen.getByTestId("autocomplete");
    // Simulate a user selecting "Another County"
    fireEvent.change(input, { target: { value: "Another County" } });
    expect(mockSetSelectedCounty).toHaveBeenCalledWith("Another County");
  });
});
