# es3ex-string

Bring your strings up to date with Microsoft's amazing ECMAScript 3 String extensions. Finally, `.blink()` for everyone.

```js
import "es3ex-string";

"hello".blink();             // "<blink>hello</blink>"
"home".link("/");            // '<a href="/">home</a>'
"warning".fontcolor("red");  // '<font color="red">warning</font>'
"E = mc".concat("2".sup());  // "E = mc<sup>2</sup>"
```

## Install

```sh
npm install es3ex-string
```

## All thirteen

| Method | Output |
|---|---|
| `"x".anchor("top")` | `<a name="top">x</a>` |
| `"x".big()` | `<big>x</big>` |
| `"x".blink()` | `<blink>x</blink>` |
| `"x".bold()` | `<b>x</b>` |
| `"x".fixed()` | `<tt>x</tt>` |
| `"x".fontcolor("red")` | `<font color="red">x</font>` |
| `"x".fontsize(7)` | `<font size="7">x</font>` |
| `"x".italics()` | `<i>x</i>` |
| `"x".link("/")` | `<a href="/">x</a>` |
| `"x".small()` | `<small>x</small>` |
| `"x".strike()` | `<strike>x</strike>` |
| `"x".sub()` | `<sub>x</sub>` |
| `"x".sup()` | `<sup>x</sup>` |

These methods behave exactly as the spec says, and the test suite checks them against the engine's own implementation:
- In attribute values, `"` is escaped as `&quot;`, and nothing else is escaped.
- The string itself is never escaped, so don't feed it user input.
- Calling a method on `null` or `undefined` throws a `TypeError`.

## Not into prototypes?

Every method is also exported as a plain function, and so is the helper behind them all:

```js
import { blink, link, createHTML } from "es3ex-string";

blink("hello");               // "<blink>hello</blink>"
link("home", "/");            // '<a href="/">home</a>'
createHTML("x", "marquee");   // "<marquee>x</marquee>"
```

Importing the package still installs any methods that are missing from `String.prototype`. `install(target, { force })` does the same for any object you like, and returns the names it added.

## Wait, doesn't my browser already have these?

Yes. JScript shipped them, Netscape shipped them, and they were eventually written into the ECMAScript spec, in Annex B. Every modern engine has them. This package never overwrites a native method, so on those engines importing it does absolutely nothing. That's the most backwards-compatible behavior possible.

On an engine that left them out, they appear.

## Why?

This started as a joke module in an experimental 2010 library that put Dojo helpers on native prototypes. It was "a module you should never load". Now it's a package you should never install.

Reference: [Microsoft's original ES3 extensions page (2010, via MSDN)](http://msdn.microsoft.com/en-us/library/ff520797%28VS.85%29.aspx) · [ECMAScript Annex B, `String.prototype.anchor` et al.](https://tc39.es/ecma262/#sec-string.prototype.anchor)

## License

MIT
