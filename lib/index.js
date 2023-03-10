import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
var __webpack_modules__ = {
  /***/
  722: (
    /***/
    (module) => {
      module.exports = (object, propertyName, fn) => {
        const define = (value) => Object.defineProperty(object, propertyName, { value, enumerable: true, writable: true });
        Object.defineProperty(object, propertyName, {
          configurable: true,
          enumerable: true,
          get() {
            const result = fn();
            define(result);
            return result;
          },
          set(value) {
            define(value);
          }
        });
        return object;
      };
    }
  ),
  /***/
  762: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const fs = __webpack_require__2(147);
      let isDocker;
      function hasDockerEnv() {
        try {
          fs.statSync("/.dockerenv");
          return true;
        } catch (_) {
          return false;
        }
      }
      function hasDockerCGroup() {
        try {
          return fs.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
        } catch (_) {
          return false;
        }
      }
      module.exports = () => {
        if (isDocker === void 0) {
          isDocker = hasDockerEnv() || hasDockerCGroup();
        }
        return isDocker;
      };
    }
  ),
  /***/
  189: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const os = __webpack_require__2(37);
      const fs = __webpack_require__2(147);
      const isDocker = __webpack_require__2(762);
      const isWsl = () => {
        if (process.platform !== "linux") {
          return false;
        }
        if (os.release().toLowerCase().includes("microsoft")) {
          if (isDocker()) {
            return false;
          }
          return true;
        }
        try {
          return fs.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !isDocker() : false;
        } catch (_) {
          return false;
        }
      };
      if (process.env.__IS_WSL_TEST__) {
        module.exports = isWsl;
      } else {
        module.exports = isWsl();
      }
    }
  ),
  /***/
  207: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const path = __webpack_require__2(17);
      const childProcess = __webpack_require__2(81);
      const { promises: fs, constants: fsConstants } = __webpack_require__2(147);
      const isWsl = __webpack_require__2(189);
      const isDocker = __webpack_require__2(762);
      const defineLazyProperty = __webpack_require__2(722);
      const localXdgOpenPath = path.join(__dirname, "xdg-open");
      const { platform, arch } = process;
      const hasContainerEnv = () => {
        try {
          fs.statSync("/run/.containerenv");
          return true;
        } catch {
          return false;
        }
      };
      let cachedResult;
      function isInsideContainer() {
        if (cachedResult === void 0) {
          cachedResult = hasContainerEnv() || isDocker();
        }
        return cachedResult;
      }
      const getWslDrivesMountPoint = (() => {
        const defaultMountPoint = "/mnt/";
        let mountPoint;
        return async function() {
          if (mountPoint) {
            return mountPoint;
          }
          const configFilePath = "/etc/wsl.conf";
          let isConfigFileExists = false;
          try {
            await fs.access(configFilePath, fsConstants.F_OK);
            isConfigFileExists = true;
          } catch {
          }
          if (!isConfigFileExists) {
            return defaultMountPoint;
          }
          const configContent = await fs.readFile(configFilePath, { encoding: "utf8" });
          const configMountPoint = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(configContent);
          if (!configMountPoint) {
            return defaultMountPoint;
          }
          mountPoint = configMountPoint.groups.mountPoint.trim();
          mountPoint = mountPoint.endsWith("/") ? mountPoint : `${mountPoint}/`;
          return mountPoint;
        };
      })();
      const pTryEach = async (array, mapper) => {
        let latestError;
        for (const item of array) {
          try {
            return await mapper(item);
          } catch (error) {
            latestError = error;
          }
        }
        throw latestError;
      };
      const baseOpen = async (options) => {
        options = {
          wait: false,
          background: false,
          newInstance: false,
          allowNonzeroExitCode: false,
          ...options
        };
        if (Array.isArray(options.app)) {
          return pTryEach(options.app, (singleApp) => baseOpen({
            ...options,
            app: singleApp
          }));
        }
        let { name: app, arguments: appArguments = [] } = options.app || {};
        appArguments = [...appArguments];
        if (Array.isArray(app)) {
          return pTryEach(app, (appName) => baseOpen({
            ...options,
            app: {
              name: appName,
              arguments: appArguments
            }
          }));
        }
        let command;
        const cliArguments = [];
        const childProcessOptions = {};
        if (platform === "darwin") {
          command = "open";
          if (options.wait) {
            cliArguments.push("--wait-apps");
          }
          if (options.background) {
            cliArguments.push("--background");
          }
          if (options.newInstance) {
            cliArguments.push("--new");
          }
          if (app) {
            cliArguments.push("-a", app);
          }
        } else if (platform === "win32" || isWsl && !isInsideContainer() && !app) {
          const mountPoint = await getWslDrivesMountPoint();
          command = isWsl ? `${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` : `${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`;
          cliArguments.push(
            "-NoProfile",
            "-NonInteractive",
            "\u2013ExecutionPolicy",
            "Bypass",
            "-EncodedCommand"
          );
          if (!isWsl) {
            childProcessOptions.windowsVerbatimArguments = true;
          }
          const encodedArguments = ["Start"];
          if (options.wait) {
            encodedArguments.push("-Wait");
          }
          if (app) {
            encodedArguments.push(`"\`"${app}\`""`, "-ArgumentList");
            if (options.target) {
              appArguments.unshift(options.target);
            }
          } else if (options.target) {
            encodedArguments.push(`"${options.target}"`);
          }
          if (appArguments.length > 0) {
            appArguments = appArguments.map((arg) => `"\`"${arg}\`""`);
            encodedArguments.push(appArguments.join(","));
          }
          options.target = Buffer.from(encodedArguments.join(" "), "utf16le").toString("base64");
        } else {
          if (app) {
            command = app;
          } else {
            const isBundled = __dirname === "/";
            let exeLocalXdgOpen = false;
            try {
              await fs.access(localXdgOpenPath, fsConstants.X_OK);
              exeLocalXdgOpen = true;
            } catch {
            }
            const useSystemXdgOpen = process.versions.electron || platform === "android" || isBundled || !exeLocalXdgOpen;
            command = useSystemXdgOpen ? "xdg-open" : localXdgOpenPath;
          }
          if (appArguments.length > 0) {
            cliArguments.push(...appArguments);
          }
          if (!options.wait) {
            childProcessOptions.stdio = "ignore";
            childProcessOptions.detached = true;
          }
        }
        if (options.target) {
          cliArguments.push(options.target);
        }
        if (platform === "darwin" && appArguments.length > 0) {
          cliArguments.push("--args", ...appArguments);
        }
        const subprocess = childProcess.spawn(command, cliArguments, childProcessOptions);
        if (options.wait) {
          return new Promise((resolve, reject) => {
            subprocess.once("error", reject);
            subprocess.once("close", (exitCode) => {
              if (!options.allowNonzeroExitCode && exitCode > 0) {
                reject(new Error(`Exited with code ${exitCode}`));
                return;
              }
              resolve(subprocess);
            });
          });
        }
        subprocess.unref();
        return subprocess;
      };
      const open = (target, options) => {
        if (typeof target !== "string") {
          throw new TypeError("Expected a `target`");
        }
        return baseOpen({
          ...options,
          target
        });
      };
      const openApp = (name, options) => {
        if (typeof name !== "string") {
          throw new TypeError("Expected a `name`");
        }
        const { arguments: appArguments = [] } = options || {};
        if (appArguments !== void 0 && appArguments !== null && !Array.isArray(appArguments)) {
          throw new TypeError("Expected `appArguments` as Array type");
        }
        return baseOpen({
          ...options,
          app: {
            name,
            arguments: appArguments
          }
        });
      };
      function detectArchBinary(binary) {
        if (typeof binary === "string" || Array.isArray(binary)) {
          return binary;
        }
        const { [arch]: archBinary } = binary;
        if (!archBinary) {
          throw new Error(`${arch} is not supported`);
        }
        return archBinary;
      }
      function detectPlatformBinary({ [platform]: platformBinary }, { wsl }) {
        if (wsl && isWsl) {
          return detectArchBinary(wsl);
        }
        if (!platformBinary) {
          throw new Error(`${platform} is not supported`);
        }
        return detectArchBinary(platformBinary);
      }
      const apps = {};
      defineLazyProperty(apps, "chrome", () => detectPlatformBinary({
        darwin: "google chrome",
        win32: "chrome",
        linux: ["google-chrome", "google-chrome-stable", "chromium"]
      }, {
        wsl: {
          ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
          x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
        }
      }));
      defineLazyProperty(apps, "firefox", () => detectPlatformBinary({
        darwin: "firefox",
        win32: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
        linux: "firefox"
      }, {
        wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
      }));
      defineLazyProperty(apps, "edge", () => detectPlatformBinary({
        darwin: "microsoft edge",
        win32: "msedge",
        linux: ["microsoft-edge", "microsoft-edge-dev"]
      }, {
        wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
      }));
      open.apps = apps;
      open.openApp = openApp;
      module.exports = open;
    }
  ),
  /***/
  81: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("child_process");
    }
  ),
  /***/
  147: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");
    }
  ),
  /***/
  37: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");
    }
  ),
  /***/
  17: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");
    }
  )
  /******/
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== void 0) {
    return cachedModule.exports;
  }
  var module = __webpack_module_cache__[moduleId] = {
    /******/
    // no module.id needed
    /******/
    // no module.loaded needed
    /******/
    exports: {}
    /******/
  };
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}
(() => {
  __webpack_require__.d = (exports, definition) => {
    for (var key in definition) {
      if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
      }
    }
  };
})();
(() => {
  __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
})();
var __webpack_exports__ = {};
(() => {
  __webpack_require__.d(__webpack_exports__, {
    /* harmony export */
    "Z": () => __WEBPACK_DEFAULT_EXPORT__
    /* harmony export */
  });
  var open__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);
  const once = (fn) => {
    let called = false;
    return (...args) => {
      if (!called) {
        called = true;
        return fn(...args);
      }
    };
  };
  const OpenBrowserWebpackPlugin = function({ target = "http://localhost:8080", options = {} }) {
    this.target = target;
    this.options = options;
  };
  OpenBrowserWebpackPlugin.prototype.apply = function(compiler) {
    const openBrowser = once(() => open__WEBPACK_IMPORTED_MODULE_0__(this.target, this.options));
    compiler.hooks.done.tap("OpenBrowserPlugin", ({ compilation }) => {
      if (!compilation.errors.length) {
        openBrowser();
      }
    });
  };
  const __WEBPACK_DEFAULT_EXPORT__ = OpenBrowserWebpackPlugin;
})();
var __webpack_exports__default = __webpack_exports__.Z;
export {
  __webpack_exports__default as default
};
