/**
 * skenario pengujian
 *
 * - LoginInput form
 *   - should show the email field, the password field and the submit button
 *   - should keep what is typed in the email field
 *   - should keep what is typed in the password field
 *   - should call login function once with both typed values when the form is submitted
 */
import React from 'react';
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import LoginInput from './LoginInput';

expect.extend(matchers);

function renderLoginInput(login = () => {}) {
  return render(
    <MemoryRouter>
      <LoginInput login={login} />
    </MemoryRouter>,
  );
}

describe('LoginInput form', () => {
  afterEach(() => {
    cleanup();
  });

  it('should show the email field, the password field and the submit button', () => {
    // arrange
    renderLoginInput();

    // assert
    expect(screen.getByLabelText('Email')).toBeVisible();
    expect(screen.getByLabelText('Kata sandi')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeVisible();
  });

  it('should keep what is typed in the email field', async () => {
    // arrange
    renderLoginInput();
    const emailInput = screen.getByLabelText('Email');

    // action
    await userEvent.type(emailInput, 'tester@example.test');

    // assert
    expect(emailInput).toHaveValue('tester@example.test');
  });

  it('should keep what is typed in the password field', async () => {
    // arrange
    renderLoginInput();
    const passwordInput = screen.getByLabelText('Kata sandi');

    // action
    await userEvent.type(passwordInput, 'rahasia');

    // assert
    expect(passwordInput).toHaveValue('rahasia');
  });

  it('should call login function once with both typed values when the form is submitted', async () => {
    // arrange
    const loginSpy = vi.fn();
    renderLoginInput(loginSpy);
    await userEvent.type(screen.getByLabelText('Email'), 'tester@example.test');
    await userEvent.type(screen.getByLabelText('Kata sandi'), 'rahasia');

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    // assert
    expect(loginSpy).toHaveBeenCalledTimes(1);
    expect(loginSpy).toHaveBeenCalledWith({
      email: 'tester@example.test',
      password: 'rahasia',
    });
  });
});
