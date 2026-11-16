// es3ex-string: Microsoft's ECMAScript 3 String extensions, for every engine.
// https://github.com/phiggins42/es3ex-string
//
//   import "es3ex-string";
//   "hello".blink();          // "<blink>hello</blink>"
//   "home".link("/");         // '<a href="/">home</a>'
//
// Behavior follows ECMAScript Annex B (CreateHTML): the receiver is converted
// with String(), attribute values have " escaped as &quot;, and calling on
// null/undefined throws a TypeError. Native methods are never overwritten.

// tag, attribute (or none)
const SPEC = {
	anchor: ["a", "name"],
	big: ["big"],
	blink: ["blink"],
	bold: ["b"],
	fixed: ["tt"],
	fontcolor: ["font", "color"],
	fontsize: ["font", "size"],
	italics: ["i"],
	link: ["a", "href"],
	small: ["small"],
	strike: ["strike"],
	sub: ["sub"],
	sup: ["sup"],
};

export const METHODS = Object.freeze(Object.keys(SPEC));

/**
 * Wrap a string in an HTML tag, with an optional attribute.
 * @param {*} str  converted with String(); null/undefined throws
 * @param {string} tag
 * @param {string} [attribute]
 * @param {*} [value]  converted with String(), with " escaped as &quot;
 */
export function createHTML(str, tag, attribute, value) {
	if (str == null) {
		throw new TypeError(`String.prototype method called on ${str}`);
	}
	let open = "<" + tag;
	if (attribute) {
		open += ` ${attribute}="${String(value).replace(/"/g, "&quot;")}"`;
	}
	return `${open}>${String(str)}</${tag}>`;
}

const make = (tag, attribute) =>
	attribute
		? function (value) {
				return createHTML(this, tag, attribute, value);
			}
		: function () {
				return createHTML(this, tag);
			};

/** The prototype methods, keyed by name. Each uses `this` as the string. */
export const methods = Object.freeze(
	Object.fromEntries(Object.entries(SPEC).map(([name, [tag, attr]]) => [name, make(tag, attr)])),
);

/**
 * Add the methods to `target` (String.prototype by default) wherever they're
 * missing, as non-enumerable properties. Pass { force: true } to replace
 * existing ones. Returns the names that were installed.
 */
export function install(target = String.prototype, { force = false } = {}) {
	const installed = [];
	for (const [name, value] of Object.entries(methods)) {
		if (force || !(name in target)) {
			Object.defineProperty(target, name, { value, writable: true, configurable: true, enumerable: false });
			installed.push(name);
		}
	}
	return installed;
}

// Standalone helpers that don't touch any prototype: bold("x") -> "<b>x</b>".
export const anchor = (str, name) => createHTML(str, "a", "name", name);
export const big = (str) => createHTML(str, "big");
export const blink = (str) => createHTML(str, "blink");
export const bold = (str) => createHTML(str, "b");
export const fixed = (str) => createHTML(str, "tt");
export const fontcolor = (str, color) => createHTML(str, "font", "color", color);
export const fontsize = (str, size) => createHTML(str, "font", "size", size);
export const italics = (str) => createHTML(str, "i");
export const link = (str, url) => createHTML(str, "a", "href", url);
export const small = (str) => createHTML(str, "small");
export const strike = (str) => createHTML(str, "strike");
export const sub = (str) => createHTML(str, "sub");
export const sup = (str) => createHTML(str, "sup");

install();
