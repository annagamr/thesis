import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MapComponent from "../components/shop/mapComponent";
import L from "leaflet";

// Mock the Leaflet library
jest.mock("leaflet", () => ({
  map: jest.fn(() => ({
    setView: jest.fn(),
    remove: jest.fn(),
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  marker: jest.fn(() => ({
    addTo: jest.fn(),
    setLatLng: jest.fn(),
  })),
  icon: jest.fn(),
}));

// Mock the fetch API for OpenStreetMap
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          lat: "51.5074",
          lon: "0.1278",
        },
      ]),
  })
);

describe("MapComponent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("1. MapComponent renders correctly with the given address", async () => {
    const { container } = render(
      <MapComponent street="10 Downing St" city="London" zipCode="SW1A 2AA" />
    );

    await waitFor(() =>
      expect(container.querySelector("div")).toBeInTheDocument()
    );

    expect(container.querySelector("div")).toHaveStyle({
      height: "450px",
      width: "100%",
    });
  });

  test("2. MapComponent updates when the address changes", async () => {
    const { rerender } = render(
      <MapComponent street="10 Downing St" city="London" zipCode="SW1A 2AA" />
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    rerender(
      <MapComponent
        street="Buckingham Palace"
        city="London"
        zipCode="SW1A 1AA"
      />
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });

//   test("4. Renders a map instance with the correct settings", () => {
//     const mockMapInstance = { setView: jest.fn() };
//     const mockTileLayer = { addTo: jest.fn() };
//     const mockMarker = { addTo: jest.fn() };
  
//     jest.spyOn(L, "map").mockReturnValue(mockMapInstance);
//     jest.spyOn(L, "tileLayer").mockReturnValue(mockTileLayer);
//     jest.spyOn(L, "marker").mockReturnValue(mockMarker);
  
//     render(<MapComponent street="123 Main St" city="Anytown" zipCode="12345" />);
  
//     expect(L.map).toHaveBeenCalledWith(null);
//     expect(mockMapInstance.setView).toHaveBeenCalledWith([expect.any(Number), expect.any(Number)], 16);
//     expect(L.tileLayer).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
//     expect(mockTileLayer.addTo).toHaveBeenCalledWith(mockMapInstance);
//     expect(L.marker).toHaveBeenCalledWith([expect.any(Number), expect.any(Number)], { icon: expect.any(Object) });
//     expect(mockMarker.addTo).toHaveBeenCalledWith(mockMapInstance);
//   });
});
