//https://rjzaworski.com/2019/10/event-emitters-in-typescript

import { SimpleSearch } from './examples/SimpleSearch.project';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  // const t: WeirdChar = new WeirdChar();
  const t = new SimpleSearch();
  await t.run();
})();
