import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';


test('renders button with text', () => {
  render(<Button text="Click Me" />);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
