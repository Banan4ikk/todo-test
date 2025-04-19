import { describe, it, expect, beforeEach, afterEach, vi, MockInstance } from 'vitest';
import {render, screen, fireEvent, waitFor, cleanup} from '@testing-library/react';
import axios from 'axios';
import App from "./App";

vi.mock('axios');

// Типизированные моки
const mockedAxios = {
  get: vi.fn() as MockInstance<typeof axios.get>,
  post: vi.fn() as MockInstance<typeof axios.post>,
  delete: vi.fn() as MockInstance<typeof axios.delete>,
};

// Мокаем axios перед каждым тестом
beforeEach(() => {
  (axios.get as unknown as typeof mockedAxios.get) = mockedAxios.get;
  (axios.post as unknown as typeof mockedAxios.post) = mockedAxios.post;
  (axios.delete as unknown as typeof mockedAxios.delete) = mockedAxios.delete;
  mockedAxios.post.mockResolvedValue({ data: {} })});

afterEach(() => {
  cleanup();
});

describe('App Component', () => {
  const mockTodos = [
    { id: 1, title: 'Купить молоко' },
    { id: 2, title: 'Сделать домашку' },
  ];

  beforeEach(() => {
    mockedAxios.get.mockReset().mockResolvedValue({ data: mockTodos });
    mockedAxios.post.mockReset();
    mockedAxios.delete.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('1. Загружает и отображает заголовок и список задач', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /To-Do List/i })).to.exist;

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Купить молоко')).to.exist;
      expect(screen.getByText('Сделать домашку')).to.exist;
    });
  });

  it('2. Успешно добавляет новую задачу', async () => {
    const { default: App } = await import('./App');
    const newTask = 'Новая задача';

    mockedAxios.post.mockResolvedValue({ data: { id: 3, title: newTask } });

    render(<App />);

    const input = screen.getByPlaceholderText('Название задачи') as HTMLInputElement;
    const addButton = screen.getByText('Добавить задачу');

    fireEvent.change(input, { target: { value: newTask } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(expect.stringContaining('/api/todos'), {
        title: newTask,
      });
      expect(input.value).to.equal('');
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: [...mockTodos, { id: 3, title: newTask }],
    });

    await waitFor(() => {
      expect(screen.getByText(newTask)).to.be.not.null;
    });
  });

  it('3. Удаляет задачу', async () => {
    const { default: App } = await import('./App');

    mockedAxios.delete.mockResolvedValue({});

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Купить молоко')).to.be.not.null;
    });

    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(expect.stringContaining('/api/todos/1'));
    });

    await waitFor(() => {
      expect(screen.queryByText('Купить молоко')).to.be.null;
    });
  });

  it('4. Обрабатывает ошибку при загрузке задач', async () => {
    const { default: App } = await import('./App');

    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
    });

    consoleSpy.mockRestore();
  });

});
