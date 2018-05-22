import { parseStackTrace } from '.';

describe('parseStacktrace', () => {
  it('should correlty parse a stack trace', () => {
    const fixture =
      'Error: 0\n    at MapSubscriber.project (http://localhost:1337/main.js:641:19)\n    at MapSubscriber.push.../node_modules/rxjs/_esm5/internal/operators/map.js.MapSubscriber._next (http://localhost:1337/vendor.js:61785:35)\n    at MapSubscriber.push.../node_modules/rxjs/_esm5/internal/Subscriber.js.Subscriber.next (http://localhost:1337/vendor.js:53584:12)\n    at Wrapper.push.../packages/core/src/patch/subscribe.ts.Wrapper._next (http://localhost:1337/main.js:230:51)\n    at Wrapper.push.../node_modules/rxjs/_esm5/internal/Subscriber.js.Subscriber.next (http://localhost:1337/vendor.js:53584:12)\n    at TakeSubscriber.push.../node_modules/rxjs/_esm5/internal/operators/take.js.TakeSubscriber._next (http://localhost:1337/vendor.js:65380:30)\n    at TakeSubscriber.push.../node_modules/rxjs/_esm5/internal/Subscriber.js.Subscriber.next (http://localhost:1337/vendor.js:53584:12)\n    at Wrapper.push.../packages/core/src/patch/subscribe.ts.Wrapper._next (http://localhost:1337/main.js:230:51)\n    at Wrapper.push.../node_modules/rxjs/_esm5/internal/Subscriber.js.Subscriber.next (http://localhost:1337/vendor.js:53584:12)\n    at AsyncAction.dispatch [as work] (http://localhost:1337/vendor.js:56400:14)';
    expect(parseStackTrace(fixture)).toMatchSnapshot();
  });
});
