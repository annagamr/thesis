import axios from "../__mocks__/axios";
import Blog from "../components/blog/blog";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import postService from "../services/post.service";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";

jest.mock("../services/post.service");

describe("Blog component", () => {
  beforeEach(() => {
    postService.getAllPosts = jest
      .fn()
      .mockResolvedValue({ data: { allPosts: [] } });
    postService.getSkincare = jest
      .fn()
      .mockResolvedValue({ data: { count: 0 } });
    postService.getMakeUp = jest.fn().mockResolvedValue({ data: { count: 0 } });
    postService.getHealth = jest.fn().mockResolvedValue({ data: { count: 0 } });
    postService.getRec = jest.fn().mockResolvedValue({ data: { count: 0 } });
    postService.getHair = jest.fn().mockResolvedValue({ data: { count: 0 } });
    postService.getSun = jest.fn().mockResolvedValue({ data: { count: 0 } });
    postService.getPerfumes = jest
      .fn()
      .mockResolvedValue({ data: { count: 0 } });
    jest.clearAllMocks();
  });

  test("Renders the Blog component without error", async () => {
    await act(async () => {
      render(<Blog />);
    });

    const blogContainer = await screen.findByTestId("blog-posts-container");
    expect(blogContainer).not.toBeNull();
  });

  test("renders categories", async () => {
    await act(async () => {
      render(<Blog />);
    });

    const categories = [
      "Skin Care",
      "Make up",
      "Health & Beauty",
      "Product Recommendation",
      "Hair & Hair Products",
      "Sun & Tanning",
      "Perfumes",
    ];
    categories.forEach((category) => {
      const categoryElement = screen.getByText(new RegExp(category));
      expect(categoryElement).toBeInTheDocument();
    });
  });

  test("renders blog posts", async () => {
    const mockPosts = [
      {
        id: "1",
        title: "Test Post 1",
        description: "Test description 1",
        topic: "Test topic 1",
        author: "Test author 1",
        created: "2023-04-30",
      },
    ];

    postService.getAllPosts.mockResolvedValue({
      data: { allPosts: mockPosts },
    });

    await act(async () => {
      render(<Blog />);
    });

    const postTitle = await screen.findByText("Test Post 1");
    expect(postTitle).toBeInTheDocument();
  });
  test("renders create post form for admin or seller", async () => {
    await act(async () => {
      render(<Blog user={{ roles: ["ROLE_SELLER"] }} />);
    });
    const createPostTitle = await screen.findByTestId("createButton");
    expect(createPostTitle).toBeInTheDocument();
  });

  test("submits create post form", async () => {
    // Mock the axios.post function to return a fake post object
    axios.post.mockResolvedValue({
      data: {
        post: {
          title: "Test Title",
          description: "Test Description. ".repeat(50),
          topic: "Make-up",
          author: "Test Author",
        },
      },
    });

    render(<Blog user={{ roles: ["ROLE_ADMIN"] }} />);

    // Fill in the form fields with example data
    fireEvent.change(screen.getByTestId("Title"), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByTestId("Description"), {
      target: { value: "Test Description. ".repeat(50) },
    });
    fireEvent.change(screen.getByTestId("Topic"), {
      target: { value: "Make-up" },
    });

    const createPostButton = screen.getByText("Add Post");

    await act(async () => {
      fireEvent.click(createPostButton);
    });

    // Use waitFor to wait for async calls to finish
    await waitFor(() => expect(axios.post).toHaveBeenCalled());

    // Reset the mock after the test is done
    axios.post.mockReset();
  });
  test("does not render the create post form for users without 'ROLE_SELLER' or 'ROLE_ADMIN'", async () => {
    await act(async () => {
      render(<Blog user={{ roles: ["ROLE_USER"] }} />);
    });

    const createPostForm = screen.queryByTestId("createButton");
    expect(createPostForm).toBeNull();
  });

  test("renders the correct number of posts", async () => {
    const mockPosts = [
      {
        id: "1",
        title: "Test Post 1",
        description: "Test description 1",
        topic: "Test topic 1",
        author: "Test author 1",
        created: "2023-04-30",
      },
      {
        id: "2",
        title: "Test Post 2",
        description: "Test description 2",
        topic: "Test topic 2",
        author: "Test author 2",
        created: "2023-04-29",
      },
      {
        id: "3",
        title: "Test Post 3",
        description: "Test description 3",
        topic: "Test topic 3",
        author: "Test author 3",
        created: "2023-04-28",
      },
    ];

    postService.getAllPosts.mockResolvedValue({
      data: { allPosts: mockPosts },
    });

    await act(async () => {
      render(<Blog />);
    });

    const blogPosts = await screen.findAllByTestId("blog-post");
    expect(blogPosts.length).toEqual(mockPosts.length);
  });

  test("fetches the skincare count and updates the skin state", async () => {
    const mockSkinCount = 5;
    postService.getSkincare.mockResolvedValue({
      data: { count: mockSkinCount },
    });

    render(<Blog user={null} />);

    await waitFor(() => {
      expect(postService.getSkincare).toHaveBeenCalled();
    });

    const skinCountElement = screen.getByText(`Skin Care (${mockSkinCount})`, {
      exact: false,
    });
    expect(skinCountElement).toBeInTheDocument();
  });

  test("fetches the makeup count and updates the makeup state", async () => {
    const mockMakeUpCount = 5;
    postService.getMakeUp.mockResolvedValue({
      data: { count: mockMakeUpCount },
    });

    render(<Blog user={null} />);

    await waitFor(() => {
      expect(postService.getMakeUp).toHaveBeenCalled();
    });

    const skinCountElement = screen.getByText(`Make Up (${mockMakeUpCount})`, {
      exact: false,
    });
    expect(skinCountElement).toBeInTheDocument();
  });

  test("handles errors when fetching skincare count", async () => {
    const errorMessage =
      "An error occurred while fetching skincare posts number.";
    postService.getSkincare.mockRejectedValue(
      new Error("Error fetching skincare count")
    );

    render(<Blog user={null} />);

    await waitFor(() => {
      expect(postService.getSkincare).toHaveBeenCalled();
    });

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  test("handles errors when fetching makeup count", async () => {
    const errorMessage =
      "An error occurred while fetching make up posts number.";
    postService.getMakeUp.mockRejectedValue(
      new Error("Error fetching makeup count")
    );

    render(<Blog user={null} />);

    await waitFor(() => {
      expect(postService.getMakeUp).toHaveBeenCalled();
    });

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  test("handles errors when fetching health count", async () => {
    const errorMessage =
      "An error occurred while fetching health posts number.";
    postService.getHealth.mockRejectedValue(
      new Error("Error fetching health count")
    );

    render(<Blog user={null} />);

    await waitFor(() => {
      expect(postService.getHealth).toHaveBeenCalled();
    });

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  test("handles errors when fetching recommendation count", async () => {
    const errorMessage =
      "An error occurred while fetching recommendation posts number.";
    postService.getRec.mockRejectedValue(
      new Error("Error fetching recommendation count")
    );

    render(<Blog user={null} />);

    await waitFor(() => {
      expect(postService.getRec).toHaveBeenCalled();
    });

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  test("handles errors when fetching sun count", async () => {
    const errorMessage = "An error occurred while fetching sun posts number.";
    postService.getSun.mockRejectedValue(new Error("Error fetching sun count"));

    render(<Blog user={null} />);

    await waitFor(() => {
      expect(postService.getSun).toHaveBeenCalled();
    });

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });
});
