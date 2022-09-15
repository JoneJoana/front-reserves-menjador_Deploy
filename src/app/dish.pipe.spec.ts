import { DishPipe } from './dish.pipe';

describe('DishPipe', () => {
  it('create an instance', () => {
    const pipe = new DishPipe();
    expect(pipe).toBeTruthy();
  });
});
