import axios from "axios";
import Blog from "../components/blog/blog";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import postService from "../services/post.service";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import UserContext from "../components/boards/UserContext";
import { BrowserRouter } from "react-router-dom";

const defaultUserContext = {
  showSellerBoard: false,
  setShowSellerBoard: jest.fn(),
  showAdminBoard: false,
  setShowAdminBoard: jest.fn(),
  showUserBoard: false,
  setShowUserBoard: jest.fn(),
  currentUser: null,
  setCurrentUser: jest.fn(),
  logOut: jest.fn(),
};

const defaultUser = {
  username: "Test Author",
  accessToken: "fake-access-token",
};

jest.mock("../services/post.service");
jest.mock("axios");

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

  test("1. Renders the Blog component without error", async () => {
    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <Blog />
          </BrowserRouter>
        </UserContext.Provider>
      );
    });

    const blogContainer = await screen.findByTestId("blog-posts-container");
    expect(blogContainer).not.toBeNull();
  });

  test("2. Renders categories", async () => {
    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <Blog />
          </BrowserRouter>
        </UserContext.Provider>
      );
    });

    const categories = [
      "Skin Care",
      "Make up",
      "Health & Beauty",
      "Recommendations",
      "Hair & Hair Products",
      "Sun & Tanning",
      "Perfumes",
    ];
    categories.forEach((category) => {
      const categoryElement = screen.getByText(new RegExp(category));
      expect(categoryElement).toBeInTheDocument();
    });
  });

  test("3. Renders blog posts", async () => {
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
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <Blog />
          </BrowserRouter>
        </UserContext.Provider>
      );
    });

    const postTitle = await screen.findByText("Test Post 1");
    expect(postTitle).toBeInTheDocument();
  });

  test("4. Renders create post form for admin or seller", async () => {
    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <Blog user={{ roles: ["ROLE_SELLER"] }} />
          </BrowserRouter>
        </UserContext.Provider>
      );
    });
    const createPostTitle = await screen.findByTestId("createButton");
    expect(createPostTitle).toBeInTheDocument();
  });

  test("5. Submits create post form", async () => {
    // Mock the axios.post function to return a fake post object
    axios.post.mockResolvedValue({
      data: {
        message: "Post created successfully!",
        post: {
          title: "Test Title",
          description: "Test Description. ".repeat(50),
          topic: "Make-up",
          author: "Test Author",
        },
      },
    });

    render(
      <UserContext.Provider
        value={{ currentUser: defaultUser, logOut: jest.fn() }}
      >
        <BrowserRouter>
          <Blog user={{ username: "Test Author", roles: ["ROLE_ADMIN"] }} />
        </BrowserRouter>
      </UserContext.Provider>
    );

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

    // Check if the post creation was successful
    expect(screen.getByText("Post created successfully!")).toBeInTheDocument();

    // Reset the mock after the test is done
    axios.post.mockReset();
  });
});
