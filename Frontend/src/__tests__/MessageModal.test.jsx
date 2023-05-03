import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import MessageModal from "../components/boards/MessageModal";


describe("Message Modal tests", () => {
  test("renders without crashing", () => {
    render(<MessageModal />);
  });

  test("1. displays the message and type when show is true", () => {
    const message = "Test message";
    const type = "error";

    render(<MessageModal show={true} message={message} type={type} />);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByTestId("modal-content")).toHaveClass(type);
  });

  test("2. does not display the message when show is false", () => {
    const message = "Test message";

    render(<MessageModal show={false} message={message} />);
    expect(screen.queryByText(message)).toBeNull();
  });

  test("3. calls onClose when the close button is clicked", () => {
    const onClose = jest.fn();
    const message = "Test message";

    render(<MessageModal show={true} message={message} onClose={onClose} />);
    fireEvent.click(screen.getByText("×"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
