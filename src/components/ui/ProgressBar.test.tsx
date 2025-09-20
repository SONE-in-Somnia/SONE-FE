// src/components/ui/ProgressBar.test.tsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ProgressBar from './ProgressBar';

jest.useFakeTimers();

describe('ProgressBar', () => {
  it('should update progress over time', () => {
    const startTime = Date.now() / 1000;
    const endTime = startTime + 100;

    render(<ProgressBar startTime={startTime} endTime={endTime} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();

    // Initial progress should be 0%
    expect(progressBar).toHaveStyle('width: 0%');

    // Advance time by 50 seconds (50% progress)
    act(() => {
      jest.advanceTimersByTime(50000);
    });
    expect(progressBar).toHaveStyle('width: 50%');

    // Advance time by another 50 seconds (100% progress)
    act(() => {
      jest.advanceTimersByTime(50000);
    });
    expect(progressBar).toHaveStyle('width: 100%');
  });
});
