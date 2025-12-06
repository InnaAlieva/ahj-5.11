import ShowPopover from '../engine/showPopover';
import app from '../app';

jest.mock('../engine/showPopover');

beforeEach(() => {
  ShowPopover.mockClear();
});

test('new ShowPopover wont be created automatically', () => {
  expect(ShowPopover).not.toHaveBeenCalled();
});

test('app() should create new ShowPopover', () => {
  app();
  expect(ShowPopover).toHaveBeenCalledTimes(1);
});

test('app() should call method init', () => {
  expect(ShowPopover).not.toHaveBeenCalled();
  app();
  expect(ShowPopover).toHaveBeenCalledTimes(1);

  const showPopoverInstance = ShowPopover.mock.instances[0];
  const mockInit = showPopoverInstance.init;

  expect(mockInit).toHaveBeenCalledTimes(1);
});
