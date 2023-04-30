import '@testing-library/jest-dom';
import './suppress-warnings'

const noop = () => {};
Object.defineProperty(window, 'location', {
  writable: true,
  value: { ...window.location, assign: noop, reload: noop },
});