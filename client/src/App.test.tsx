import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Мокаем axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    mockedAxios.post.mockResolvedValue({ data: { id: 1, title: 'Test Todo' } });
    mockedAxios.delete.mockResolvedValue({});
  });

  it('renders To-Do List heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/To-Do List/i);
    expect(headingElement).toBeInTheDocument();
  });

  it('adds a new todo', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Название задачи/i);
    const button = screen.getByText(/Добавить задау/i);

    fireEvent.change(input, { target: { value: 'Test Todo' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Test Todo/i)).toBeInTheDocument();
    });
  });

  it('deletes a todo', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ id: 1, title: 'Test Todo' }],
    });

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Test Todo/i)).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText(/Test Todo/i)).not.toBeInTheDocument();
    });
  });
});
