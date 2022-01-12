export const fontDefinition = {
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  B: [],
  C: [],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  F: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  G: [
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  H: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  I: [[1], [1], [1], [1], [1]],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  N: [
    [1, 0, 0, 1],
    [1, 1, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  R: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [" "]: Array.from({ length: 5 }, () => [0, 0]),
  ['!']: [[1],[1],[1],[0],[1]]
};

const PADDING_MULTIPLIER = 1.5;

export default class AnalogScreen {
  /**
   * @param {object} options
   * @param {HTMLCanvasElement} options.canvas
   */
  constructor({
    canvas,
    blockHeight = 5,
    font = fontDefinition,
    fps = 3,
    gutter = 2,
    pixelSize = 8,
    width = 24,
  } = {}) {
    if (!canvas) {
      canvas = document.createElement("canvas");

      const _width = width * pixelSize + (width - 1) * gutter;
      const _height = blockHeight * pixelSize + (blockHeight - 1) * gutter;

      canvas.width = _width;
      canvas.height = _height;

      document.body.appendChild(canvas);
    }

    this.canvas = canvas;
    this.blockHeight = blockHeight;
    this.font = font;
    this.fps = fps;
    this.gutter = gutter;
    this.pixelSize = pixelSize;
    this.width = width;

    this.pixelOffset = 0;
  }

  #calculateTextWidth() {
    return this.buffer[0].length;
  }

  drawPixels(pixels) {
    const ctx = this.canvas.getContext("2d");

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    pixels.forEach((row, index) => {
      const y = index * this.pixelSize + this.gutter * index;

      for (let i = 0; i < this.width; i++) {
        const c = i + this.pixelOffset;
        const pixel = row[c] || 0;

        ctx.fillStyle = pixel ? "#777" : "#eee";

        ctx.beginPath();
        ctx.rect(
          i * this.pixelSize + i * this.gutter,
          y,
          this.pixelSize,
          this.pixelSize
        );
        ctx.fill();
        ctx.closePath();
      }
    });
  }

  /**
   * @param {number[][][]} pixels
   */
  normalizePixels(pixels) {
    const rows = Array.from({ length: this.blockHeight }, () => []);

    // `row` is a letter block in the form
    // --         --
    // | [1, 0, 1] |
    // | [0, 1, 0] |
    // | [1, 0, 1] |
    // --         --
    // this forms the letter x
    return pixels.reduce((prev, row) => {
      // adding the extra space even at the end of a line
      // wont matter
      row.forEach((l, i) => prev[i].push(...l, 0));

      return prev;
    }, rows);
  }

  render() {
    if (this.#calculateTextWidth() > this.width) {
      this.renderId = setInterval(() => {
        this.pixelOffset = (this.pixelOffset + 1) % this.width;
        this.drawPixels(this.buffer);
      }, 1000 / this.fps);
    } else {
      this.drawPixels(this.buffer);
    }

    return this.stop.bind(this);
  }

  setText(text) {
    this.stop();
    this.text = text;
    this.buffer = this.normalizePixels(
      this.text
        .split("")
        .map((t) => this.font[t] || Array.from({ length: 5 }, () => []))
    );
  }

  stop() {
    this.pixelOffset = 0;
    clearInterval(this.renderId);
  }
}
