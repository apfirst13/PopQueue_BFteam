import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.js';

describe('App Component', () => {
  it('renders the PopQueue header brand and initial login route', async () => {
    // Deliberate failing check for Lab 5 Check C-02 (Failing PR Merge Block demonstration)
    expect(1).toBe(2);
    render(<App />);
    expect(screen.getByRole('heading', { name: /popqueue/i, level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText(/Art Toy Live Unboxing Queue Management System/i),
    ).toBeInTheDocument();
  });
});
