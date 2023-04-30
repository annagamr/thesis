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

  test('renders blog posts', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post 1',
        description: 'Test description 1',
        topic: 'Test topic 1',
        author: 'Test author 1',
        created: '2023-04-30',
      },
    ];

    postService.getAllPosts.mockResolvedValue({ data: { allPosts: mockPosts } });

    await act(async () => {
      render(<Blog />);
    });

    const postTitle = await screen.findByText('Test Post 1');
    expect(postTitle).toBeInTheDocument();
  });
  test("renders create post form for admin or seller", async () => {
    await act(async () => {
      render(<Blog user={{ roles: ['ROLE_SELLER'] }} />);
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
});
