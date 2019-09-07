import { Injectable } from '@angular/core';
import { TouchCell } from './touch-object';
import { InteractionEvent, ToHABSwipeEvent, ToHABZoomEvent, ToHABDragEvent, ToHABModeChangeEvent, ToHABLockEvent } from './interaction-event';
import { SpeakingService } from './speaking.service';
import { ToHABData } from './tohab-data';

@Injectable({
  providedIn: 'root'
})
export class ToHABDataService {

  tohabData: ToHABData;
  callbacks;
  dragBuffer;
  previouslyPannedCell = null;


  constructor(
    private speakingService: SpeakingService
  ) {
    this.callbacks = {};
    this.tohabData = new ToHABData();
    this.dragBuffer = {
      dx: 0,
      dy: 0
    };
  }

  on(eventName: string, callback) {
    if (this.callbacks[eventName]) {
      this.callbacks[eventName].push(callback);
    } else {
      this.callbacks[eventName] = [callback];
    }
  }

  fireEvents(eventName: string, event: InteractionEvent) {
    this.callbacks[eventName].forEach(callback => callback(event));
  }

  get numRowCols() {
    return this.tohabData.numRowCols.bind(this.tohabData);
  }

  get updateDataPanelSize() {
    return this.tohabData.updateDataPanelSize.bind(this.tohabData);
  }

  get getCursorLocation() {
    return this.tohabData.getCursorLocation.bind(this.tohabData);
  }

  get getValue() {
    return this.tohabData.getValue.bind(this.tohabData);
  }

  onInteractionPan(cell: TouchCell) {
    if (cell === this.previouslyPannedCell) {
      return;
    }
    this.previouslyPannedCell = cell;
    this.tohabData.windowCursor.moveCursorToTouchCell(cell);
    this.fireEvents('update-cursor', this.tohabData.cursor);
    this.retrieveCellOutput(cell);
  }

  onInteractionSwipe(evt: ToHABSwipeEvent) {
    this.tohabData.windowCursor.moveCursorTo(evt.direction);
    this.fireEvents('update-cursor', this.tohabData.cursor);
  }

  onInteractionLock(evt: ToHABLockEvent) {
    console.log('onInteraction' + 'Lock');
  }

  onInteractionSingleTap(cell: TouchCell) {
    this.onInteractionPan(cell);
  }

  onInteractionDoubleTap(evt: InteractionEvent) {
    alert('double tap');
    console.log('onInteraction' + 'DoubleTap');
  }

  onInteractionThreeFingerSwipe(evt: ToHABModeChangeEvent) {
    this.tohabData.navigationMode = this.tohabData.navigationMode === 'primary' ? 'secondary' : 'primary';
    this.speakingService.read('Navigation mode is changed.');
  }

  onInteractionDrag(evt: ToHABDragEvent) {
    this.dragBuffer.dx += evt.dx;
    this.dragBuffer.dy += evt.dy;
    const {cellW, cellH} = this.tohabData.cellSize;
    if (this.dragBuffer.dx < -cellW) {
      this.tohabData.windowCursor.moveWindow('right', Math.floor(-this.dragBuffer.dx / cellW));
      this.fireEvents('update-values', {});
      this.dragBuffer.dx = 0;
    } else if (this.dragBuffer.dx > cellW) {
      this.tohabData.windowCursor.moveWindow('left', Math.floor(this.dragBuffer.dx / cellW));
      this.fireEvents('update-values', {});
      this.dragBuffer.dx = 0;
    }
    if (this.dragBuffer.dy < -cellH) {
      this.tohabData.windowCursor.moveWindow('down', Math.floor(-this.dragBuffer.dy / cellH));
      this.fireEvents('update-values', {});
      this.dragBuffer.dy = 0;
    } else if (this.dragBuffer.dy > cellH) {
      this.tohabData.windowCursor.moveWindow('up', Math.floor(this.dragBuffer.dy / cellH));
      this.fireEvents('update-values', {});
      this.dragBuffer.dy = 0;
    }
    if (evt.end) {
      this.dragBuffer = {
        dx: 0,
        dy: 0
      };
    }
  }

  onInteractionZoom(evt: ToHABZoomEvent) {
    this.tohabData.windowCursor.zoomWindow(evt.direction);
    this.fireEvents('update-heatmap', {});
  }

  retrieveCellOutput(cell: TouchCell) {
    const value = this.getValue(cell).value;
    window.navigator.vibrate(1000);
    if (this.tohabData.navigationMode === 'primary') {
      this.speakingService.read(value + '');
    } else {
      this.speakingService.beep(10, cell.type === 'data' ? value as number : 150, 150);
    }
  }


}

  /*
    {volume: 10, color: headerColor, stroke: 'rgb(88,88,88)', pitch: 220, duration: 150})
  );
  */
  /*
  private makeRect(x, y, w, h, i, j) {
    return  new TouchRectangle({
      x, y, w, h, i, j
    });
    return new TouchRectangle(
        beep, s => this.speakingService.read(s),
        x, y, w, h, beepSpec, vibrationSpec, ttsSpec
    );
  }
  */
/*
  const idx = this.touchObjects.indexOf(touchObj);
  if (this.touchingObjectIndex !== idx && this.lastTouchedTimestamp + 100 < Date.now()) {
    this.touchingObjectIndex = idx;
    this.lastTouchedTimestamp = Date.now();
    touchObj.notify();
  }
*/
