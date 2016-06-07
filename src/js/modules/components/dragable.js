export const DATA_FORMAT_PLAIN_TEXT = 'text/plain';
const IS_DRAGGING_CLASS = 'plantingjs-is-dragging';

export default function({ view }) {
  const { model, el } = view;

  function onDragStart({ originalEvent: { dataTransfer, clientX, clientY }}) {
    const { top, left } = el.getBoundingClientRect();
    const data = {
      offset: {
        x: clientX - left,
        y: clientY - top,
      },
      modelCid: model.cid,
    };

    dataTransfer.setData(DATA_FORMAT_PLAIN_TEXT, JSON.stringify(data));
    el.classList.add(IS_DRAGGING_CLASS);
  }

  function onDragEnd({ originalEvent: { dataTransfer }}) {
    dataTransfer.clearData();
    view.el.classList.remove(IS_DRAGGING_CLASS);
  }

  view.delegate('dragstart', null, onDragStart);
  view.delegate('dragend', null, onDragEnd);
  el.setAttribute('draggable', true);
}
