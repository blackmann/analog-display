import { JSDOM } from "jsdom";
import AnalogScreen from "./analog-screen";

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

describe("AnalogScreen", () => {
  describe("normalize pixels", () => {
    it("should be correct", () => {
      const screen = new AnalogScreen({ blockHeight: 3 });

      const res = screen.normalizePixels([
        [
          [1, 0, 1],
          [0, 1, 0],
          [1, 0, 1],
        ],
        [
          [1, 0, 1],
          [0, 1, 0],
          [1, 0, 1],
        ],
      ]);

      expect(res.length).toBe(3);
      expect(res).toStrictEqual([
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
      ]);
    });
  });
});
