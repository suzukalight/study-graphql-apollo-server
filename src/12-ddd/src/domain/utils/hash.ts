export const toCursorHash = (string: string) => Buffer.from(string).toString('base64');
export const fromCursorHash = (string: string) => Buffer.from(string, 'base64').toString('ascii');
