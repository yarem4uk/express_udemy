import { mongo } from './mongo';

mongo(() => {
  console.log('hello');
});
