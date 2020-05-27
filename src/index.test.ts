// Copyright (c) 2020, Qualcomm Innovation Center, Inc. All rights reserved.
// SPDX-License-Identifier: BSD-3-Clause

import normalizeLicenseText from './index';
import fs from 'fs';
import path from 'path';
import parse from 'csv-parse/lib/sync';

function loadFixtures(): [string, string][] {
  const csvPath = path.join(__dirname, '..', 'fixtures.csv');
  const csvFile = fs.readFileSync(csvPath);
  // eslint-disable-next-line @typescript-eslint/camelcase
  return parse(csvFile, {from_line: 2}); // skip headers
}

describe('Normalize License Text', () => {
  it('should normalize license text with the default delimiters', () => {
    expect.assertions(26); // entries in csv
    const fixtures = loadFixtures();
    fixtures.forEach(([raw, normalized]) => {
      expect(normalizeLicenseText(raw)).toEqual(normalized);
    });
  });

  it('should normalize license text with custom leading delimiters', () => {
    const raw = 'XXX\nCopyright 2010 Google Inc. All Rights Reserved.';
    expect(normalizeLicenseText(raw, {leadingDelimiters: ['XXX']})).toEqual(
      'Copyright 2010 Google Inc. All Rights Reserved.',
    );
  });

  it('should normalize license text with custom bullet delimiters', () => {
    const raw = 'Copyright 2010 Google Inc.\n @@@ Hi\nAll Rights Reserved.';
    expect(normalizeLicenseText(raw, {bulletDelimiters: ['@@@']})).toEqual(
      'Copyright 2010 Google Inc.\nHi\nAll Rights Reserved.',
    );
  });

  it('should normalize license text with custom trailing delimiters', () => {
    const raw = 'Copyright 2010 Google Inc. All Rights Reserved.\nXXX';
    expect(normalizeLicenseText(raw, {trailingDelimiters: ['XXX']})).toEqual(
      'Copyright 2010 Google Inc. All Rights Reserved.',
    );
  });

  it('should normalize license text with custom words to strip', () => {
    expect(
      normalizeLicenseText('FOO<br>BAR<br>', {
        wordsToStrip: ['br', '<br>'], // ensure longest words stripped first
      }),
    ).toEqual('FOOBAR');
  });
});
