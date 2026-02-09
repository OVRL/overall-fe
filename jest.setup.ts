import "@testing-library/jest-dom";

// 1. IntersectionObserver Mock
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: jest.fn(),
}));

// 2. URL.createObjectURL Mock
global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
