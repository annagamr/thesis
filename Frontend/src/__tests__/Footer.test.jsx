import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/footer/footer';
import '@testing-library/jest-dom/extend-expect';


describe('Footer component', () => {
  test('Renders footer with company name and year', () => {
    render(<Footer />);
    const companyName = screen.getByText(/aurora inc./i);
    const currentYear = new Date().getFullYear();
    const yearText = screen.getByText(new RegExp(currentYear));
    expect(companyName).toBeInTheDocument();
    expect(yearText).toBeInTheDocument();
  });
});