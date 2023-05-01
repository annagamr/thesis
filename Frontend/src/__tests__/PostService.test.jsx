import axios from "../__mocks__/axios";
import PostService from "../services/post.service";

jest.mock("axios");

describe("PostService Tests", () => {
  test("1. Test if the PostService instance is created without errors", () => {
    expect(PostService).toBeDefined();
  });

  test("2. Test if the getAllPosts method returns the correct data", async () => {
    const expectedData = [
      { id: 1, title: "Post 1", body: "This is the body of Post 1." },
      { id: 2, title: "Post 2", body: "This is the body of Post 2." },
    ];
    const mockResponse = { data: expectedData };
    const mockedGet = axios.get.mockResolvedValueOnce(mockResponse);

    const actualData = await PostService.getAllPosts();
    expect(mockedGet).toHaveBeenCalledWith("http://localhost:3002/api/posts");
    expect(actualData.data).toEqual(expectedData);
  });

  test("3. Test if the getSkincare method returns the correct data", async () => {
    const expectedData = {
      data: {
        count: 10,
      },
    };
    const mockedGet = axios.get.mockResolvedValueOnce(expectedData);
    const actualData = await PostService.getSkincare();
    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3002/api/countPostsByTopic/Skincare"
    );
    expect(actualData).toEqual(expectedData);
  });

  test("4. Test if the getMakeUp method returns the correct data", async () => {
    const expectedData = { data: { count: 20 } };
    const mockedGet = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce(expectedData);

    const actualData = await PostService.getMakeUp();
    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3002/api/countPostsByTopic/Make-up"
    );
    expect(actualData).toEqual(expectedData);
  });

  test("5. Test if the getHealth method returns the correct data", async () => {
    const expectedData = { data: { count: 30 } };
    const mockedGet = axios.get.mockResolvedValueOnce(expectedData);

    const actualData = await PostService.getHealth();
    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3002/api/countPostsByTopic/Health"
    );
    expect(actualData).toEqual(expectedData);
  });

  test("6. Test if the getRec method returns the correct data", async () => {
    const expectedData = { data: { count: 40 } };
    const mockedGet = axios.get.mockResolvedValueOnce(expectedData);

    const actualData = await PostService.getRec();
    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3002/api/countPostsByTopic/Recommendation"
    );
    expect(actualData).toEqual(expectedData);
  });

  test("7. Test if the getHair method returns the correct data", async () => {
    const expectedData = { data: { count: 50 } };
    const mockedGet = axios.get.mockResolvedValueOnce(expectedData);

    const actualData = await PostService.getHair();
    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3002/api/countPostsByTopic/Hair"
    );
    expect(actualData).toEqual(expectedData);
  });

  test("8. Test if the getSun method returns the correct data", async () => {
    const expectedData = { data: { count: 60 } };
    const mockedGet = axios.get.mockResolvedValueOnce(expectedData);

    const actualData = await PostService.getSun();
    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3002/api/countPostsByTopic/Sun"
    );
    expect(actualData).toEqual(expectedData);
  });

  test("9. Test if the getPerfumes  method returns the correct data", async () => {
    const expectedData = { data: { count: 70 } };
    const mockedGet = axios.get.mockResolvedValueOnce(expectedData);

    const actualData = await PostService.getPerfumes();
    expect(mockedGet).toHaveBeenCalledWith(
      "http://localhost:3002/api/countPostsByTopic/Perfumes"
    );
    expect(actualData).toEqual(expectedData);
  });
});
