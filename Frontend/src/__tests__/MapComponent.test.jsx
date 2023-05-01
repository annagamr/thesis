import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
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

});
