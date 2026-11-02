import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.js';

describe('App Component', () => {
  it('renders the PopQueue header brand and initial login route', async () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /popqueue/i, level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText(/Art Toy Live Unboxing Queue Management System/i),
    ).toBeInTheDocument();
  });
});
