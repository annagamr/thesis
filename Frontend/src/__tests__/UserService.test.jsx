import axios from "axios";
import UserService from "../services/user.service";

jest.mock("axios");

describe("UserService Tests", () => {
  test("1. Test if the getAccessTokenHeaderFromLocalStorage method returns an empty HTTP header object when no user is present in local storage.", () => {
    localStorage.removeItem("user");
    const headers = UserService.getAccessTokenHeaderFromLocalStorage();
    expect(headers).toEqual({});
  });

  test("2. Test if the getAccessTokenHeaderFromLocalStorage method returns an empty HTTP header object when the user in local storage does not have an access token.", () => {
    localStorage.setItem("user", JSON.stringify({ username: "test_user" }));
    const headers = UserService.getAccessTokenHeaderFromLocalStorage();
    expect(headers).toEqual({});
  });

  test("3. Test if the getAccessTokenHeaderFromLocalStorage method returns an HTTP header object with a single key-value pair when the user in local storage has an access token.", () => {
    const user = { username: "test_user", accessToken: "test_token" };
    localStorage.setItem("user", JSON.stringify(user));
    const headers = UserService.getAccessTokenHeaderFromLocalStorage();
    expect(headers).toEqual({ "x-access-token": user.accessToken });
  });

  test("4. Test if the userAccess method calls the getAccessTokenHeaderFromLocalStorage method to retrieve the HTTP headers to send with the GET request.", async () => {
    const mockResponse = { data: { message: "User access granted" } };
    const mockedGet = axios.get.mockResolvedValueOnce(mockResponse);

    await UserService.userAccess();

    expect(mockedGet).toHaveBeenCalledWith("http://localhost:3002/api/user", {
      headers: UserService.getAccessTokenHeaderFromLocalStorage(),
    });
  });

  test("5. Test if the sellerAccess method calls the getAccessTokenHeaderFromLocalStorage method to retrieve the HTTP headers to send with the GET request.", async () => {
    const mockResponse = { data: { message: "Seller access granted" } };
    const mockedGet = axios.get.mockResolvedValueOnce(mockResponse);

    await UserService.sellerAccess();

    expect(mockedGet).toHaveBeenCalledWith("http://localhost:3002/api/seller", {
      headers: UserService.getAccessTokenHeaderFromLocalStorage(),
    });
  });

  test("5. Test if the adminAccess method calls the getAccessTokenHeaderFromLocalStorage method to retrieve the HTTP headers to send with the GET request.", async () => {
    const mockResponse = { data: { message: "Admin access granted" } };
    const mockedGet = axios.get.mockResolvedValueOnce(mockResponse);

    await UserService.adminAccess();

    expect(mockedGet).toHaveBeenCalledWith("http://localhost:3002/api/admin", {
      headers: UserService.getAccessTokenHeaderFromLocalStorage(),
    });
  });
});
