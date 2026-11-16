import { test } from "node:test";
import assert from "node:assert/strict";
import * as es3ex from "../index.js";
import { METHODS, methods, install, createHTML, bold, link, blink } from "../index.js";

// Capture the engine's own implementations so we can check ours against them.
const native = Object.fromEntries(METHODS.map((m) => [m, String.prototype[m]]));
const receivers = ["text", "", 42, true, "<b>already</b>", "unicode ☃", { toString: () => "obj" }];
const args = ["foo.html", 'say "hi"', 7, undefined, null, "", "&amp;"];

test("covers all 13 Annex B methods", () => {
	assert.deepEqual([...METHODS].sort(), [
		"anchor", "big", "blink", "bold", "fixed", "fontcolor", "fontsize",
		"italics", "link", "small", "strike", "sub", "sup",
	]);
});

for (const name of METHODS) {
	test(`${name} matches the native implementation`, () => {
		assert.equal(methods[name].length, native[name].length);
		for (const r of receivers) {
			for (const a of args) {
				assert.equal(methods[name].call(r, a), native[name].call(r, a), `${name} on ${String(r)} with ${a}`);
			}
		}
		assert.throws(() => methods[name].call(null), TypeError);
		assert.throws(() => methods[name].call(undefined), TypeError);
	});

	test(`standalone ${name}() matches too`, () => {
		assert.equal(es3ex[name]("x", 'a"b'), native[name].call("x", 'a"b'));
	});
}

test("the classics", () => {
	assert.equal("hello".blink(), "<blink>hello</blink>");
	assert.equal("home".link("/"), '<a href="/">home</a>');
	assert.equal(bold("x"), "<b>x</b>");
	assert.equal(link("x", "y.html"), '<a href="y.html">x</a>');
	assert.equal(blink(blink("x")), "<blink><blink>x</blink></blink>");
	assert.equal(createHTML("x", "marquee"), "<marquee>x</marquee>");
});

test("returns a new primitive string and leaves the original alone", () => {
	const s = "x";
	const out = methods.bold.call(s);
	assert.equal(typeof out, "string");
	assert.equal(s, "x");
});

test("importing never replaces native methods", () => {
	for (const name of METHODS) {
		assert.equal(String.prototype[name], native[name]);
		assert.match(Function.prototype.toString.call(String.prototype[name]), /\[native code\]/);
	}
});

test("install fills in only what's missing, non-enumerably", () => {
	const target = { bold: "mine" };
	const installed = install(target);
	assert.equal(installed.length, 12);
	assert.ok(!installed.includes("bold"));
	assert.equal(target.bold, "mine");
	assert.equal(target.blink, methods.blink);
	assert.deepEqual(Object.keys(target), ["bold"]);
	assert.deepEqual(install(target), []);
});

test("install({ force: true }) replaces existing methods", () => {
	const target = { bold: "mine" };
	assert.equal(install(target, { force: true }).length, 13);
	assert.equal(target.bold, methods.bold);
});

test("works on a String.prototype that has lost them", () => {
	const saved = native.blink;
	delete String.prototype.blink;
	try {
		assert.equal("blink" in String.prototype, false);
		assert.deepEqual(install(), ["blink"]);
		assert.equal("hello".blink(), "<blink>hello</blink>");
	} finally {
		Object.defineProperty(String.prototype, "blink", { value: saved, writable: true, configurable: true, enumerable: false });
	}
});
