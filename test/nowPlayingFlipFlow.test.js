const React = require('react');
const TestRenderer = require('react-test-renderer');
const { Text, Animated } = require('react-native');
const App = require('../App.tsx').default;

const { act } = TestRenderer;

function getTextContent(node) {
  return node.children
    .map((child) => (typeof child === 'string' ? child : getTextContent(child)))
    .join('');
}

function expectTextPresent(root, value) {
  expect(root.findAll((node) => node.type === Text && getTextContent(node) === value).length).toBeGreaterThan(0);
}

function expectTextAbsent(root, value) {
  expect(root.findAll((node) => node.type === Text && getTextContent(node) === value)).toHaveLength(0);
}

function findPressableByText(root, value) {
  return root.find(
    (node) =>
      typeof node.props?.onPress === 'function' &&
      node.findAll((child) => child.type === Text && getTextContent(child) === value).length > 0,
  );
}

describe('App now playing flip completion', () => {
  const originalTiming = Animated.timing;

  beforeEach(() => {
    jest.useFakeTimers();
    Animated.timing = jest.fn((value, config) => ({
      start: (callback) => {
        setTimeout(() => {
          value.setValue(typeof config.toValue === 'number' ? config.toValue : 0);
          callback?.({ finished: true });
        }, config.duration ?? 0);
      },
      stop: jest.fn(),
      reset: jest.fn(),
    }));
  });

  afterEach(() => {
    Animated.timing = originalTiming;
    jest.useRealTimers();
  });

  it('keeps the rendered title and meta paired through forward flip completion, then settles them together on Side B', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(React.createElement(App));
    });

    const root = renderer.root;

    act(() => {
      findPressableByText(root, 'Rearview').props.onPress();
    });

    expectTextPresent(root, 'Rearview');
    expectTextPresent(root, 'Static Bloom • 04:08');

    act(() => {
      findPressableByText(root, 'flip').props.onPress();
    });

    expectTextPresent(root, 'Rearview');
    expectTextPresent(root, 'Static Bloom • 04:08');
    expectTextPresent(root, 'flipping side b…');

    act(() => {
      jest.advanceTimersByTime(325);
    });

    expectTextPresent(root, 'Side B');
    expectTextPresent(root, 'City Glow');
    expectTextPresent(root, 'June Motel • 03:12');
    expectTextPresent(root, 'side a');
    expectTextAbsent(root, 'flipping side a…');
    expectTextPresent(root, 'Side A queue');
    expectTextPresent(root, 'Rearview');
    expectTextAbsent(root, 'Side B queue');

    act(() => {
      jest.advanceTimersByTime(325);
    });

    expectTextPresent(root, 'Headlights Low');
    expectTextPresent(root, 'Mara Vale • 03:47');
    expectTextAbsent(root, 'flipping side a…');
    expectTextPresent(root, 'side b');
    expectTextPresent(root, 'Side B queue');
    expectTextPresent(root, 'Parking Lot Stars');
    expectTextPresent(root, 'flip');
  });

  it('keeps the rendered title and meta paired through reverse flip completion, then settles them together on Side A', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(React.createElement(App));
    });

    const root = renderer.root;

    act(() => {
      findPressableByText(root, 'flip').props.onPress();
    });

    act(() => {
      jest.advanceTimersByTime(700);
    });

    expectTextPresent(root, 'Headlights Low');
    expectTextPresent(root, 'Mara Vale • 03:47');

    act(() => {
      findPressableByText(root, 'flip').props.onPress();
    });

    expectTextPresent(root, 'Headlights Low');
    expectTextPresent(root, 'Mara Vale • 03:47');
    expectTextPresent(root, 'flipping side a…');

    act(() => {
      jest.advanceTimersByTime(325);
    });

    expectTextPresent(root, 'Side A');
    expectTextPresent(root, 'Headlights Low');
    expectTextPresent(root, 'Mara Vale • 03:47');
    expectTextPresent(root, 'flipping side a…');
    expectTextAbsent(root, 'flipping side b…');
    expectTextPresent(root, 'side b');
    expectTextPresent(root, 'Side B queue');
    expectTextPresent(root, 'Parking Lot Stars');
    expectTextAbsent(root, 'Side A queue');

    act(() => {
      jest.advanceTimersByTime(325);
    });

    expectTextPresent(root, 'City Glow');
    expectTextPresent(root, 'June Motel • 03:12');
    expectTextAbsent(root, 'flipping side b…');
    expectTextPresent(root, 'side a');
    expectTextPresent(root, 'Side A queue');
    expectTextPresent(root, 'Rearview');
    expectTextPresent(root, 'flip');
  });
});
