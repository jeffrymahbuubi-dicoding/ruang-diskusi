/**
 * skenario pengujian
 *
 * - RegisterInput component
 *   - should show the name, email and password fields and the submit button
 *   - should handle name, email and password typing correctly
 *   - should call register function once with the three typed values when the form is submitted
 *   - should show a link to the login page
 */
import React from 'react';
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import RegisterInput from './RegisterInput';

expect.extend(matchers);

function renderRegisterInput(register = () => {}) {
  return render(
    <MemoryRouter>
      <RegisterInput register={register} />
    </MemoryRouter>,
  );
}

describe('RegisterInput component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should show the name, email and password fields and the submit button', () => {
    // arrange
    renderRegisterInput();

    // assert
    expect(screen.getByLabelText('Nama')).toBeVisible();
    expect(screen.getByLabelText('Email')).toBeVisible();
    expect(screen.getByLabelText('Kata sandi')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Daftar' })).toBeVisible();
  });

  it('should handle name, email and password typing correctly', async () => {
    // arrange
    renderRegisterInput();
    const nameInput = screen.getByLabelText('Nama');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Kata sandi');

    // action
    await userEvent.type(nameInput, 'Penguji');
    await userEvent.type(emailInput, 'tester@example.test');
    await userEvent.type(passwordInput, 'rahasia');

    // assert
    expect(nameInput).toHaveValue('Penguji');
    expect(emailInput).toHaveValue('tester@example.test');
    expect(passwordInput).toHaveValue('rahasia');
  });

  it('should call register function once with the three typed values when the form is submitted', async () => {
    // arrange
    const mockRegister = vi.fn();
    renderRegisterInput(mockRegister);
    await userEvent.type(screen.getByLabelText('Nama'), 'Penguji');
    await userEvent.type(screen.getByLabelText('Email'), 'tester@example.test');
    await userEvent.type(screen.getByLabelText('Kata sandi'), 'rahasia');

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Daftar' }));

    // assert
    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Penguji',
      email: 'tester@example.test',
      password: 'rahasia',
    });
  });

  it('should show a link to the login page', () => {
    // arrange
    renderRegisterInput();

    // assert
    expect(screen.getByRole('link', { name: 'Masuk di sini' })).toHaveAttribute('href', '/login');
  });
});
