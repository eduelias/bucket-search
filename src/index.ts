import { Test1 } from './projects/Test1.project';

//https://rjzaworski.com/2019/10/event-emitters-in-typescript

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  const t: Test1 = new Test1();
  await t.run();
})();
