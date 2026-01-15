import type { Attachment } from 'svelte/attachments';

export function longPress(cb: () => void, button = 0, threshold = 500): Attachment {
  return node => {
    let timeout: NodeJS.Timeout | undefined = undefined;

    const handleMouseDown = (event: Event): void => {
      const mouseEvent = event as MouseEvent;
      if (mouseEvent.button !== button) return;
      timeout = setTimeout(cb, threshold);
    };

    const handleCancel = (): void => {
      if (!timeout) return;
      clearTimeout(timeout);
      timeout = undefined;
    };

    node.addEventListener('mousedown', handleMouseDown);
    node.addEventListener('mouseup', handleCancel);

    return () => {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('mouseup', handleCancel);
    };
  };
}
