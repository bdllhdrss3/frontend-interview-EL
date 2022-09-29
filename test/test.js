/// <reference types="@types/jest" />
import "@testing-library/jest-dom/extend-expect"
import { fireEvent, getAllByText, getByPlaceholderText, getByText, queryByText } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import jsdom, { JSDOM } from "jsdom"
import path from "path"
import Storage from 'dom-storage';

global.setImmediate = global.setTimeout;

const TODOS_KEY = 'todos-vanillajs';
const CATEGORIES_KEY = 'todos-vanillajs_categories';

const BASE = path.resolve(__dirname, "../")

let virtualConsole
let dom;
let body;

describe("ToDo List", () => {
  let getItemSpy;
  let setItemSpy;

  beforeEach(async () => {
    virtualConsole = new jsdom.VirtualConsole()
    virtualConsole.on("error", console.error)
    virtualConsole.on("jsdomError", console.error);

    dom = await JSDOM.fromFile(`${BASE}/index.html`, {
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true,
      virtualConsole
    })

    const mockedLocalStorage = new Storage(null, { strict: true });
    Object.defineProperty(dom.window, 'localStorage', { value: mockedLocalStorage });

    getItemSpy = jest.spyOn(dom.window.localStorage, 'getItem');
    setItemSpy = jest.spyOn(dom.window.localStorage, 'setItem');

    await loadDom(dom)
    body = dom.window.document.body
  });

  afterEach(() => {
    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });

  function addTask(title = 'Test Task', category = 'Test Category') {
    const header = body.querySelector('.header');
    const titleInput = header.querySelector('.new-todo');
    const categoryInput = getByPlaceholderText(header, /Category/);

    fireEvent.change(titleInput, { target: { value: title } });
    fireEvent.change(categoryInput, { target: { value: category } });

    userEvent.keyboard('{enter}')
  }

  function deleteTask() {
    const tasksList = body.querySelector('.todo-list');

    setItemSpy.mockClear();
    const item = queryByText(tasksList, /Test Task/).closest('.view');
    fireEvent.click(item.querySelector('.destroy'));
  }

  it(`should define "${CATEGORIES_KEY}" key in localStorage`, async () => {
    addTask();

    const categories = dom.window.localStorage.getItem(CATEGORIES_KEY);

    expect(categories).toBeTruthy();
  });

  it('should have Category input', async () => {
    const header = body.querySelector('.header');
    const input = getByPlaceholderText(header, /Category/);

    expect(input).toBeDefined();
    expect(input).toBeInstanceOf(dom.window.HTMLInputElement);
  });

  it('should create a task with a category', async () => {
    const tasksList = body.querySelector('.todo-list');

    addTask();

    expect(getByText(tasksList, /Test Task/)).toBeInTheDocument();
    expect(getByText(tasksList, /Test Category/)).toBeInTheDocument();
  });

  it('should save category to localStorage', async () => {
    addTask();

    expect(setItemSpy).toHaveBeenCalledWith(CATEGORIES_KEY, expect.stringMatching(/Test Category/));
  });

  it('should not create a task if title is empty', async () => {
    const header = body.querySelector('.header');
    const categoryInput = getByPlaceholderText(header, /Category/);
    const tasksList = body.querySelector('.todo-list');

    fireEvent.change(categoryInput, { target: { value: 'Test Category' } });

    userEvent.keyboard('{enter}')

    expect(queryByText(tasksList, /Test Task/)).not.toBeInTheDocument();
    expect(queryByText(tasksList, /Test Category/)).not.toBeInTheDocument();
  });

  it('should not create a task if category is empty', async () => {
    const header = body.querySelector('.header');
    const titleInput = header.querySelector('.new-todo');
    const tasksList = body.querySelector('.todo-list');

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });

    userEvent.keyboard('{enter}')

    expect(queryByText(tasksList, /Test Task/)).not.toBeInTheDocument();
    expect(queryByText(tasksList, /Test Category/)).not.toBeInTheDocument();
  });

  it('should delete a task', async () => {
    const tasksList = body.querySelector('.todo-list');

    addTask();
    deleteTask();

    expect(queryByText(tasksList, /Test Task/)).not.toBeInTheDocument();
    expect(queryByText(tasksList, /Test Category/)).not.toBeInTheDocument();
  });

  it('should delete a task from local storage', async () => {
    addTask();
    deleteTask();

    const tasks = dom.window.localStorage.getItem(TODOS_KEY);

    expect(tasks.match(/Test Task/g)).toBeNull();
    expect(setItemSpy).toHaveBeenCalledWith(TODOS_KEY, "[]");
  });

  it('should delete a category without tasks from local storage', async () => {
    addTask();
    deleteTask();

    const categories = dom.window.localStorage.getItem(CATEGORIES_KEY);

    expect(categories.match(/Test Category/g)).toBeNull();
    expect(setItemSpy).toHaveBeenCalledWith(CATEGORIES_KEY, "[]");
  });

  it('should reuse the same category', async () => {
    addTask();
    addTask();

    const tasks = dom.window.localStorage.getItem(TODOS_KEY);
    const categories = dom.window.localStorage.getItem(CATEGORIES_KEY);

    expect(tasks.match(/Test Task/g)).toHaveLength(2);
    expect(categories.match(/Test Category/g)).toHaveLength(1);
  });

  it('should not support multiple categories', async () => {
    addTask('Test Task', 'Category With Multiple Spaces');

    const categories = dom.window.localStorage.getItem(CATEGORIES_KEY);

    expect(JSON.parse(categories)).toHaveLength(1);
  });

  it('should suggest already added categories', async () => {
    addTask('Test Task', 'First Category');
    const header = body.querySelector('.header');
    const categoryInput = getByPlaceholderText(header, /Category/);

    fireEvent.change(categoryInput, { target: { value: 'First' } });
    categoryInput.focus();

    expect(getByText(header, /First Category/)).toBeInTheDocument();
  });

  it('should suggest categories without duplicates', async () => {
    addTask('Test Task', 'First Category');
    addTask('Test Task #2', 'First Category');
    const header = body.querySelector('.header');
    const categoryInput = getByPlaceholderText(header, /Category/);

    fireEvent.change(categoryInput, { target: { value: 'First' } });
    categoryInput.focus();

    expect(getAllByText(header, /First Category/)).toHaveLength(1);
  });
});

function loadDom(dom) {
  return new Promise((resolve) => {
    virtualConsole.on("log", log => {
      if (log === "DOM Loaded") resolve(dom)
    })
  })
}
