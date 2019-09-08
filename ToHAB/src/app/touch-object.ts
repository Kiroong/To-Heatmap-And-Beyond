import { distToSegment } from 'src/utils';

/*
export interface ITouchObject {
  beep: any;
  tts: any;
  notify: any;
  collide: any;
  beepSpec?: any;
  vibrationSpec?: any;
  ttsSpec?: any;
  [key: string]: any;
}

export class TouchCircle implements ITouchObject {
  type: string;
  style: any;
  constructor(
    public beep: any,
    public tts: any,
    public cx: number,
    public cy: number,
    public r: number,
    public beepSpec: any = null,
    public vibrationSpec: any = null,
    public ttsSpec: any = null,
  ) {
    this.type = 'circle';
    this.style = {
      fill: (this.beepSpec && this.beepSpec.pitch) ? 'black' : 'transparent'
    };
  }

  notify() {
    if (this.beepSpec) {
      this.beep(this.beepSpec.volume, this.beepSpec.pitch, this.beepSpec.duration);
    }
    if (this.vibrationSpec) {
      window.navigator.vibrate(this.vibrationSpec.pattern);
    }
    if (this.ttsSpec) {
      this.tts(this.ttsSpec.text);
    }
  }

  collide(x: number, y: number) {
    return Math.pow(this.cx - x, 2) + Math.pow(this.cy - y, 2) <= Math.pow(this.r, 2);
  }

}

export class TouchLine implements ITouchObject {
  type: string;
  style: any;
  constructor(
    public beep: any,
    public tts: any,
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number,
    public beepSpec: any,
    public vibrationSpec: any,
    public ttsSpec: any
  ) {
    this.type = 'line';
    this.style = {
      fill: (this.beepSpec && this.beepSpec.pitch) ? 'black' : 'transparent'
    };
  }
  notify() {
    if (this.beepSpec) {
      this.beep(this.beepSpec.volume, this.beepSpec.pitch, this.beepSpec.duration);
    }
    if (this.vibrationSpec) {
      window.navigator.vibrate(this.vibrationSpec.pattern);
    }
    if (this.ttsSpec) {
      this.tts(this.ttsSpec.text);
    }
  }
  collide(x: number, y: number) {
    return distToSegment({x: x, y: y}, {x: this.x1, y: this.y1}, {x: this.x2, y: this.y2}) <= 3;
  }
}
*/


export class VirtualTouchCell {
  type: 'meta' | 'row' | 'col' | 'data';
  i: number;
  j: number;
}

export class TouchCell extends VirtualTouchCell {
  type: 'meta' | 'row' | 'col' | 'data';
  x: number;
  y: number;
  w: number;
  h: number;
  i: number;
  j: number;
  value: number | string;

  constructor(
    public info: any
  ) {
    super();
    Object.assign(this, info);
  }

  collide(x: number, y: number) {
    return this.x <= x && x <= this.x + this.w && this.y <= y && y <= this.y + this.h;
  }
}
