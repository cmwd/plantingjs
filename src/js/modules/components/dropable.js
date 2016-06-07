import { DATA_FORMAT_PLAIN_TEXT } from './dragable';
export const EVENT_DROP = 'drop';

export default function({ view }) {
  function onDrop({ originalEvent: { dataTransfer, clientX: x, clientY: y }}) {
    const data = JSON.parse(dataTransfer.getData(DATA_FORMAT_PLAIN_TEXT));

    view.trigger(EVENT_DROP, { x, y, data });
  }

  function onDragOver(event) {
    event.preventDefault();
  }

  view.delegate('drop', null, onDrop);
  view.delegate('dragover', null, onDragOver);
}
