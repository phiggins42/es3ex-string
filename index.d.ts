// String.prototype.blink() and friends are already declared by TypeScript's
// standard lib, so importing this module needs no extra global types.

export type MethodName =
	| "anchor" | "big" | "blink" | "bold" | "fixed" | "fontcolor" | "fontsize"
	| "italics" | "link" | "small" | "strike" | "sub" | "sup";

export const METHODS: readonly MethodName[];
export const methods: Readonly<Record<MethodName, (this: unknown, value?: unknown) => string>>;

export function createHTML(str: unknown, tag: string, attribute?: string, value?: unknown): string;
export function install(target?: object, options?: { force?: boolean }): MethodName[];

export function anchor(str: unknown, name: unknown): string;
export function big(str: unknown): string;
export function blink(str: unknown): string;
export function bold(str: unknown): string;
export function fixed(str: unknown): string;
export function fontcolor(str: unknown, color: unknown): string;
export function fontsize(str: unknown, size: unknown): string;
export function italics(str: unknown): string;
export function link(str: unknown, url: unknown): string;
export function small(str: unknown): string;
export function strike(str: unknown): string;
export function sub(str: unknown): string;
export function sup(str: unknown): string;
