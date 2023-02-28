import promptSync from 'prompt-sync';

export const getUserInput = promptSync();
export enum TERMINAL_COLOR_CODES {
  RED = '\x1b[31m',
  GREEN = '\x1b[32m',
  WHITE = '\x1b[0m',
  BLUE = '\x1b[94m',
}

export const ACCEPT_VALUES = ['yes', 'y'];
export const REJECT_VALUES = ['no', 'n'];
export const ALL_VALUES = ACCEPT_VALUES.concat(REJECT_VALUES);

export function colorize(items: string[], colorCode: string): string {
  return items
    .map((fileName) => colorCode + fileName + TERMINAL_COLOR_CODES.WHITE)
    .join(', ');
}

export function validateYesNoQuestion(questionPrompt: string): boolean {
  const coloredPromptValues = colorize(ALL_VALUES, TERMINAL_COLOR_CODES.GREEN);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const input = getUserInput(questionPrompt)?.toLocaleLowerCase();
    if (ALL_VALUES.includes(input)) {
      return ACCEPT_VALUES.includes(input) ? true : false;
    } else if (input !== undefined) {
      console.log(`Only ${coloredPromptValues} values accepted`);
    } else {
      return false;
    }
  }
}
