// Copyright (c) 2020, Qualcomm Innovation Center, Inc. All rights reserved.
// SPDX-License-Identifier: BSD-3-Clause

import splitLines from 'split-lines';
import isAlNum from 'is-alphanumerical';

type Delimiter = string;
type ControlCharacter = string;

const DEFAULT_LEADING_DELIMITERS: Delimiter[] = [
  '@REM #',
  '.\\"',
  '///',
  '//',
  '##',
  '/*',
  '#*',
  ';',
  '**',
  '::',
  ';*',
  '#',
  '*',
  '-',
];
const DEFAULT_BULLET_DELIMITERS: Delimiter[] = ['*', '-'];
const DEFAULT_TRAILING_DELIMITERS: Delimiter[] = ['*/', '*;', '*'];
const DEFAULT_CONTROL_CHARACTERS: ControlCharacter[] = [
  '\0', // null char
];

interface NormalizeLicenseTextOptions {
  leadingDelimiters: Delimiter[];
  bulletDelimiters: Delimiter[];
  trailingDelimiters: Delimiter[];
  controlCharacters: ControlCharacter[];
}

const defaultOptions: NormalizeLicenseTextOptions = {
  leadingDelimiters: DEFAULT_LEADING_DELIMITERS,
  bulletDelimiters: DEFAULT_BULLET_DELIMITERS,
  trailingDelimiters: DEFAULT_TRAILING_DELIMITERS,
  controlCharacters: DEFAULT_CONTROL_CHARACTERS,
};

export default normalizeLicenseText;

export function normalizeLicenseText(
  text: string,
  options: Partial<NormalizeLicenseTextOptions> = {},
): string {
  const config = {...defaultOptions, ...options};
  const {controlCharacters} = config;
  // sort delimiters, longest-to-shortest
  const leadingDelimiters = config.leadingDelimiters.sort(byLength).reverse();
  const bulletDelimiters = config.bulletDelimiters.sort(byLength).reverse();
  const trailingDelimiters = config.trailingDelimiters.sort(byLength).reverse();
  // create lookup to catch standalone delimiters
  const delimitersLookup = new Set([
    ...leadingDelimiters,
    ...trailingDelimiters,
  ]);

  const normalizedLines = [];
  let prevLine = '';

  for (const line of splitLines(text)) {
    let normalizedLine = line.trim();
    // strip standalone delimiter
    if (delimitersLookup.has(normalizedLine)) {
      normalizedLine = '';
    }

    // strip trailing, leading, bullet delimiters
    normalizedLine = stripTrailingDelimiters(
      normalizedLine,
      trailingDelimiters,
    );
    normalizedLine = stripLeadingDelimiters(normalizedLine, leadingDelimiters);
    normalizedLine = stripLeadingDelimiters(normalizedLine, bulletDelimiters);

    // strip lines of repeating non-alnum characters
    if (isRepeatedNonAlNum(normalizedLine)) {
      normalizedLine = '';
    }

    // strip control characters
    normalizedLine = stripControlCharacters(normalizedLine, controlCharacters);

    // drop excess (repeated) blank lines
    if (normalizedLine || prevLine) {
      normalizedLines.push(normalizedLine);
    }

    prevLine = normalizedLine;
  }

  return normalizedLines.join('\n').trim();
}

function stripControlCharacters(
  line: string,
  characters: ControlCharacter[],
): string {
  const controlCharPositions: number[] = [];
  for (let charIndex = 0; charIndex < line.length; charIndex++) {
    if (characters.includes(line.charAt(charIndex))) {
      controlCharPositions.push(charIndex);
    }
  }
  return controlCharPositions.length
    ? Array.from(line)
        .filter((_char, charIndex) => !controlCharPositions.includes(charIndex))
        .join('')
    : line;
}

function stripLeadingDelimiters(line: string, delimiters: Delimiter[]): string {
  // short-circuit blank lines and lines without leading delimiters
  if (!line || isAlNum(first(line))) {
    return line;
  }

  // strip leading delimiter
  return stripDelimiter(line, delimiters).trimStart();
}

function stripTrailingDelimiters(
  line: string,
  delimiters: Delimiter[],
): string {
  if (!line || isAlNum(last(line))) {
    return line;
  }
  return stripDelimiter(line, delimiters, false).trimEnd();
}

function stripDelimiter(
  line: string,
  delimiters: Delimiter[],
  leading = true,
): string {
  const lineStartsOrEndsWith = leading
    ? (x: string): boolean => line.startsWith(x)
    : (x: string): boolean => line.endsWith(x);
  const strip = leading ? stripLeading : stripTrailing;

  for (const delimiter of delimiters) {
    if (line === delimiter) {
      return '';
    }
    if (line.length < delimiter.length) {
      continue;
    }
    if (lineStartsOrEndsWith(delimiter)) {
      line = strip(line, delimiter);
      break;
    }
  }

  return line;
}

function stripLeading(line: string, delimiter: string): string {
  return line.slice(delimiter.length);
}

function stripTrailing(line: string, delimiter: string): string {
  return line.slice(0, delimiter.length * -1);
}

function first(str: string): string {
  return str[0];
}

function last(str: string): string {
  return str[str.length - 1];
}

function byLength(a: string, b: string): number {
  if (a.length < b.length) {
    return -1;
  }
  if (a.length > b.length) {
    return 1;
  }
  return 0;
}

function isRepeatedNonAlNum(str: string): boolean {
  // repeated sequence must be at least 2 chars
  if (str.length <= 1) {
    return false;
  }
  return !isAlNum(first(str)) && !Array.from(str).some(x => x !== first(str));
}
