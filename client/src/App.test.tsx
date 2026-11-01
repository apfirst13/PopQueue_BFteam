import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.js';

describe('App Component', () => {
  it('renders the PopQueue placeholder header and status', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /popqueue/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Art Toy Live Unboxing Queue Management System/i)).toBeInTheDocument();
    expect(screen.getByText(/System Operational/i)).toBeInTheDocument();
  });
});
