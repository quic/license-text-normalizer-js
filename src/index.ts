// Copyright (c) 2020, Qualcomm Innovation Center, Inc. All rights reserved.
// SPDX-License-Identifier: BSD-3-Clause

import splitLines from 'split-lines';
import isAlNum from 'is-alphanumerical';

const DEFAULT_LEADING_DELIMITERS = [
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
const DEFAULT_BULLET_DELIMITERS = ['*', '-'];
const DEFAULT_TRAILING_DELIMITERS = ['*/', '*;', '*'];
const DEFAULT_CONTROL_CHARACTERS = [
  '\0', // null char
];

type Delimiter = string;

export default normalizeLicenseText;

export function normalizeLicenseText(
  text: string,
  _leadingDelimiters: Delimiter[] = DEFAULT_LEADING_DELIMITERS,
  _bulletDelimiters: Delimiter[] = DEFAULT_BULLET_DELIMITERS,
  _trailingDelimiters: Delimiter[] = DEFAULT_TRAILING_DELIMITERS,
  controlCharacters: string[] = DEFAULT_CONTROL_CHARACTERS,
): string {
  // sort delimiters, longest-to-shortest
  const leadingDelimiters = _leadingDelimiters.sort(byLength).reverse();
  const bulletDelimiters = _bulletDelimiters.sort(byLength).reverse();
  const trailingDelimiters = _trailingDelimiters.sort(byLength).reverse();
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

function stripControlCharacters(line: string, characters: string[]): string {
  for (let i = 0; i < line.length; i++) {
    if (characters.includes(line.charAt(i))) {
      const lineBeforeChar = line.slice(0, i);
      const isLastChar = i === line.length - 1;
      const lineAfterChar = isLastChar
        ? ''
        : stripControlCharacters(line.slice(i + 1), characters);
      return lineBeforeChar + lineAfterChar;
    }
  }
  return line;
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
