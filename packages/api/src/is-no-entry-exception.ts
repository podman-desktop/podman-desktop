export function isNoEntryException(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error && 'code' in err && err.code === 'ENOENT';
}
