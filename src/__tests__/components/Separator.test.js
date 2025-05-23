import React from 'react';
import { render } from '@testing-library/react';
import { HSeparator, VSeparator } from '../../components/Separator/Separator';
import '@testing-library/jest-dom';

describe('Separator Components', () => {
  test('HSeparator se rend avec les bons styles', () => {
    const { getByTestId } = render(<HSeparator data-testid="h-separator" />);
    const separator = getByTestId('h-separator');

    expect(separator).toBeInTheDocument();
    expect(separator).toHaveStyle({
      height: '1px',
      width: '100%',
      background: 'linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0) 100%)',
    });
  });

  test('VSeparator se rend avec les bons styles', () => {
    const { getByTestId } = render(<VSeparator data-testid="v-separator" />);
    const separator = getByTestId('v-separator');

    expect(separator).toBeInTheDocument();
    expect(separator).toHaveStyle({
      width: '1px',
      background: 'linear-gradient(0deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)',
    });
  });
});
