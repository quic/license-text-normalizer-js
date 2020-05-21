/* eslint-disable @typescript-eslint/camelcase */
// Type definitions for split-lines 2.0
// Project: https://github.com/sindresorhus/split-lines#readme

declare module 'split-lines' {
  export default function split_lines(
    string: string,
    options?: {preserveNewLines?: boolean},
  ): string[];
}
