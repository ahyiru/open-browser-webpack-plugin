import { createRequire as l } from "module";
var m = {};
(() => {
  m.d = (e, r) => {
    for (var t in r) {
      if (m.o(r, t) && !m.o(e, t)) {
        Object.defineProperty(e, t, { enumerable: true, get: r[t] });
      }
    }
  };
})();
(() => {
  m.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r);
})();
var F = {};
m.d(F, {
  A: () => (
    /* binding */
    se
  )
});
;
const a = l(import.meta.url)("node:process");
;
const W = l(import.meta.url)("node:buffer");
;
const B = l(import.meta.url)("node:path");
;
const $ = l(import.meta.url)("node:url");
;
const w = l(import.meta.url)("node:child_process");
;
const g = l(import.meta.url)("node:fs/promises");
;
const I = l(import.meta.url)("node:os");
;
const y = l(import.meta.url)("node:fs");
;
let E;
function U() {
  try {
    y.statSync("/.dockerenv");
    return true;
  } catch {
    return false;
  }
}
function H() {
  try {
    return y.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch {
    return false;
  }
}
function N() {
  if (E === void 0) {
    E = U() || H();
  }
  return E;
}
;
let S;
const z = () => {
  try {
    y.statSync("/run/.containerenv");
    return true;
  } catch {
    return false;
  }
};
function v() {
  if (S === void 0) {
    S = z() || N();
  }
  return S;
}
;
const C = () => {
  if (a.platform !== "linux") {
    return false;
  }
  if (I.release().toLowerCase().includes("microsoft")) {
    if (v()) {
      return false;
    }
    return true;
  }
  try {
    return y.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !v() : false;
  } catch {
    return false;
  }
};
const x = a.env.__IS_WSL_TEST__ ? C : C();
;
function h(e, r, t) {
  const n = (o) => Object.defineProperty(e, r, { value: o, enumerable: true, writable: true });
  Object.defineProperty(e, r, {
    configurable: true,
    enumerable: true,
    get() {
      const o = t();
      n(o);
      return o;
    },
    set(o) {
      n(o);
    }
  });
  return e;
}
;
const b = l(import.meta.url)("node:util");
;
const D = (0, b.promisify)(w.execFile);
async function q() {
  if (a.platform !== "darwin") {
    throw new Error("macOS only");
  }
  const { stdout: e } = await D("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]);
  const r = /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(e);
  return r?.groups.id ?? "com.apple.Safari";
}
;
const X = (0, b.promisify)(w.execFile);
async function G(e, { humanReadableOutput: r = true } = {}) {
  if (a.platform !== "darwin") {
    throw new Error("macOS only");
  }
  const t = r ? [] : ["-ss"];
  const { stdout: n } = await X("osascript", ["-e", e, t]);
  return n.trim();
}
function ce(e, { humanReadableOutput: r = true } = {}) {
  if (process.platform !== "darwin") {
    throw new Error("macOS only");
  }
  const t = r ? [] : ["-ss"];
  const n = execFileSync("osascript", ["-e", e, ...t], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    timeout: 500
  });
  return n.trim();
}
;
async function K(e) {
  return G(`tell application "Finder" to set app_path to application file id "${e}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`);
}
;
const Y = (0, b.promisify)(w.execFile);
const J = {
  AppXq0fevzme2pys62n3e0fbqa7peapykr8v: { name: "Edge", id: "com.microsoft.edge.old" },
  MSEdgeDHTML: { name: "Edge", id: "com.microsoft.edge" },
  // On macOS, it's "com.microsoft.edgemac"
  MSEdgeHTM: { name: "Edge", id: "com.microsoft.edge" },
  // Newer Edge/Win10 releases
  "IE.HTTP": { name: "Internet Explorer", id: "com.microsoft.ie" },
  FirefoxURL: { name: "Firefox", id: "org.mozilla.firefox" },
  ChromeHTML: { name: "Chrome", id: "com.google.chrome" },
  BraveHTML: { name: "Brave", id: "com.brave.Browser" },
  BraveBHTML: { name: "Brave Beta", id: "com.brave.Browser.beta" },
  BraveSSHTM: { name: "Brave Nightly", id: "com.brave.Browser.nightly" }
};
class k extends Error {
}
async function Q(e = Y) {
  const { stdout: r } = await e("reg", [
    "QUERY",
    " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice",
    "/v",
    "ProgId"
  ]);
  const t = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(r);
  if (!t) {
    throw new k(`Cannot find Windows browser in stdout: ${JSON.stringify(r)}`);
  }
  const { id: n } = t.groups;
  const o = J[n];
  if (!o) {
    throw new k(`Unknown browser ID: ${n}`);
  }
  return o;
}
;
const V = (0, b.promisify)(w.execFile);
const Z = (e) => e.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (r) => r.toUpperCase());
async function ee() {
  if (a.platform === "darwin") {
    const e = await q();
    const r = await K(e);
    return { name: r, id: e };
  }
  if (a.platform === "linux") {
    const { stdout: e } = await V("xdg-mime", ["query", "default", "x-scheme-handler/http"]);
    const r = e.trim();
    const t = Z(r.replace(/.desktop$/, "").replace("-", " "));
    return { name: t, id: r };
  }
  if (a.platform === "win32") {
    return Q();
  }
  throw new Error("Only macOS, Linux, and Windows are supported");
}
;
const P = B.dirname((0, $.fileURLToPath)("file:///Users/huyong/Desktop/huxy/playground/huxy/open-browser-webpack-plugin/node_modules/open/index.js"));
const L = B.join(P, "xdg-open");
const { platform: p, arch: T } = a;
const re = /* @__PURE__ */ (() => {
  const e = "/mnt/";
  let r;
  return async function() {
    if (r) {
      return r;
    }
    const t = "/etc/wsl.conf";
    let n = false;
    try {
      await g.access(t, g.constants.F_OK);
      n = true;
    } catch {
    }
    if (!n) {
      return e;
    }
    const o = await g.readFile(t, { encoding: "utf8" });
    const u = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(o);
    if (!u) {
      return e;
    }
    r = u.groups.mountPoint.trim();
    r = r.endsWith("/") ? r : `${r}/`;
    return r;
  };
})();
const M = async (e, r) => {
  let t;
  for (const n of e) {
    try {
      return await r(n);
    } catch (o) {
      t = o;
    }
  }
  throw t;
};
const _ = async (e) => {
  e = {
    wait: false,
    background: false,
    newInstance: false,
    allowNonzeroExitCode: false,
    ...e
  };
  if (Array.isArray(e.app)) {
    return M(e.app, (i) => _({
      ...e,
      app: i
    }));
  }
  let { name: r, arguments: t = [] } = e.app ?? {};
  t = [...t];
  if (Array.isArray(r)) {
    return M(r, (i) => _({
      ...e,
      app: {
        name: i,
        arguments: t
      }
    }));
  }
  if (r === "browser" || r === "browserPrivate") {
    const i = {
      "com.google.chrome": "chrome",
      "google-chrome.desktop": "chrome",
      "org.mozilla.firefox": "firefox",
      "firefox.desktop": "firefox",
      "com.microsoft.msedge": "edge",
      "com.microsoft.edge": "edge",
      "microsoft-edge.desktop": "edge"
    };
    const s = {
      chrome: "--incognito",
      firefox: "--private-window",
      edge: "--inPrivate"
    };
    const c = await ee();
    if (c.id in i) {
      const O = i[c.id];
      if (r === "browserPrivate") {
        t.push(s[O]);
      }
      return _({
        ...e,
        app: {
          name: f[O],
          arguments: t
        }
      });
    }
    throw new Error(`${c.name} is not supported as a default browser`);
  }
  let n;
  const o = [];
  const u = {};
  if (p === "darwin") {
    n = "open";
    if (e.wait) {
      o.push("--wait-apps");
    }
    if (e.background) {
      o.push("--background");
    }
    if (e.newInstance) {
      o.push("--new");
    }
    if (r) {
      o.push("-a", r);
    }
  } else if (p === "win32" || x && !v() && !r) {
    const i = await re();
    n = x ? `${i}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` : `${a.env.SYSTEMROOT || a.env.windir || "C:\\Windows"}\\System32\\WindowsPowerShell\\v1.0\\powershell`;
    o.push(
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-EncodedCommand"
    );
    if (!x) {
      u.windowsVerbatimArguments = true;
    }
    const s = ["Start"];
    if (e.wait) {
      s.push("-Wait");
    }
    if (r) {
      s.push(`"\`"${r}\`""`);
      if (e.target) {
        t.push(e.target);
      }
    } else if (e.target) {
      s.push(`"${e.target}"`);
    }
    if (t.length > 0) {
      t = t.map((c) => `"\`"${c}\`""`);
      s.push("-ArgumentList", t.join(","));
    }
    e.target = W.Buffer.from(s.join(" "), "utf16le").toString("base64");
  } else {
    if (r) {
      n = r;
    } else {
      const i = !P || P === "/";
      let s = false;
      try {
        await g.access(L, g.constants.X_OK);
        s = true;
      } catch {
      }
      const c = a.versions.electron ?? (p === "android" || i || !s);
      n = c ? "xdg-open" : L;
    }
    if (t.length > 0) {
      o.push(...t);
    }
    if (!e.wait) {
      u.stdio = "ignore";
      u.detached = true;
    }
  }
  if (p === "darwin" && t.length > 0) {
    o.push("--args", ...t);
  }
  if (e.target) {
    o.push(e.target);
  }
  const d = w.spawn(n, o, u);
  if (e.wait) {
    return new Promise((i, s) => {
      d.once("error", s);
      d.once("close", (c) => {
        if (!e.allowNonzeroExitCode && c > 0) {
          s(new Error(`Exited with code ${c}`));
          return;
        }
        i(d);
      });
    });
  }
  d.unref();
  return d;
};
const te = (e, r) => {
  if (typeof e !== "string") {
    throw new TypeError("Expected a `target`");
  }
  return _({
    ...r,
    target: e
  });
};
const le = (e, r) => {
  if (typeof e !== "string") {
    throw new TypeError("Expected a `name`");
  }
  const { arguments: t = [] } = r ?? {};
  if (t !== void 0 && t !== null && !Array.isArray(t)) {
    throw new TypeError("Expected `appArguments` as Array type");
  }
  return _({
    ...r,
    app: {
      name: e,
      arguments: t
    }
  });
};
function j(e) {
  if (typeof e === "string" || Array.isArray(e)) {
    return e;
  }
  const { [T]: r } = e;
  if (!r) {
    throw new Error(`${T} is not supported`);
  }
  return r;
}
function A({ [p]: e }, { wsl: r }) {
  if (r && x) {
    return j(r);
  }
  if (!e) {
    throw new Error(`${p} is not supported`);
  }
  return j(e);
}
const f = {};
h(f, "chrome", () => A({
  darwin: "google chrome",
  win32: "chrome",
  linux: ["google-chrome", "google-chrome-stable", "chromium"]
}, {
  wsl: {
    ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
  }
}));
h(f, "firefox", () => A({
  darwin: "firefox",
  win32: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  linux: "firefox"
}, {
  wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
}));
h(f, "edge", () => A({
  darwin: "microsoft edge",
  win32: "msedge",
  linux: ["microsoft-edge", "microsoft-edge-dev"]
}, {
  wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
}));
h(f, "browser", () => "browser");
h(f, "browserPrivate", () => "browserPrivate");
const oe = te;
;
const ne = (e) => {
  let r = false;
  return (...t) => {
    if (!r) {
      r = true;
      return e(...t);
    }
  };
};
const R = function({ target: e = "http://localhost:8080", options: r = {} }) {
  this.target = e;
  this.options = r;
};
R.prototype.apply = function(e) {
  const r = ne(() => oe(this.target, this.options));
  e.hooks.done.tap("OpenBrowserPlugin", ({ compilation: t }) => {
    if (!t.errors.length) {
      r();
    }
  });
};
const se = R;
var ie = F.A;
export {
  ie as default
};
