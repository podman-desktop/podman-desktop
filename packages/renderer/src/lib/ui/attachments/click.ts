import type { Attachment } from 'svelte/attachments';

export function click(cb: () => void, button = 0): Attachment {
  return node => {
    const handleMouseClick = (event: Event): void => {
      const mouseEvent = event as MouseEvent;
      if (mouseEvent.button !== button) return;
      cb();
    };

    node.addEventListener('click', handleMouseClick);

    return () => {
      node.removeEventListener('click', handleMouseClick);
    };
  };
}
