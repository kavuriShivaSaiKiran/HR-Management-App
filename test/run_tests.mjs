var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/sql.js/dist/sql-wasm.js
var require_sql_wasm = __commonJS({
  "node_modules/sql.js/dist/sql-wasm.js"(exports, module) {
    var initSqlJsPromise = void 0;
    var initSqlJs3 = function(moduleConfig) {
      if (initSqlJsPromise) {
        return initSqlJsPromise;
      }
      initSqlJsPromise = new Promise(function(resolveModule, reject) {
        var Module = typeof moduleConfig !== "undefined" ? moduleConfig : {};
        var originalOnAbortFunction = Module["onAbort"];
        Module["onAbort"] = function(errorThatCausedAbort) {
          reject(new Error(errorThatCausedAbort));
          if (originalOnAbortFunction) {
            originalOnAbortFunction(errorThatCausedAbort);
          }
        };
        Module["postRun"] = Module["postRun"] || [];
        Module["postRun"].push(function() {
          resolveModule(Module);
        });
        module = void 0;
        var k;
        k ||= typeof Module != "undefined" ? Module : {};
        var aa = !!globalThis.window, ba = !!globalThis.WorkerGlobalScope, ca = globalThis.process?.versions?.node && "renderer" != globalThis.process?.type;
        k.onRuntimeInitialized = function() {
          function a(f, l) {
            switch (typeof l) {
              case "boolean":
                dc(f, l ? 1 : 0);
                break;
              case "number":
                ec(f, l);
                break;
              case "string":
                fc(f, l, -1, -1);
                break;
              case "object":
                if (null === l) lb(f);
                else if (null != l.length) {
                  var n = da(l.length);
                  m.set(l, n);
                  gc(f, n, l.length, -1);
                  ea(n);
                } else va(f, "Wrong API use : tried to return a value of an unknown type (" + l + ").", -1);
                break;
              default:
                lb(f);
            }
          }
          function b(f, l) {
            for (var n = [], p = 0; p < f; p += 1) {
              var r = t(l + 4 * p, "i32"), w = hc(r);
              if (1 === w || 2 === w) r = ic(r);
              else if (3 === w) r = jc(r);
              else if (4 === w) {
                w = r;
                r = kc(w);
                w = lc(w);
                for (var J = new Uint8Array(r), I = 0; I < r; I += 1) J[I] = m[w + I];
                r = J;
              } else r = null;
              n.push(r);
            }
            return n;
          }
          function c(f, l) {
            this.Qa = f;
            this.db = l;
            this.Oa = 1;
            this.mb = [];
          }
          function d(f, l) {
            this.db = l;
            this.fb = fa(f);
            if (null === this.fb) throw Error("Unable to allocate memory for the SQL string");
            this.lb = this.fb;
            this.$a = this.sb = null;
          }
          function e(f) {
            this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0);
            if (null != f) {
              var l = this.filename, n = "/", p = l;
              n && (n = "string" == typeof n ? n : ha(n), p = l ? ia(n + "/" + l) : n);
              l = ja(true, true);
              p = ka(
                p,
                l
              );
              if (f) {
                if ("string" == typeof f) {
                  n = Array(f.length);
                  for (var r = 0, w = f.length; r < w; ++r) n[r] = f.charCodeAt(r);
                  f = n;
                }
                ma(p, l | 146);
                n = na(p, 577);
                oa(n, f, 0, f.length, 0);
                pa(n);
                ma(p, l);
              }
            }
            this.handleError(q(this.filename, g));
            this.db = t(g, "i32");
            ob(this.db);
            this.gb = {};
            this.Sa = {};
          }
          var g = y(4), h = k.cwrap, q = h("sqlite3_open", "number", ["string", "number"]), v = h("sqlite3_close_v2", "number", ["number"]), u = h("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]), x = h("sqlite3_changes", "number", ["number"]), D = h(
            "sqlite3_prepare_v2",
            "number",
            ["number", "string", "number", "number", "number"]
          ), pb = h("sqlite3_sql", "string", ["number"]), nc = h("sqlite3_normalized_sql", "string", ["number"]), qb = h("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]), oc = h("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]), rb = h("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]), pc = h("sqlite3_bind_double", "number", ["number", "number", "number"]), qc = h("sqlite3_bind_int", "number", [
            "number",
            "number",
            "number"
          ]), rc = h("sqlite3_bind_parameter_index", "number", ["number", "string"]), sc = h("sqlite3_step", "number", ["number"]), tc = h("sqlite3_errmsg", "string", ["number"]), uc = h("sqlite3_column_count", "number", ["number"]), vc = h("sqlite3_data_count", "number", ["number"]), wc = h("sqlite3_column_double", "number", ["number", "number"]), sb = h("sqlite3_column_text", "string", ["number", "number"]), xc = h("sqlite3_column_blob", "number", ["number", "number"]), yc = h("sqlite3_column_bytes", "number", ["number", "number"]), zc = h(
            "sqlite3_column_type",
            "number",
            ["number", "number"]
          ), Ac = h("sqlite3_column_name", "string", ["number", "number"]), Bc = h("sqlite3_reset", "number", ["number"]), Cc = h("sqlite3_clear_bindings", "number", ["number"]), Dc = h("sqlite3_finalize", "number", ["number"]), tb = h("sqlite3_create_function_v2", "number", "number string number number number number number number number".split(" ")), hc = h("sqlite3_value_type", "number", ["number"]), kc = h("sqlite3_value_bytes", "number", ["number"]), jc = h("sqlite3_value_text", "string", ["number"]), lc = h(
            "sqlite3_value_blob",
            "number",
            ["number"]
          ), ic = h("sqlite3_value_double", "number", ["number"]), ec = h("sqlite3_result_double", "", ["number", "number"]), lb = h("sqlite3_result_null", "", ["number"]), fc = h("sqlite3_result_text", "", ["number", "string", "number", "number"]), gc = h("sqlite3_result_blob", "", ["number", "number", "number", "number"]), dc = h("sqlite3_result_int", "", ["number", "number"]), va = h("sqlite3_result_error", "", ["number", "string", "number"]), ub = h("sqlite3_aggregate_context", "number", ["number", "number"]), ob = h(
            "RegisterExtensionFunctions",
            "number",
            ["number"]
          ), vb = h("sqlite3_update_hook", "number", ["number", "number", "number"]);
          c.prototype.bind = function(f) {
            if (!this.Qa) throw "Statement closed";
            this.reset();
            return Array.isArray(f) ? this.Gb(f) : null != f && "object" === typeof f ? this.Hb(f) : true;
          };
          c.prototype.step = function() {
            if (!this.Qa) throw "Statement closed";
            this.Oa = 1;
            var f = sc(this.Qa);
            switch (f) {
              case 100:
                return true;
              case 101:
                return false;
              default:
                throw this.db.handleError(f);
            }
          };
          c.prototype.Ab = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            return wc(this.Qa, f);
          };
          c.prototype.Ob = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            f = sb(this.Qa, f);
            if ("function" !== typeof BigInt) throw Error("BigInt is not supported");
            return BigInt(f);
          };
          c.prototype.Tb = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            return sb(this.Qa, f);
          };
          c.prototype.getBlob = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            var l = yc(this.Qa, f);
            f = xc(this.Qa, f);
            for (var n = new Uint8Array(l), p = 0; p < l; p += 1) n[p] = m[f + p];
            return n;
          };
          c.prototype.get = function(f, l) {
            l = l || {};
            null != f && this.bind(f) && this.step();
            f = [];
            for (var n = vc(this.Qa), p = 0; p < n; p += 1) switch (zc(this.Qa, p)) {
              case 1:
                var r = l.useBigInt ? this.Ob(p) : this.Ab(p);
                f.push(r);
                break;
              case 2:
                f.push(this.Ab(p));
                break;
              case 3:
                f.push(this.Tb(p));
                break;
              case 4:
                f.push(this.getBlob(p));
                break;
              default:
                f.push(null);
            }
            return f;
          };
          c.prototype.qb = function() {
            for (var f = [], l = uc(this.Qa), n = 0; n < l; n += 1) f.push(Ac(this.Qa, n));
            return f;
          };
          c.prototype.zb = function(f, l) {
            f = this.get(f, l);
            l = this.qb();
            for (var n = {}, p = 0; p < l.length; p += 1) n[l[p]] = f[p];
            return n;
          };
          c.prototype.Sb = function() {
            return pb(this.Qa);
          };
          c.prototype.Pb = function() {
            return nc(this.Qa);
          };
          c.prototype.run = function(f) {
            null != f && this.bind(f);
            this.step();
            return this.reset();
          };
          c.prototype.wb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            f = fa(f);
            this.mb.push(f);
            this.db.handleError(oc(this.Qa, l, f, -1, 0));
          };
          c.prototype.Fb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            var n = da(f.length);
            m.set(f, n);
            this.mb.push(n);
            this.db.handleError(rb(this.Qa, l, n, f.length, 0));
          };
          c.prototype.vb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            this.db.handleError((f === (f | 0) ? qc : pc)(
              this.Qa,
              l,
              f
            ));
          };
          c.prototype.Ib = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            rb(this.Qa, f, 0, 0, 0);
          };
          c.prototype.xb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            switch (typeof f) {
              case "string":
                this.wb(f, l);
                return;
              case "number":
                this.vb(f, l);
                return;
              case "bigint":
                this.wb(f.toString(), l);
                return;
              case "boolean":
                this.vb(f + 0, l);
                return;
              case "object":
                if (null === f) {
                  this.Ib(l);
                  return;
                }
                if (null != f.length) {
                  this.Fb(f, l);
                  return;
                }
            }
            throw "Wrong API use : tried to bind a value of an unknown type (" + f + ").";
          };
          c.prototype.Hb = function(f) {
            var l = this;
            Object.keys(f).forEach(function(n) {
              var p = rc(l.Qa, n);
              0 !== p && l.xb(f[n], p);
            });
            return true;
          };
          c.prototype.Gb = function(f) {
            for (var l = 0; l < f.length; l += 1) this.xb(f[l], l + 1);
            return true;
          };
          c.prototype.reset = function() {
            this.freemem();
            return 0 === Cc(this.Qa) && 0 === Bc(this.Qa);
          };
          c.prototype.freemem = function() {
            for (var f; void 0 !== (f = this.mb.pop()); ) ea(f);
          };
          c.prototype.Ya = function() {
            this.freemem();
            var f = 0 === Dc(this.Qa);
            delete this.db.gb[this.Qa];
            this.Qa = 0;
            return f;
          };
          d.prototype.next = function() {
            if (null === this.fb) return { done: true };
            null !== this.$a && (this.$a.Ya(), this.$a = null);
            if (!this.db.db) throw this.ob(), Error("Database closed");
            var f = qa(), l = y(4);
            ra(g);
            ra(l);
            try {
              this.db.handleError(qb(this.db.db, this.lb, -1, g, l));
              this.lb = t(l, "i32");
              var n = t(g, "i32");
              if (0 === n) return this.ob(), { done: true };
              this.$a = new c(n, this.db);
              this.db.gb[n] = this.$a;
              return { value: this.$a, done: false };
            } catch (p) {
              throw this.sb = z(this.lb), this.ob(), p;
            } finally {
              sa(f);
            }
          };
          d.prototype.ob = function() {
            ea(this.fb);
            this.fb = null;
          };
          d.prototype.Qb = function() {
            return null !== this.sb ? this.sb : z(this.lb);
          };
          "function" === typeof Symbol && "symbol" === typeof Symbol.iterator && (d.prototype[Symbol.iterator] = function() {
            return this;
          });
          e.prototype.run = function(f, l) {
            if (!this.db) throw "Database closed";
            if (l) {
              f = this.tb(f, l);
              try {
                f.step();
              } finally {
                f.Ya();
              }
            } else this.handleError(u(this.db, f, 0, 0, g));
            return this;
          };
          e.prototype.exec = function(f, l, n) {
            if (!this.db) throw "Database closed";
            var p = qa(), r = null, w = null, J = null;
            try {
              J = w = fa(f);
              var I = y(4);
              for (f = []; 0 !== t(J, "i8"); ) {
                ra(g);
                ra(I);
                this.handleError(qb(this.db, J, -1, g, I));
                var L = t(g, "i32");
                J = t(I, "i32");
                if (0 !== L) {
                  var G = null;
                  r = new c(L, this);
                  for (null != l && r.bind(l); r.step(); ) null === G && (G = { columns: r.qb(), values: [] }, f.push(G)), G.values.push(r.get(null, n));
                  r.Ya();
                }
              }
              return f;
            } catch (la) {
              throw r && r.Ya(), la;
            } finally {
              w && ea(w), sa(p);
            }
          };
          e.prototype.Mb = function(f, l, n, p, r) {
            "function" === typeof l && (p = n, n = l, l = void 0);
            f = this.tb(f, l);
            try {
              for (; f.step(); ) n(f.zb(null, r));
            } finally {
              f.Ya();
            }
            if ("function" === typeof p) return p();
          };
          e.prototype.tb = function(f, l) {
            ra(g);
            this.handleError(D(this.db, f, -1, g, 0));
            f = t(g, "i32");
            if (0 === f) throw "Nothing to prepare";
            var n = new c(f, this);
            null != l && n.bind(l);
            return this.gb[f] = n;
          };
          e.prototype.Ub = function(f) {
            return new d(f, this);
          };
          e.prototype.Nb = function() {
            Object.values(this.gb).forEach(function(l) {
              l.Ya();
            });
            Object.values(this.Sa).forEach(A);
            this.Sa = {};
            this.handleError(v(this.db));
            var f = ta(this.filename);
            this.handleError(q(this.filename, g));
            this.db = t(g, "i32");
            ob(this.db);
            return f;
          };
          e.prototype.close = function() {
            null !== this.db && (Object.values(this.gb).forEach(function(f) {
              f.Ya();
            }), Object.values(this.Sa).forEach(A), this.Sa = {}, this.Za && (A(this.Za), this.Za = void 0), this.handleError(v(this.db)), ua("/" + this.filename), this.db = null);
          };
          e.prototype.handleError = function(f) {
            if (0 === f) return null;
            f = tc(this.db);
            throw Error(f);
          };
          e.prototype.Rb = function() {
            return x(this.db);
          };
          e.prototype.Kb = function(f, l) {
            Object.prototype.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
            var n = wa(function(p, r, w) {
              r = b(r, w);
              try {
                var J = l.apply(null, r);
              } catch (I) {
                va(p, I, -1);
                return;
              }
              a(p, J);
            }, "viii");
            this.Sa[f] = n;
            this.handleError(tb(this.db, f, l.length, 1, 0, n, 0, 0, 0));
            return this;
          };
          e.prototype.Jb = function(f, l) {
            var n = l.init || function() {
              return null;
            }, p = l.finalize || function(L) {
              return L;
            }, r = l.step;
            if (!r) throw "An aggregate function must have a step function in " + f;
            var w = {};
            Object.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
            l = f + "__finalize";
            Object.hasOwnProperty.call(this.Sa, l) && (A(this.Sa[l]), delete this.Sa[l]);
            var J = wa(function(L, G, la) {
              var V = ub(L, 1);
              Object.hasOwnProperty.call(w, V) || (w[V] = n());
              G = b(G, la);
              G = [w[V]].concat(G);
              try {
                w[V] = r.apply(null, G);
              } catch (Fc) {
                delete w[V], va(L, Fc, -1);
              }
            }, "viii"), I = wa(function(L) {
              var G = ub(L, 1);
              try {
                var la = p(w[G]);
              } catch (V) {
                delete w[G];
                va(L, V, -1);
                return;
              }
              a(L, la);
              delete w[G];
            }, "vi");
            this.Sa[f] = J;
            this.Sa[l] = I;
            this.handleError(tb(this.db, f, r.length - 1, 1, 0, 0, J, I, 0));
            return this;
          };
          e.prototype.Zb = function(f) {
            this.Za && (vb(this.db, 0, 0), A(this.Za), this.Za = void 0);
            if (!f) return this;
            this.Za = wa(function(l, n, p, r, w) {
              switch (n) {
                case 18:
                  l = "insert";
                  break;
                case 23:
                  l = "update";
                  break;
                case 9:
                  l = "delete";
                  break;
                default:
                  throw "unknown operationCode in updateHook callback: " + n;
              }
              p = z(p);
              r = z(r);
              if (w > Number.MAX_SAFE_INTEGER) throw "rowId too big to fit inside a Number";
              f(l, p, r, Number(w));
            }, "viiiij");
            vb(this.db, this.Za, 0);
            return this;
          };
          c.prototype.bind = c.prototype.bind;
          c.prototype.step = c.prototype.step;
          c.prototype.get = c.prototype.get;
          c.prototype.getColumnNames = c.prototype.qb;
          c.prototype.getAsObject = c.prototype.zb;
          c.prototype.getSQL = c.prototype.Sb;
          c.prototype.getNormalizedSQL = c.prototype.Pb;
          c.prototype.run = c.prototype.run;
          c.prototype.reset = c.prototype.reset;
          c.prototype.freemem = c.prototype.freemem;
          c.prototype.free = c.prototype.Ya;
          d.prototype.next = d.prototype.next;
          d.prototype.getRemainingSQL = d.prototype.Qb;
          e.prototype.run = e.prototype.run;
          e.prototype.exec = e.prototype.exec;
          e.prototype.each = e.prototype.Mb;
          e.prototype.prepare = e.prototype.tb;
          e.prototype.iterateStatements = e.prototype.Ub;
          e.prototype["export"] = e.prototype.Nb;
          e.prototype.close = e.prototype.close;
          e.prototype.handleError = e.prototype.handleError;
          e.prototype.getRowsModified = e.prototype.Rb;
          e.prototype.create_function = e.prototype.Kb;
          e.prototype.create_aggregate = e.prototype.Jb;
          e.prototype.updateHook = e.prototype.Zb;
          k.Database = e;
        };
        var xa = "./this.program", ya = (a, b) => {
          throw b;
        }, za = globalThis.document?.currentScript?.src;
        "undefined" != typeof __filename ? za = __filename : ba && (za = self.location.href);
        var Aa = "", Ba, Ca;
        if (ca) {
          var fs2 = __require("node:fs");
          Aa = __dirname + "/";
          Ca = (a) => {
            a = Da(a) ? new URL(a) : a;
            return fs2.readFileSync(a);
          };
          Ba = async (a) => {
            a = Da(a) ? new URL(a) : a;
            return fs2.readFileSync(a, void 0);
          };
          1 < process.argv.length && (xa = process.argv[1].replace(/\\/g, "/"));
          process.argv.slice(2);
          "undefined" != typeof module && (module.exports = k);
          ya = (a, b) => {
            process.exitCode = a;
            throw b;
          };
        } else if (aa || ba) {
          try {
            Aa = new URL(".", za).href;
          } catch {
          }
          ba && (Ca = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, false);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          });
          Ba = async (a) => {
            if (Da(a)) return new Promise((c, d) => {
              var e = new XMLHttpRequest();
              e.open("GET", a, true);
              e.responseType = "arraybuffer";
              e.onload = () => {
                200 == e.status || 0 == e.status && e.response ? c(e.response) : d(e.status);
              };
              e.onerror = d;
              e.send(null);
            });
            var b = await fetch(a, { credentials: "same-origin" });
            if (b.ok) return b.arrayBuffer();
            throw Error(b.status + " : " + b.url);
          };
        }
        var Ea = console.log.bind(console), B = console.error.bind(console), Fa, Ga = false, Ha, Da = (a) => a.startsWith("file://"), m, C, Ia, E, F, Ja, Ka, H;
        function La() {
          var a = Ma.buffer;
          m = new Int8Array(a);
          Ia = new Int16Array(a);
          C = new Uint8Array(a);
          new Uint16Array(a);
          E = new Int32Array(a);
          F = new Uint32Array(a);
          Ja = new Float32Array(a);
          Ka = new Float64Array(a);
          H = new BigInt64Array(a);
          new BigUint64Array(a);
        }
        function Na(a) {
          k.onAbort?.(a);
          a = "Aborted(" + a + ")";
          B(a);
          Ga = true;
          throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
        }
        var Oa;
        async function Pa(a) {
          if (!Fa) try {
            var b = await Ba(a);
            return new Uint8Array(b);
          } catch {
          }
          if (a == Oa && Fa) a = new Uint8Array(Fa);
          else if (Ca) a = Ca(a);
          else throw "both async and sync fetching of the wasm failed";
          return a;
        }
        async function Qa(a, b) {
          try {
            var c = await Pa(a);
            return await WebAssembly.instantiate(c, b);
          } catch (d) {
            B(`failed to asynchronously prepare wasm: ${d}`), Na(d);
          }
        }
        async function Ra(a) {
          var b = Oa;
          if (!Fa && !Da(b) && !ca) try {
            var c = fetch(b, { credentials: "same-origin" });
            return await WebAssembly.instantiateStreaming(c, a);
          } catch (d) {
            B(`wasm streaming compile failed: ${d}`), B("falling back to ArrayBuffer instantiation");
          }
          return Qa(b, a);
        }
        class Sa {
          name = "ExitStatus";
          constructor(a) {
            this.message = `Program terminated with exit(${a})`;
            this.status = a;
          }
        }
        var Ta = (a) => {
          for (; 0 < a.length; ) a.shift()(k);
        }, Ua = [], Va = [], Wa = () => {
          var a = k.preRun.shift();
          Va.push(a);
        }, K = 0, Xa = null;
        function t(a, b = "i8") {
          b.endsWith("*") && (b = "*");
          switch (b) {
            case "i1":
              return m[a];
            case "i8":
              return m[a];
            case "i16":
              return Ia[a >> 1];
            case "i32":
              return E[a >> 2];
            case "i64":
              return H[a >> 3];
            case "float":
              return Ja[a >> 2];
            case "double":
              return Ka[a >> 3];
            case "*":
              return F[a >> 2];
            default:
              Na(`invalid type for getValue: ${b}`);
          }
        }
        var Ya = true;
        function ra(a) {
          var b = "i32";
          b.endsWith("*") && (b = "*");
          switch (b) {
            case "i1":
              m[a] = 0;
              break;
            case "i8":
              m[a] = 0;
              break;
            case "i16":
              Ia[a >> 1] = 0;
              break;
            case "i32":
              E[a >> 2] = 0;
              break;
            case "i64":
              H[a >> 3] = BigInt(0);
              break;
            case "float":
              Ja[a >> 2] = 0;
              break;
            case "double":
              Ka[a >> 3] = 0;
              break;
            case "*":
              F[a >> 2] = 0;
              break;
            default:
              Na(`invalid type for setValue: ${b}`);
          }
        }
        var Za = new TextDecoder(), $a = (a, b, c, d) => {
          c = b + c;
          if (d) return c;
          for (; a[b] && !(b >= c); ) ++b;
          return b;
        }, z = (a, b, c) => a ? Za.decode(C.subarray(a, $a(C, a, b, c))) : "", ab = (a, b) => {
          for (var c = 0, d = a.length - 1; 0 <= d; d--) {
            var e = a[d];
            "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
          }
          if (b) for (; c; c--) a.unshift("..");
          return a;
        }, ia = (a) => {
          var b = "/" === a.charAt(0), c = "/" === a.slice(-1);
          (a = ab(a.split("/").filter((d) => !!d), !b).join("/")) || b || (a = ".");
          a && c && (a += "/");
          return (b ? "/" : "") + a;
        }, bb = (a) => {
          var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
          a = b[0];
          b = b[1];
          if (!a && !b) return ".";
          b &&= b.slice(0, -1);
          return a + b;
        }, cb = (a) => a && a.match(/([^\/]+|\/)\/*$/)[1], db = () => {
          if (ca) {
            var a = __require("node:crypto");
            return (b) => a.randomFillSync(b);
          }
          return (b) => crypto.getRandomValues(b);
        }, eb = (a) => {
          (eb = db())(a);
        }, fb = (...a) => {
          for (var b = "", c = false, d = a.length - 1; -1 <= d && !c; d--) {
            c = 0 <= d ? a[d] : "/";
            if ("string" != typeof c) throw new TypeError("Arguments to path.resolve must be strings");
            if (!c) return "";
            b = c + "/" + b;
            c = "/" === c.charAt(0);
          }
          b = ab(b.split("/").filter((e) => !!e), !c).join("/");
          return (c ? "/" : "") + b || ".";
        }, gb = (a) => {
          var b = $a(a, 0);
          return Za.decode(a.buffer ? a.subarray(0, b) : new Uint8Array(a.slice(0, b)));
        }, hb = [], ib = (a) => {
          for (var b = 0, c = 0; c < a.length; ++c) {
            var d = a.charCodeAt(c);
            127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
          }
          return b;
        }, M = (a, b, c, d) => {
          if (!(0 < d)) return 0;
          var e = c;
          d = c + d - 1;
          for (var g = 0; g < a.length; ++g) {
            var h = a.codePointAt(g);
            if (127 >= h) {
              if (c >= d) break;
              b[c++] = h;
            } else if (2047 >= h) {
              if (c + 1 >= d) break;
              b[c++] = 192 | h >> 6;
              b[c++] = 128 | h & 63;
            } else if (65535 >= h) {
              if (c + 2 >= d) break;
              b[c++] = 224 | h >> 12;
              b[c++] = 128 | h >> 6 & 63;
              b[c++] = 128 | h & 63;
            } else {
              if (c + 3 >= d) break;
              b[c++] = 240 | h >> 18;
              b[c++] = 128 | h >> 12 & 63;
              b[c++] = 128 | h >> 6 & 63;
              b[c++] = 128 | h & 63;
              g++;
            }
          }
          b[c] = 0;
          return c - e;
        }, jb = [];
        function kb(a, b) {
          jb[a] = { input: [], output: [], eb: b };
          mb(a, nb);
        }
        var nb = { open(a) {
          var b = jb[a.node.rdev];
          if (!b) throw new N(43);
          a.tty = b;
          a.seekable = false;
        }, close(a) {
          a.tty.eb.fsync(a.tty);
        }, fsync(a) {
          a.tty.eb.fsync(a.tty);
        }, read(a, b, c, d) {
          if (!a.tty || !a.tty.eb.Bb) throw new N(60);
          for (var e = 0, g = 0; g < d; g++) {
            try {
              var h = a.tty.eb.Bb(a.tty);
            } catch (q) {
              throw new N(29);
            }
            if (void 0 === h && 0 === e) throw new N(6);
            if (null === h || void 0 === h) break;
            e++;
            b[c + g] = h;
          }
          e && (a.node.atime = Date.now());
          return e;
        }, write(a, b, c, d) {
          if (!a.tty || !a.tty.eb.ub) throw new N(60);
          try {
            for (var e = 0; e < d; e++) a.tty.eb.ub(a.tty, b[c + e]);
          } catch (g) {
            throw new N(29);
          }
          d && (a.node.mtime = a.node.ctime = Date.now());
          return e;
        } }, wb = { Bb() {
          a: {
            if (!hb.length) {
              var a = null;
              if (ca) {
                var b = Buffer.alloc(256), c = 0, d = process.stdin.fd;
                try {
                  c = fs2.readSync(d, b, 0, 256);
                } catch (e) {
                  if (e.toString().includes("EOF")) c = 0;
                  else throw e;
                }
                0 < c && (a = b.slice(0, c).toString("utf-8"));
              } else globalThis.window?.prompt && (a = window.prompt("Input: "), null !== a && (a += "\n"));
              if (!a) {
                a = null;
                break a;
              }
              b = Array(ib(a) + 1);
              a = M(a, b, 0, b.length);
              b.length = a;
              hb = b;
            }
            a = hb.shift();
          }
          return a;
        }, ub(a, b) {
          null === b || 10 === b ? (Ea(gb(a.output)), a.output = []) : 0 != b && a.output.push(b);
        }, fsync(a) {
          0 < a.output?.length && (Ea(gb(a.output)), a.output = []);
        }, hc() {
          return { bc: 25856, dc: 5, ac: 191, cc: 35387, $b: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
        }, ic() {
          return 0;
        }, jc() {
          return [24, 80];
        } }, xb = { ub(a, b) {
          null === b || 10 === b ? (B(gb(a.output)), a.output = []) : 0 != b && a.output.push(b);
        }, fsync(a) {
          0 < a.output?.length && (B(gb(a.output)), a.output = []);
        } }, O = { Wa: null, Xa() {
          return O.createNode(null, "/", 16895, 0);
        }, createNode(a, b, c, d) {
          if (24576 === (c & 61440) || 4096 === (c & 61440)) throw new N(63);
          O.Wa || (O.Wa = { dir: { node: { Ta: O.La.Ta, Ua: O.La.Ua, lookup: O.La.lookup, ib: O.La.ib, rename: O.La.rename, unlink: O.La.unlink, rmdir: O.La.rmdir, readdir: O.La.readdir, symlink: O.La.symlink }, stream: { Va: O.Ma.Va } }, file: { node: { Ta: O.La.Ta, Ua: O.La.Ua }, stream: { Va: O.Ma.Va, read: O.Ma.read, write: O.Ma.write, jb: O.Ma.jb, kb: O.Ma.kb } }, link: { node: { Ta: O.La.Ta, Ua: O.La.Ua, readlink: O.La.readlink }, stream: {} }, yb: { node: { Ta: O.La.Ta, Ua: O.La.Ua }, stream: yb } });
          c = zb(a, b, c, d);
          P(c.mode) ? (c.La = O.Wa.dir.node, c.Ma = O.Wa.dir.stream, c.Na = {}) : 32768 === (c.mode & 61440) ? (c.La = O.Wa.file.node, c.Ma = O.Wa.file.stream, c.Ra = 0, c.Na = null) : 40960 === (c.mode & 61440) ? (c.La = O.Wa.link.node, c.Ma = O.Wa.link.stream) : 8192 === (c.mode & 61440) && (c.La = O.Wa.yb.node, c.Ma = O.Wa.yb.stream);
          c.atime = c.mtime = c.ctime = Date.now();
          a && (a.Na[b] = c, a.atime = a.mtime = a.ctime = c.atime);
          return c;
        }, fc(a) {
          return a.Na ? a.Na.subarray ? a.Na.subarray(0, a.Ra) : new Uint8Array(a.Na) : new Uint8Array(0);
        }, La: {
          Ta(a) {
            var b = {};
            b.dev = 8192 === (a.mode & 61440) ? a.id : 1;
            b.ino = a.id;
            b.mode = a.mode;
            b.nlink = 1;
            b.uid = 0;
            b.gid = 0;
            b.rdev = a.rdev;
            P(a.mode) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.Ra : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
            b.atime = new Date(a.atime);
            b.mtime = new Date(a.mtime);
            b.ctime = new Date(a.ctime);
            b.blksize = 4096;
            b.blocks = Math.ceil(b.size / b.blksize);
            return b;
          },
          Ua(a, b) {
            for (var c of ["mode", "atime", "mtime", "ctime"]) null != b[c] && (a[c] = b[c]);
            void 0 !== b.size && (b = b.size, a.Ra != b && (0 == b ? (a.Na = null, a.Ra = 0) : (c = a.Na, a.Na = new Uint8Array(b), c && a.Na.set(c.subarray(0, Math.min(b, a.Ra))), a.Ra = b)));
          },
          lookup() {
            O.nb || (O.nb = new N(44), O.nb.stack = "<generic error, no stack>");
            throw O.nb;
          },
          ib(a, b, c, d) {
            return O.createNode(a, b, c, d);
          },
          rename(a, b, c) {
            try {
              var d = Q(b, c);
            } catch (g) {
            }
            if (d) {
              if (P(a.mode)) for (var e in d.Na) throw new N(55);
              Ab(d);
            }
            delete a.parent.Na[a.name];
            b.Na[c] = a;
            a.name = c;
            b.ctime = b.mtime = a.parent.ctime = a.parent.mtime = Date.now();
          },
          unlink(a, b) {
            delete a.Na[b];
            a.ctime = a.mtime = Date.now();
          },
          rmdir(a, b) {
            var c = Q(a, b), d;
            for (d in c.Na) throw new N(55);
            delete a.Na[b];
            a.ctime = a.mtime = Date.now();
          },
          readdir(a) {
            return [".", "..", ...Object.keys(a.Na)];
          },
          symlink(a, b, c) {
            a = O.createNode(a, b, 41471, 0);
            a.link = c;
            return a;
          },
          readlink(a) {
            if (40960 !== (a.mode & 61440)) throw new N(28);
            return a.link;
          }
        }, Ma: { read(a, b, c, d, e) {
          var g = a.node.Na;
          if (e >= a.node.Ra) return 0;
          a = Math.min(a.node.Ra - e, d);
          if (8 < a && g.subarray) b.set(g.subarray(e, e + a), c);
          else for (d = 0; d < a; d++) b[c + d] = g[e + d];
          return a;
        }, write(a, b, c, d, e, g) {
          b.buffer === m.buffer && (g = false);
          if (!d) return 0;
          a = a.node;
          a.mtime = a.ctime = Date.now();
          if (b.subarray && (!a.Na || a.Na.subarray)) {
            if (g) return a.Na = b.subarray(c, c + d), a.Ra = d;
            if (0 === a.Ra && 0 === e) return a.Na = b.slice(c, c + d), a.Ra = d;
            if (e + d <= a.Ra) return a.Na.set(b.subarray(c, c + d), e), d;
          }
          g = e + d;
          var h = a.Na ? a.Na.length : 0;
          h >= g || (g = Math.max(g, h * (1048576 > h ? 2 : 1.125) >>> 0), 0 != h && (g = Math.max(g, 256)), h = a.Na, a.Na = new Uint8Array(g), 0 < a.Ra && a.Na.set(h.subarray(0, a.Ra), 0));
          if (a.Na.subarray && b.subarray) a.Na.set(b.subarray(c, c + d), e);
          else for (g = 0; g < d; g++) a.Na[e + g] = b[c + g];
          a.Ra = Math.max(a.Ra, e + d);
          return d;
        }, Va(a, b, c) {
          1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Ra);
          if (0 > b) throw new N(28);
          return b;
        }, jb(a, b, c, d, e) {
          if (32768 !== (a.node.mode & 61440)) throw new N(43);
          a = a.node.Na;
          if (e & 2 || !a || a.buffer !== m.buffer) {
            e = true;
            d = 65536 * Math.ceil(b / 65536);
            var g = Bb(65536, d);
            g && C.fill(0, g, g + d);
            d = g;
            if (!d) throw new N(48);
            if (a) {
              if (0 < c || c + b < a.length) a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
              m.set(a, d);
            }
          } else e = false, d = a.byteOffset;
          return { Xb: d, Eb: e };
        }, kb(a, b, c, d) {
          O.Ma.write(a, b, 0, d, c, false);
          return 0;
        } } }, ja = (a, b) => {
          var c = 0;
          a && (c |= 365);
          b && (c |= 146);
          return c;
        }, Cb = null, Db = {}, Eb = [], Fb = 1, R = null, Gb = false, Hb = true, Ib = {}, N = class {
          name = "ErrnoError";
          constructor(a) {
            this.Pa = a;
          }
        }, Jb = class {
          hb = {};
          node = null;
          get flags() {
            return this.hb.flags;
          }
          set flags(a) {
            this.hb.flags = a;
          }
          get position() {
            return this.hb.position;
          }
          set position(a) {
            this.hb.position = a;
          }
        }, Kb = class {
          La = {};
          Ma = {};
          bb = null;
          constructor(a, b, c, d) {
            a ||= this;
            this.parent = a;
            this.Xa = a.Xa;
            this.id = Fb++;
            this.name = b;
            this.mode = c;
            this.rdev = d;
            this.atime = this.mtime = this.ctime = Date.now();
          }
          get read() {
            return 365 === (this.mode & 365);
          }
          set read(a) {
            a ? this.mode |= 365 : this.mode &= -366;
          }
          get write() {
            return 146 === (this.mode & 146);
          }
          set write(a) {
            a ? this.mode |= 146 : this.mode &= -147;
          }
        };
        function S(a, b = {}) {
          if (!a) throw new N(44);
          b.pb ?? (b.pb = true);
          "/" === a.charAt(0) || (a = "//" + a);
          var c = 0;
          a: for (; 40 > c; c++) {
            a = a.split("/").filter((q) => !!q);
            for (var d = Cb, e = "/", g = 0; g < a.length; g++) {
              var h = g === a.length - 1;
              if (h && b.parent) break;
              if ("." !== a[g]) if (".." === a[g]) if (e = bb(e), d === d.parent) {
                a = e + "/" + a.slice(g + 1).join("/");
                c--;
                continue a;
              } else d = d.parent;
              else {
                e = ia(e + "/" + a[g]);
                try {
                  d = Q(d, a[g]);
                } catch (q) {
                  if (44 === q?.Pa && h && b.Wb) return { path: e };
                  throw q;
                }
                !d.bb || h && !b.pb || (d = d.bb.root);
                if (40960 === (d.mode & 61440) && (!h || b.ab)) {
                  if (!d.La.readlink) throw new N(52);
                  d = d.La.readlink(d);
                  "/" === d.charAt(0) || (d = bb(e) + "/" + d);
                  a = d + "/" + a.slice(g + 1).join("/");
                  continue a;
                }
              }
            }
            return { path: e, node: d };
          }
          throw new N(32);
        }
        function ha(a) {
          for (var b; ; ) {
            if (a === a.parent) return a = a.Xa.Db, b ? "/" !== a[a.length - 1] ? `${a}/${b}` : a + b : a;
            b = b ? `${a.name}/${b}` : a.name;
            a = a.parent;
          }
        }
        function Lb(a, b) {
          for (var c = 0, d = 0; d < b.length; d++) c = (c << 5) - c + b.charCodeAt(d) | 0;
          return (a + c >>> 0) % R.length;
        }
        function Ab(a) {
          var b = Lb(a.parent.id, a.name);
          if (R[b] === a) R[b] = a.cb;
          else for (b = R[b]; b; ) {
            if (b.cb === a) {
              b.cb = a.cb;
              break;
            }
            b = b.cb;
          }
        }
        function Q(a, b) {
          var c = P(a.mode) ? (c = Mb(a, "x")) ? c : a.La.lookup ? 0 : 2 : 54;
          if (c) throw new N(c);
          for (c = R[Lb(a.id, b)]; c; c = c.cb) {
            var d = c.name;
            if (c.parent.id === a.id && d === b) return c;
          }
          return a.La.lookup(a, b);
        }
        function zb(a, b, c, d) {
          a = new Kb(a, b, c, d);
          b = Lb(a.parent.id, a.name);
          a.cb = R[b];
          return R[b] = a;
        }
        function P(a) {
          return 16384 === (a & 61440);
        }
        function Nb(a) {
          var b = ["r", "w", "rw"][a & 3];
          a & 512 && (b += "w");
          return b;
        }
        function Mb(a, b) {
          if (Hb) return 0;
          if (!b.includes("r") || a.mode & 292) {
            if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) return 2;
          } else return 2;
          return 0;
        }
        function Ob(a, b) {
          if (!P(a.mode)) return 54;
          try {
            return Q(a, b), 20;
          } catch (c) {
          }
          return Mb(a, "wx");
        }
        function Pb(a, b, c) {
          try {
            var d = Q(a, b);
          } catch (e) {
            return e.Pa;
          }
          if (a = Mb(a, "wx")) return a;
          if (c) {
            if (!P(d.mode)) return 54;
            if (d === d.parent || "/" === ha(d)) return 10;
          } else if (P(d.mode)) return 31;
          return 0;
        }
        function Qb(a) {
          if (!a) throw new N(63);
          return a;
        }
        function T(a) {
          a = Eb[a];
          if (!a) throw new N(8);
          return a;
        }
        function Rb(a, b = -1) {
          a = Object.assign(new Jb(), a);
          if (-1 == b) a: {
            for (b = 0; 4096 >= b; b++) if (!Eb[b]) break a;
            throw new N(33);
          }
          a.fd = b;
          return Eb[b] = a;
        }
        function Sb(a, b = -1) {
          a = Rb(a, b);
          a.Ma?.ec?.(a);
          return a;
        }
        function Tb(a, b, c) {
          var d = a?.Ma.Ua;
          a = d ? a : b;
          d ??= b.La.Ua;
          Qb(d);
          d(a, c);
        }
        var yb = { open(a) {
          a.Ma = Db[a.node.rdev].Ma;
          a.Ma.open?.(a);
        }, Va() {
          throw new N(70);
        } };
        function mb(a, b) {
          Db[a] = { Ma: b };
        }
        function Ub(a, b) {
          var c = "/" === b;
          if (c && Cb) throw new N(10);
          if (!c && b) {
            var d = S(b, { pb: false });
            b = d.path;
            d = d.node;
            if (d.bb) throw new N(10);
            if (!P(d.mode)) throw new N(54);
          }
          b = { type: a, kc: {}, Db: b, Vb: [] };
          a = a.Xa(b);
          a.Xa = b;
          b.root = a;
          c ? Cb = a : d && (d.bb = b, d.Xa && d.Xa.Vb.push(b));
        }
        function Vb(a, b, c) {
          var d = S(a, { parent: true }).node;
          a = cb(a);
          if (!a) throw new N(28);
          if ("." === a || ".." === a) throw new N(20);
          var e = Ob(d, a);
          if (e) throw new N(e);
          if (!d.La.ib) throw new N(63);
          return d.La.ib(d, a, b, c);
        }
        function ka(a, b = 438) {
          return Vb(a, b & 4095 | 32768, 0);
        }
        function U(a, b = 511) {
          return Vb(a, b & 1023 | 16384, 0);
        }
        function Wb(a, b, c) {
          "undefined" == typeof c && (c = b, b = 438);
          Vb(a, b | 8192, c);
        }
        function Xb(a, b) {
          if (!fb(a)) throw new N(44);
          var c = S(b, { parent: true }).node;
          if (!c) throw new N(44);
          b = cb(b);
          var d = Ob(c, b);
          if (d) throw new N(d);
          if (!c.La.symlink) throw new N(63);
          c.La.symlink(c, b, a);
        }
        function Yb(a) {
          var b = S(a, { parent: true }).node;
          a = cb(a);
          var c = Q(b, a), d = Pb(b, a, true);
          if (d) throw new N(d);
          if (!b.La.rmdir) throw new N(63);
          if (c.bb) throw new N(10);
          b.La.rmdir(b, a);
          Ab(c);
        }
        function ua(a) {
          var b = S(a, { parent: true }).node;
          if (!b) throw new N(44);
          a = cb(a);
          var c = Q(b, a), d = Pb(b, a, false);
          if (d) throw new N(d);
          if (!b.La.unlink) throw new N(63);
          if (c.bb) throw new N(10);
          b.La.unlink(b, a);
          Ab(c);
        }
        function Zb(a, b) {
          a = S(a, { ab: !b }).node;
          return Qb(a.La.Ta)(a);
        }
        function $b(a, b, c, d) {
          Tb(a, b, { mode: c & 4095 | b.mode & -4096, ctime: Date.now(), Lb: d });
        }
        function ma(a, b) {
          a = "string" == typeof a ? S(a, { ab: true }).node : a;
          $b(null, a, b);
        }
        function ac(a, b, c) {
          if (P(b.mode)) throw new N(31);
          if (32768 !== (b.mode & 61440)) throw new N(28);
          var d = Mb(b, "w");
          if (d) throw new N(d);
          Tb(a, b, { size: c, timestamp: Date.now() });
        }
        function na(a, b, c = 438) {
          if ("" === a) throw new N(44);
          if ("string" == typeof b) {
            var d = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[b];
            if ("undefined" == typeof d) throw Error(`Unknown file open mode: ${b}`);
            b = d;
          }
          c = b & 64 ? c & 4095 | 32768 : 0;
          if ("object" == typeof a) d = a;
          else {
            var e = a.endsWith("/");
            a = S(a, { ab: !(b & 131072), Wb: true });
            d = a.node;
            a = a.path;
          }
          var g = false;
          if (b & 64) if (d) {
            if (b & 128) throw new N(20);
          } else {
            if (e) throw new N(31);
            d = Vb(a, c | 511, 0);
            g = true;
          }
          if (!d) throw new N(44);
          8192 === (d.mode & 61440) && (b &= -513);
          if (b & 65536 && !P(d.mode)) throw new N(54);
          if (!g && (e = d ? 40960 === (d.mode & 61440) ? 32 : P(d.mode) && ("r" !== Nb(b) || b & 576) ? 31 : Mb(d, Nb(b)) : 44)) throw new N(e);
          b & 512 && !g && (e = d, e = "string" == typeof e ? S(e, { ab: true }).node : e, ac(null, e, 0));
          b &= -131713;
          e = Rb({ node: d, path: ha(d), flags: b, seekable: true, position: 0, Ma: d.Ma, Yb: [], error: false });
          e.Ma.open && e.Ma.open(e);
          g && ma(d, c & 511);
          !k.logReadFiles || b & 1 || a in Ib || (Ib[a] = 1);
          return e;
        }
        function pa(a) {
          if (null === a.fd) throw new N(8);
          a.rb && (a.rb = null);
          try {
            a.Ma.close && a.Ma.close(a);
          } catch (b) {
            throw b;
          } finally {
            Eb[a.fd] = null;
          }
          a.fd = null;
        }
        function bc(a, b, c) {
          if (null === a.fd) throw new N(8);
          if (!a.seekable || !a.Ma.Va) throw new N(70);
          if (0 != c && 1 != c && 2 != c) throw new N(28);
          a.position = a.Ma.Va(a, b, c);
          a.Yb = [];
        }
        function cc(a, b, c, d, e) {
          if (0 > d || 0 > e) throw new N(28);
          if (null === a.fd) throw new N(8);
          if (1 === (a.flags & 2097155)) throw new N(8);
          if (P(a.node.mode)) throw new N(31);
          if (!a.Ma.read) throw new N(28);
          var g = "undefined" != typeof e;
          if (!g) e = a.position;
          else if (!a.seekable) throw new N(70);
          b = a.Ma.read(a, b, c, d, e);
          g || (a.position += b);
          return b;
        }
        function oa(a, b, c, d, e) {
          if (0 > d || 0 > e) throw new N(28);
          if (null === a.fd) throw new N(8);
          if (0 === (a.flags & 2097155)) throw new N(8);
          if (P(a.node.mode)) throw new N(31);
          if (!a.Ma.write) throw new N(28);
          a.seekable && a.flags & 1024 && bc(a, 0, 2);
          var g = "undefined" != typeof e;
          if (!g) e = a.position;
          else if (!a.seekable) throw new N(70);
          b = a.Ma.write(a, b, c, d, e, void 0);
          g || (a.position += b);
          return b;
        }
        function ta(a) {
          var b = b || 0;
          var c = "binary";
          "utf8" !== c && "binary" !== c && Na(`Invalid encoding type "${c}"`);
          b = na(a, b);
          a = Zb(a).size;
          var d = new Uint8Array(a);
          cc(b, d, 0, a, 0);
          "utf8" === c && (d = gb(d));
          pa(b);
          return d;
        }
        function W(a, b, c) {
          a = ia("/dev/" + a);
          var d = ja(!!b, !!c);
          W.Cb ?? (W.Cb = 64);
          var e = W.Cb++ << 8 | 0;
          mb(e, { open(g) {
            g.seekable = false;
          }, close() {
            c?.buffer?.length && c(10);
          }, read(g, h, q, v) {
            for (var u = 0, x = 0; x < v; x++) {
              try {
                var D = b();
              } catch (pb) {
                throw new N(29);
              }
              if (void 0 === D && 0 === u) throw new N(6);
              if (null === D || void 0 === D) break;
              u++;
              h[q + x] = D;
            }
            u && (g.node.atime = Date.now());
            return u;
          }, write(g, h, q, v) {
            for (var u = 0; u < v; u++) try {
              c(h[q + u]);
            } catch (x) {
              throw new N(29);
            }
            v && (g.node.mtime = g.node.ctime = Date.now());
            return u;
          } });
          Wb(a, d, e);
        }
        var X = {};
        function Y(a, b, c) {
          if ("/" === b.charAt(0)) return b;
          a = -100 === a ? "/" : T(a).path;
          if (0 == b.length) {
            if (!c) throw new N(44);
            return a;
          }
          return a + "/" + b;
        }
        function mc(a, b) {
          F[a >> 2] = b.dev;
          F[a + 4 >> 2] = b.mode;
          F[a + 8 >> 2] = b.nlink;
          F[a + 12 >> 2] = b.uid;
          F[a + 16 >> 2] = b.gid;
          F[a + 20 >> 2] = b.rdev;
          H[a + 24 >> 3] = BigInt(b.size);
          E[a + 32 >> 2] = 4096;
          E[a + 36 >> 2] = b.blocks;
          var c = b.atime.getTime(), d = b.mtime.getTime(), e = b.ctime.getTime();
          H[a + 40 >> 3] = BigInt(Math.floor(c / 1e3));
          F[a + 48 >> 2] = c % 1e3 * 1e6;
          H[a + 56 >> 3] = BigInt(Math.floor(d / 1e3));
          F[a + 64 >> 2] = d % 1e3 * 1e6;
          H[a + 72 >> 3] = BigInt(Math.floor(e / 1e3));
          F[a + 80 >> 2] = e % 1e3 * 1e6;
          H[a + 88 >> 3] = BigInt(b.ino);
          return 0;
        }
        var Ec = void 0, Gc = () => {
          var a = E[+Ec >> 2];
          Ec += 4;
          return a;
        }, Hc = 0, Ic = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Jc = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Kc = {}, Lc = (a) => {
          Ha = a;
          Ya || 0 < Hc || (k.onExit?.(a), Ga = true);
          ya(a, new Sa(a));
        }, Mc = (a) => {
          if (!Ga) try {
            a();
          } catch (b) {
            b instanceof Sa || "unwind" == b || ya(1, b);
          } finally {
            if (!(Ya || 0 < Hc)) try {
              Ha = a = Ha, Lc(a);
            } catch (b) {
              b instanceof Sa || "unwind" == b || ya(1, b);
            }
          }
        }, Nc = {}, Pc = () => {
          if (!Oc) {
            var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: xa || "./this.program" }, b;
            for (b in Nc) void 0 === Nc[b] ? delete a[b] : a[b] = Nc[b];
            var c = [];
            for (b in a) c.push(`${b}=${a[b]}`);
            Oc = c;
          }
          return Oc;
        }, Oc, Qc = (a, b, c, d) => {
          var e = { string: (u) => {
            var x = 0;
            if (null !== u && void 0 !== u && 0 !== u) {
              x = ib(u) + 1;
              var D = y(x);
              M(u, C, D, x);
              x = D;
            }
            return x;
          }, array: (u) => {
            var x = y(u.length);
            m.set(u, x);
            return x;
          } };
          a = k["_" + a];
          var g = [], h = 0;
          if (d) for (var q = 0; q < d.length; q++) {
            var v = e[c[q]];
            v ? (0 === h && (h = qa()), g[q] = v(d[q])) : g[q] = d[q];
          }
          c = a(...g);
          return c = (function(u) {
            0 !== h && sa(h);
            return "string" === b ? z(u) : "boolean" === b ? !!u : u;
          })(c);
        }, fa = (a) => {
          var b = ib(a) + 1, c = da(b);
          c && M(a, C, c, b);
          return c;
        }, Rc, Sc = [], A = (a) => {
          Rc.delete(Z.get(a));
          Z.set(a, null);
          Sc.push(a);
        }, Tc = (a) => {
          const b = a.length;
          return [b % 128 | 128, b >> 7, ...a];
        }, Uc = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }, Vc = (a) => Tc(Array.from(a, (b) => Uc[b])), wa = (a, b) => {
          if (!Rc) {
            Rc = /* @__PURE__ */ new WeakMap();
            var c = Z.length;
            if (Rc) for (var d = 0; d < 0 + c; d++) {
              var e = Z.get(d);
              e && Rc.set(e, d);
            }
          }
          if (c = Rc.get(a) || 0) return c;
          c = Sc.length ? Sc.pop() : Z.grow(1);
          try {
            Z.set(c, a);
          } catch (g) {
            if (!(g instanceof TypeError)) throw g;
            b = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...Tc([1, 96, ...Vc(b.slice(1)), ...Vc("v" === b[0] ? "" : b[0])]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
            b = new WebAssembly.Module(b);
            b = new WebAssembly.Instance(b, { e: { f: a } }).exports.f;
            Z.set(c, b);
          }
          Rc.set(a, c);
          return c;
        };
        R = Array(4096);
        Ub(O, "/");
        U("/tmp");
        U("/home");
        U("/home/web_user");
        (function() {
          U("/dev");
          mb(259, { read: () => 0, write: (d, e, g, h) => h, Va: () => 0 });
          Wb("/dev/null", 259);
          kb(1280, wb);
          kb(1536, xb);
          Wb("/dev/tty", 1280);
          Wb("/dev/tty1", 1536);
          var a = new Uint8Array(1024), b = 0, c = () => {
            0 === b && (eb(a), b = a.byteLength);
            return a[--b];
          };
          W("random", c);
          W("urandom", c);
          U("/dev/shm");
          U("/dev/shm/tmp");
        })();
        (function() {
          U("/proc");
          var a = U("/proc/self");
          U("/proc/self/fd");
          Ub({ Xa() {
            var b = zb(a, "fd", 16895, 73);
            b.Ma = { Va: O.Ma.Va };
            b.La = { lookup(c, d) {
              c = +d;
              var e = T(c);
              c = { parent: null, Xa: { Db: "fake" }, La: { readlink: () => e.path }, id: c + 1 };
              return c.parent = c;
            }, readdir() {
              return Array.from(Eb.entries()).filter(([, c]) => c).map(([c]) => c.toString());
            } };
            return b;
          } }, "/proc/self/fd");
        })();
        k.noExitRuntime && (Ya = k.noExitRuntime);
        k.print && (Ea = k.print);
        k.printErr && (B = k.printErr);
        k.wasmBinary && (Fa = k.wasmBinary);
        k.thisProgram && (xa = k.thisProgram);
        if (k.preInit) for ("function" == typeof k.preInit && (k.preInit = [k.preInit]); 0 < k.preInit.length; ) k.preInit.shift()();
        k.stackSave = () => qa();
        k.stackRestore = (a) => sa(a);
        k.stackAlloc = (a) => y(a);
        k.cwrap = (a, b, c, d) => {
          var e = !c || c.every((g) => "number" === g || "boolean" === g);
          return "string" !== b && e && !d ? k["_" + a] : (...g) => Qc(a, b, c, g);
        };
        k.addFunction = wa;
        k.removeFunction = A;
        k.UTF8ToString = z;
        k.stringToNewUTF8 = fa;
        k.writeArrayToMemory = (a, b) => {
          m.set(a, b);
        };
        var da, ea, Bb, Wc, sa, y, qa, Ma, Z, Xc = {
          a: (a, b, c, d) => Na(`Assertion failed: ${z(a)}, at: ` + [b ? z(b) : "unknown filename", c, d ? z(d) : "unknown function"]),
          i: function(a, b) {
            try {
              return a = z(a), ma(a, b), 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          L: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b);
              if (c & -8) return -28;
              var d = S(b, { ab: true }).node;
              if (!d) return -44;
              a = "";
              c & 4 && (a += "r");
              c & 2 && (a += "w");
              c & 1 && (a += "x");
              return a && Mb(d, a) ? -2 : 0;
            } catch (e) {
              if ("undefined" == typeof X || "ErrnoError" !== e.name) throw e;
              return -e.Pa;
            }
          },
          j: function(a, b) {
            try {
              var c = T(a);
              $b(c, c.node, b, false);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          h: function(a) {
            try {
              var b = T(a);
              Tb(b, b.node, { timestamp: Date.now(), Lb: false });
              return 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          b: function(a, b, c) {
            Ec = c;
            try {
              var d = T(a);
              switch (b) {
                case 0:
                  var e = Gc();
                  if (0 > e) break;
                  for (; Eb[e]; ) e++;
                  return Sb(d, e).fd;
                case 1:
                case 2:
                  return 0;
                case 3:
                  return d.flags;
                case 4:
                  return e = Gc(), d.flags |= e, 0;
                case 12:
                  return e = Gc(), Ia[e + 0 >> 1] = 2, 0;
                case 13:
                case 14:
                  return 0;
              }
              return -28;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          g: function(a, b) {
            try {
              var c = T(a), d = c.node, e = c.Ma.Ta;
              a = e ? c : d;
              e ??= d.La.Ta;
              Qb(e);
              var g = e(a);
              return mc(b, g);
            } catch (h) {
              if ("undefined" == typeof X || "ErrnoError" !== h.name) throw h;
              return -h.Pa;
            }
          },
          H: function(a, b) {
            b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
            try {
              if (isNaN(b)) return -61;
              var c = T(a);
              if (0 > b || 0 === (c.flags & 2097155)) throw new N(28);
              ac(c, c.node, b);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          G: function(a, b) {
            try {
              if (0 === b) return -28;
              var c = ib("/") + 1;
              if (b < c) return -68;
              M("/", C, a, b);
              return c;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          K: function(a, b) {
            try {
              return a = z(a), mc(b, Zb(a, true));
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          C: function(a, b, c) {
            try {
              return b = z(b), b = Y(a, b), U(b, c), 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          J: function(a, b, c, d) {
            try {
              b = z(b);
              var e = d & 256;
              b = Y(a, b, d & 4096);
              return mc(c, e ? Zb(b, true) : Zb(b));
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          x: function(a, b, c, d) {
            Ec = d;
            try {
              b = z(b);
              b = Y(a, b);
              var e = d ? Gc() : 0;
              return na(b, c, e).fd;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          v: function(a, b, c, d) {
            try {
              b = z(b);
              b = Y(a, b);
              if (0 >= d) return -28;
              var e = S(b).node;
              if (!e) throw new N(44);
              if (!e.La.readlink) throw new N(28);
              var g = e.La.readlink(e);
              var h = Math.min(d, ib(g)), q = m[c + h];
              M(
                g,
                C,
                c,
                d + 1
              );
              m[c + h] = q;
              return h;
            } catch (v) {
              if ("undefined" == typeof X || "ErrnoError" !== v.name) throw v;
              return -v.Pa;
            }
          },
          u: function(a) {
            try {
              return a = z(a), Yb(a), 0;
            } catch (b) {
              if ("undefined" == typeof X || "ErrnoError" !== b.name) throw b;
              return -b.Pa;
            }
          },
          f: function(a, b) {
            try {
              return a = z(a), mc(b, Zb(a));
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          r: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b);
              if (c) if (512 === c) Yb(b);
              else return -28;
              else ua(b);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          q: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b, true);
              var d = Date.now(), e, g;
              if (c) {
                var h = F[c >> 2] + 4294967296 * E[c + 4 >> 2], q = E[c + 8 >> 2];
                1073741823 == q ? e = d : 1073741822 == q ? e = null : e = 1e3 * h + q / 1e6;
                c += 16;
                h = F[c >> 2] + 4294967296 * E[c + 4 >> 2];
                q = E[c + 8 >> 2];
                1073741823 == q ? g = d : 1073741822 == q ? g = null : g = 1e3 * h + q / 1e6;
              } else g = e = d;
              if (null !== (g ?? e)) {
                a = e;
                var v = S(b, { ab: true }).node;
                Qb(v.La.Ua)(v, { atime: a, mtime: g });
              }
              return 0;
            } catch (u) {
              if ("undefined" == typeof X || "ErrnoError" !== u.name) throw u;
              return -u.Pa;
            }
          },
          m: () => Na(""),
          l: () => {
            Ya = false;
            Hc = 0;
          },
          A: function(a, b) {
            a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
            a = new Date(1e3 * a);
            E[b >> 2] = a.getSeconds();
            E[b + 4 >> 2] = a.getMinutes();
            E[b + 8 >> 2] = a.getHours();
            E[b + 12 >> 2] = a.getDate();
            E[b + 16 >> 2] = a.getMonth();
            E[b + 20 >> 2] = a.getFullYear() - 1900;
            E[b + 24 >> 2] = a.getDay();
            var c = a.getFullYear();
            E[b + 28 >> 2] = (0 !== c % 4 || 0 === c % 100 && 0 !== c % 400 ? Jc : Ic)[a.getMonth()] + a.getDate() - 1 | 0;
            E[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
            c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
            var d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
            E[b + 32 >> 2] = (c != d && a.getTimezoneOffset() == Math.min(d, c)) | 0;
          },
          y: function(a, b, c, d, e, g, h) {
            e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
            try {
              var q = T(d);
              if (0 !== (b & 2) && 0 === (c & 2) && 2 !== (q.flags & 2097155)) throw new N(2);
              if (1 === (q.flags & 2097155)) throw new N(2);
              if (!q.Ma.jb) throw new N(43);
              if (!a) throw new N(28);
              var v = q.Ma.jb(q, a, e, b, c);
              var u = v.Xb;
              E[g >> 2] = v.Eb;
              F[h >> 2] = u;
              return 0;
            } catch (x) {
              if ("undefined" == typeof X || "ErrnoError" !== x.name) throw x;
              return -x.Pa;
            }
          },
          z: function(a, b, c, d, e, g) {
            g = -9007199254740992 > g || 9007199254740992 < g ? NaN : Number(g);
            try {
              var h = T(e);
              if (c & 2) {
                c = g;
                if (32768 !== (h.node.mode & 61440)) throw new N(43);
                if (!(d & 2)) {
                  var q = C.slice(a, a + b);
                  h.Ma.kb && h.Ma.kb(h, q, c, b, d);
                }
              }
            } catch (v) {
              if ("undefined" == typeof X || "ErrnoError" !== v.name) throw v;
              return -v.Pa;
            }
          },
          n: (a, b) => {
            Kc[a] && (clearTimeout(Kc[a].id), delete Kc[a]);
            if (!b) return 0;
            var c = setTimeout(() => {
              delete Kc[a];
              Mc(() => Wc(a, performance.now()));
            }, b);
            Kc[a] = { id: c, lc: b };
            return 0;
          },
          B: (a, b, c, d) => {
            var e = (/* @__PURE__ */ new Date()).getFullYear(), g = new Date(e, 0, 1).getTimezoneOffset();
            e = new Date(e, 6, 1).getTimezoneOffset();
            F[a >> 2] = 60 * Math.max(g, e);
            E[b >> 2] = Number(g != e);
            b = (h) => {
              var q = Math.abs(h);
              return `UTC${0 <= h ? "-" : "+"}${String(Math.floor(q / 60)).padStart(2, "0")}${String(q % 60).padStart(2, "0")}`;
            };
            a = b(g);
            b = b(e);
            e < g ? (M(a, C, c, 17), M(b, C, d, 17)) : (M(a, C, d, 17), M(b, C, c, 17));
          },
          d: () => Date.now(),
          s: () => 2147483648,
          c: () => performance.now(),
          o: (a) => {
            var b = C.length;
            a >>>= 0;
            if (2147483648 < a) return false;
            for (var c = 1; 4 >= c; c *= 2) {
              var d = b * (1 + 0.2 / c);
              d = Math.min(d, a + 100663296);
              a: {
                d = (Math.min(2147483648, 65536 * Math.ceil(Math.max(
                  a,
                  d
                ) / 65536)) - Ma.buffer.byteLength + 65535) / 65536 | 0;
                try {
                  Ma.grow(d);
                  La();
                  var e = 1;
                  break a;
                } catch (g) {
                }
                e = void 0;
              }
              if (e) return true;
            }
            return false;
          },
          E: (a, b) => {
            var c = 0, d = 0, e;
            for (e of Pc()) {
              var g = b + c;
              F[a + d >> 2] = g;
              c += M(e, C, g, Infinity) + 1;
              d += 4;
            }
            return 0;
          },
          F: (a, b) => {
            var c = Pc();
            F[a >> 2] = c.length;
            a = 0;
            for (var d of c) a += ib(d) + 1;
            F[b >> 2] = a;
            return 0;
          },
          e: function(a) {
            try {
              var b = T(a);
              pa(b);
              return 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return c.Pa;
            }
          },
          p: function(a, b) {
            try {
              var c = T(a);
              m[b] = c.tty ? 2 : P(c.mode) ? 3 : 40960 === (c.mode & 61440) ? 7 : 4;
              Ia[b + 2 >> 1] = 0;
              H[b + 8 >> 3] = BigInt(0);
              H[b + 16 >> 3] = BigInt(0);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return d.Pa;
            }
          },
          w: function(a, b, c, d) {
            try {
              a: {
                var e = T(a);
                a = b;
                for (var g, h = b = 0; h < c; h++) {
                  var q = F[a >> 2], v = F[a + 4 >> 2];
                  a += 8;
                  var u = cc(e, m, q, v, g);
                  if (0 > u) {
                    var x = -1;
                    break a;
                  }
                  b += u;
                  if (u < v) break;
                  "undefined" != typeof g && (g += u);
                }
                x = b;
              }
              F[d >> 2] = x;
              return 0;
            } catch (D) {
              if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
              return D.Pa;
            }
          },
          D: function(a, b, c, d) {
            b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
            try {
              if (isNaN(b)) return 61;
              var e = T(a);
              bc(e, b, c);
              H[d >> 3] = BigInt(e.position);
              e.rb && 0 === b && 0 === c && (e.rb = null);
              return 0;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return g.Pa;
            }
          },
          I: function(a) {
            try {
              var b = T(a);
              return b.Ma?.fsync?.(b);
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return c.Pa;
            }
          },
          t: function(a, b, c, d) {
            try {
              a: {
                var e = T(a);
                a = b;
                for (var g, h = b = 0; h < c; h++) {
                  var q = F[a >> 2], v = F[a + 4 >> 2];
                  a += 8;
                  var u = oa(e, m, q, v, g);
                  if (0 > u) {
                    var x = -1;
                    break a;
                  }
                  b += u;
                  if (u < v) break;
                  "undefined" != typeof g && (g += u);
                }
                x = b;
              }
              F[d >> 2] = x;
              return 0;
            } catch (D) {
              if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
              return D.Pa;
            }
          },
          k: Lc
        };
        function Yc() {
          function a() {
            k.calledRun = true;
            if (!Ga) {
              if (!k.noFSInit && !Gb) {
                var b, c;
                Gb = true;
                b ??= k.stdin;
                c ??= k.stdout;
                d ??= k.stderr;
                b ? W("stdin", b) : Xb("/dev/tty", "/dev/stdin");
                c ? W("stdout", null, c) : Xb("/dev/tty", "/dev/stdout");
                d ? W("stderr", null, d) : Xb("/dev/tty1", "/dev/stderr");
                na("/dev/stdin", 0);
                na("/dev/stdout", 1);
                na("/dev/stderr", 1);
              }
              Zc.N();
              Hb = false;
              k.onRuntimeInitialized?.();
              if (k.postRun) for ("function" == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
                var d = k.postRun.shift();
                Ua.push(d);
              }
              Ta(Ua);
            }
          }
          if (0 < K) Xa = Yc;
          else {
            if (k.preRun) for ("function" == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) Wa();
            Ta(Va);
            0 < K ? Xa = Yc : k.setStatus ? (k.setStatus("Running..."), setTimeout(() => {
              setTimeout(() => k.setStatus(""), 1);
              a();
            }, 1)) : a();
          }
        }
        var Zc;
        (async function() {
          function a(c) {
            c = Zc = c.exports;
            k._sqlite3_free = c.P;
            k._sqlite3_value_text = c.Q;
            k._sqlite3_prepare_v2 = c.R;
            k._sqlite3_step = c.S;
            k._sqlite3_reset = c.T;
            k._sqlite3_exec = c.U;
            k._sqlite3_finalize = c.V;
            k._sqlite3_column_name = c.W;
            k._sqlite3_column_text = c.X;
            k._sqlite3_column_type = c.Y;
            k._sqlite3_errmsg = c.Z;
            k._sqlite3_clear_bindings = c._;
            k._sqlite3_value_blob = c.$;
            k._sqlite3_value_bytes = c.aa;
            k._sqlite3_value_double = c.ba;
            k._sqlite3_value_int = c.ca;
            k._sqlite3_value_type = c.da;
            k._sqlite3_result_blob = c.ea;
            k._sqlite3_result_double = c.fa;
            k._sqlite3_result_error = c.ga;
            k._sqlite3_result_int = c.ha;
            k._sqlite3_result_int64 = c.ia;
            k._sqlite3_result_null = c.ja;
            k._sqlite3_result_text = c.ka;
            k._sqlite3_aggregate_context = c.la;
            k._sqlite3_column_count = c.ma;
            k._sqlite3_data_count = c.na;
            k._sqlite3_column_blob = c.oa;
            k._sqlite3_column_bytes = c.pa;
            k._sqlite3_column_double = c.qa;
            k._sqlite3_bind_blob = c.ra;
            k._sqlite3_bind_double = c.sa;
            k._sqlite3_bind_int = c.ta;
            k._sqlite3_bind_text = c.ua;
            k._sqlite3_bind_parameter_index = c.va;
            k._sqlite3_sql = c.wa;
            k._sqlite3_normalized_sql = c.xa;
            k._sqlite3_changes = c.ya;
            k._sqlite3_close_v2 = c.za;
            k._sqlite3_create_function_v2 = c.Aa;
            k._sqlite3_update_hook = c.Ba;
            k._sqlite3_open = c.Ca;
            da = k._malloc = c.Da;
            ea = k._free = c.Ea;
            k._RegisterExtensionFunctions = c.Fa;
            Bb = c.Ga;
            Wc = c.Ha;
            sa = c.Ia;
            y = c.Ja;
            qa = c.Ka;
            Ma = c.M;
            Z = c.O;
            La();
            K--;
            k.monitorRunDependencies?.(K);
            0 == K && Xa && (c = Xa, Xa = null, c());
            return Zc;
          }
          K++;
          k.monitorRunDependencies?.(K);
          var b = { a: Xc };
          if (k.instantiateWasm) return new Promise((c) => {
            k.instantiateWasm(b, (d, e) => {
              c(a(d, e));
            });
          });
          Oa ??= k.locateFile ? k.locateFile("sql-wasm.wasm", Aa) : Aa + "sql-wasm.wasm";
          return a((await Ra(b)).instance);
        })();
        Yc();
        return Module;
      });
      return initSqlJsPromise;
    };
    if (typeof exports === "object" && typeof module === "object") {
      module.exports = initSqlJs3;
      module.exports.default = initSqlJs3;
    } else if (typeof define === "function" && define["amd"]) {
      define([], function() {
        return initSqlJs3;
      });
    } else if (typeof exports === "object") {
      exports["Module"] = initSqlJs3;
    }
  }
});

// test/run_tests.ts
var import_sql2 = __toESM(require_sql_wasm(), 1);

// server/db/database.ts
var import_sql = __toESM(require_sql_wasm(), 1);
import fs from "fs";
import path from "path";

// server/db/countryNames.ts
var COUNTRY_NAMES = {
  US: {
    firstNames: [
      "James",
      "John",
      "Robert",
      "Michael",
      "William",
      "David",
      "Richard",
      "Joseph",
      "Thomas",
      "Charles",
      "Christopher",
      "Daniel",
      "Matthew",
      "Anthony",
      "Mark",
      "Donald",
      "Steven",
      "Paul",
      "Andrew",
      "Joshua",
      "Kenneth",
      "Kevin",
      "Brian",
      "George",
      "Timothy",
      "Ronald",
      "Jason",
      "Edward",
      "Jeffrey",
      "Ryan",
      "Jacob",
      "Gary",
      "Nicholas",
      "Eric",
      "Jonathan",
      "Stephen",
      "Larry",
      "Justin",
      "Scott",
      "Brandon",
      "Benjamin",
      "Samuel",
      "Gregory",
      "Alexander",
      "Frank",
      "Patrick",
      "Raymond",
      "Jack",
      "Dennis",
      "Jerry",
      "Tyler",
      "Aaron",
      "Jose",
      "Adam",
      "Nathan",
      "Henry",
      "Douglas",
      "Zachary",
      "Peter",
      "Kyle",
      "Mary",
      "Patricia",
      "Jennifer",
      "Linda",
      "Elizabeth",
      "Barbara",
      "Susan",
      "Jessica",
      "Sarah",
      "Karen",
      "Lisa",
      "Nancy",
      "Betty",
      "Margaret",
      "Sandra",
      "Ashley",
      "Kimberly",
      "Emily",
      "Donna",
      "Michelle",
      "Carol",
      "Amanda",
      "Melissa",
      "Deborah",
      "Stephanie",
      "Rebecca",
      "Sharon",
      "Laura",
      "Cynthia",
      "Kathleen",
      "Amy",
      "Angela",
      "Shirley",
      "Anna",
      "Brenda",
      "Pamela",
      "Emma",
      "Nicole",
      "Helen",
      "Samantha",
      "Katherine",
      "Christine",
      "Debra",
      "Rachel",
      "Carolyn",
      "Janet",
      "Catherine",
      "Maria",
      "Heather",
      "Diane",
      "Ruth",
      "Julie",
      "Olivia",
      "Joyce",
      "Virginia",
      "Victoria",
      "Kelly",
      "Lauren",
      "Christina",
      "Joan",
      "Evelyn",
      "Judith",
      "Megan",
      "Andrea",
      "Cheryl",
      "Hannah",
      "Jacqueline",
      "Martha",
      "Gloria",
      "Teresa",
      "Ann",
      "Sara",
      "Madison",
      "Frances",
      "Kathryn",
      "Janice",
      "Jean",
      "Abigail",
      "Alice",
      "Julia",
      "Judy",
      "Sophia",
      "Grace",
      "Denise",
      "Amber",
      "Doris",
      "Marilyn",
      "Danielle",
      "Beverly",
      "Diana",
      "Brittany",
      "Natalie",
      "Jane",
      "Harper",
      "Avery",
      "Chloe",
      "Ella",
      "Morgan",
      "Savannah",
      "Brooklyn"
    ],
    lastNames: [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzalez",
      "Wilson",
      "Anderson",
      "Thomas",
      "Taylor",
      "Moore",
      "Jackson",
      "Martin",
      "Lee",
      "Perez",
      "Thompson",
      "White",
      "Harris",
      "Sanchez",
      "Clark",
      "Ramirez",
      "Lewis",
      "Robinson",
      "Walker",
      "Young",
      "Allen",
      "King",
      "Wright",
      "Scott",
      "Torres",
      "Nguyen",
      "Hill",
      "Flores",
      "Green",
      "Adams",
      "Nelson",
      "Baker",
      "Hall",
      "Rivera",
      "Campbell",
      "Mitchell",
      "Carter",
      "Roberts",
      "Gomez",
      "Phillips",
      "Evans",
      "Turner",
      "Diaz",
      "Parker",
      "Cruz",
      "Edwards",
      "Collins",
      "Reyes",
      "Stewart",
      "Morris",
      "Morales",
      "Murphy",
      "Cook",
      "Rogers",
      "Gutierrez",
      "Ortiz",
      "Morgan",
      "Cooper",
      "Peterson",
      "Bailey",
      "Reed",
      "Kelly",
      "Howard",
      "Ramos",
      "Kim",
      "Cox",
      "Ward",
      "Richardson",
      "Watson",
      "Brooks",
      "Chavez",
      "Wood",
      "James",
      "Bennett",
      "Gray",
      "Mendoza",
      "Ruiz",
      "Hughes",
      "Price",
      "Alvarez",
      "Castillo",
      "Sanders",
      "Patel",
      "Myers",
      "Long",
      "Ross",
      "Foster",
      "Jimenez"
    ]
  },
  GB: {
    firstNames: [
      "Oliver",
      "George",
      "Harry",
      "Jack",
      "Noah",
      "Charlie",
      "Jacob",
      "Alfie",
      "Freddie",
      "Oscar",
      "Leo",
      "Arthur",
      "Archie",
      "Thomas",
      "Henry",
      "Logan",
      "Edward",
      "Joshua",
      "James",
      "William",
      "Lucas",
      "Ethan",
      "Max",
      "Isaac",
      "Theo",
      "Samuel",
      "Harrison",
      "Finley",
      "Teddy",
      "Toby",
      "Sebastian",
      "Dylan",
      "Elijah",
      "Reuben",
      "Caleb",
      "Nathan",
      "Gabriel",
      "Elliot",
      "Luke",
      "Jude",
      "Rory",
      "Callum",
      "Hamish",
      "Fraser",
      "Angus",
      "Ewan",
      "Cameron",
      "Alastair",
      "Douglas",
      "Declan",
      "Kieran",
      "Rhys",
      "Gareth",
      "Lewis",
      "Craig",
      "Scott",
      "Malcolm",
      "Duncan",
      "Niall",
      "Blair",
      "Olivia",
      "Amelia",
      "Isla",
      "Ava",
      "Emily",
      "Isabella",
      "Mia",
      "Poppy",
      "Ella",
      "Lily",
      "Grace",
      "Evie",
      "Sophia",
      "Freya",
      "Daisy",
      "Charlotte",
      "Florence",
      "Phoebe",
      "Alice",
      "Sienna",
      "Ruby",
      "Sophie",
      "Ivy",
      "Willow",
      "Evelyn",
      "Harper",
      "Matilda",
      "Chloe",
      "Rosie",
      "Scarlett",
      "Jessica",
      "Maya",
      "Eleanor",
      "Erin",
      "Imogen",
      "Maisie",
      "Georgia",
      "Eliza",
      "Beatrice",
      "Harriet",
      "Clara",
      "Gemma",
      "Fiona",
      "Catriona",
      "Kirsty",
      "Rhona",
      "Morag",
      "Eilidh",
      "Megan",
      "Sian",
      "Carys",
      "Bethan",
      "Bronwen",
      "Lowri",
      "Ffion",
      "Seren",
      "Catrin",
      "Nia",
      "Rhiannon",
      "Anwen",
      "Alys",
      "Elin",
      "Gwen",
      "Cerys",
      "Aileen",
      "Iona",
      "Mhairi",
      "Shona",
      "Skye",
      "Lorna"
    ],
    lastNames: [
      "Smith",
      "Jones",
      "Taylor",
      "Brown",
      "Williams",
      "Wilson",
      "Johnson",
      "Davies",
      "Robinson",
      "Wright",
      "Thompson",
      "Evans",
      "Walker",
      "White",
      "Roberts",
      "Green",
      "Hall",
      "Thomas",
      "Clarke",
      "Wood",
      "Jackson",
      "Clark",
      "Turner",
      "Hill",
      "Scott",
      "Cooper",
      "Morris",
      "Ward",
      "Watson",
      "Moore",
      "King",
      "Baker",
      "Harrison",
      "Morgan",
      "Edwards",
      "Young",
      "Allen",
      "Mitchell",
      "Phillips",
      "James",
      "Campbell",
      "Anderson",
      "Stewart",
      "Hughes",
      "Bell",
      "Bailey",
      "Parker",
      "Miller",
      "Davis",
      "Murphy",
      "Price",
      "Bennett",
      "Barnes",
      "Ross",
      "Henderson",
      "Murray",
      "Hamilton",
      "Graham",
      "Fraser",
      "MacDonald",
      "Morrison",
      "Crawford",
      "Griffiths",
      "Bevan",
      "Lloyd",
      "Jenkins",
      "Vaughan",
      "Powell",
      "Owen",
      "Hopkins",
      "Bowen",
      "Pugh",
      "Rees",
      "Llewellyn",
      "MacLeod",
      "MacLean",
      "Robertson",
      "Thomson",
      "Ferguson",
      "McIntosh",
      "Sinclair",
      "Sutherland",
      "Munro",
      "Cameron",
      "Forbes",
      "Johnston",
      "Mackay",
      "Wallace",
      "Gibson",
      "Christie"
    ]
  },
  DE: {
    firstNames: [
      "Maximilian",
      "Alexander",
      "Lukas",
      "Leon",
      "Paul",
      "Jonas",
      "Felix",
      "Elias",
      "David",
      "Tim",
      "Niklas",
      "Finn",
      "Luca",
      "Julian",
      "Philipp",
      "Luis",
      "Noah",
      "Ben",
      "Erik",
      "Jan",
      "Moritz",
      "Simon",
      "Florian",
      "Tom",
      "Fabian",
      "Sebastian",
      "Daniel",
      "Tobias",
      "Johannes",
      "Christian",
      "Marcel",
      "Kevin",
      "Patrick",
      "Stefan",
      "Marco",
      "Sven",
      "Dennis",
      "Michael",
      "Andreas",
      "Martin",
      "Markus",
      "Thomas",
      "Steffen",
      "Jens",
      "Oliver",
      "Matthias",
      "Frank",
      "J\xFCrgen",
      "Uwe",
      "Carsten",
      "Dirk",
      "Thorsten",
      "Holger",
      "Ralf",
      "Bernd",
      "Wolfgang",
      "Klaus",
      "Dieter",
      "Manfred",
      "Hans",
      "Sophie",
      "Marie",
      "Maria",
      "Emma",
      "Mia",
      "Hannah",
      "Anna",
      "Emilia",
      "Lea",
      "Lina",
      "Lena",
      "Mila",
      "Clara",
      "Luisa",
      "Laura",
      "Nele",
      "Lara",
      "Sarah",
      "Johanna",
      "Leni",
      "Julia",
      "Lisa",
      "Katharina",
      "Nadine",
      "Melanie",
      "Stefanie",
      "Christina",
      "Tanja",
      "Nicole",
      "Sabrina",
      "Vanessa",
      "Sandra",
      "Daniela",
      "Jessica",
      "Jennifer",
      "Katrin",
      "Anja",
      "Andrea",
      "Claudia",
      "Petra",
      "Susanne",
      "Sabine",
      "Birgit",
      "Monika",
      "Karin",
      "Renate",
      "Helga",
      "Ursula",
      "Gisela",
      "Ingrid",
      "Erika",
      "Christa",
      "Elke",
      "Marion",
      "Angelika",
      "Gabriele",
      "Brigitte",
      "Heike",
      "Ute",
      "Martina"
    ],
    lastNames: [
      "M\xFCller",
      "Schmidt",
      "Schneider",
      "Fischer",
      "Weber",
      "Meyer",
      "Wagner",
      "Becker",
      "Schulz",
      "Hoffmann",
      "Sch\xE4fer",
      "Koch",
      "Bauer",
      "Richter",
      "Klein",
      "Wolf",
      "Schr\xF6der",
      "Neumann",
      "Schwarz",
      "Zimmermann",
      "Braun",
      "Kr\xFCger",
      "Hofmann",
      "Hartmann",
      "Lange",
      "Schmitt",
      "Werner",
      "Schmitz",
      "Krause",
      "Meier",
      "Lehmann",
      "Schmid",
      "Schulze",
      "Maier",
      "K\xF6hler",
      "Herrmann",
      "K\xF6nig",
      "Walter",
      "Mayer",
      "Huber",
      "Kaiser",
      "Fuchs",
      "Peters",
      "Lang",
      "Scholz",
      "M\xF6ller",
      "Wei\xDF",
      "Jung",
      "Hahn",
      "Schubert",
      "Vogel",
      "Friedrich",
      "Keller",
      "G\xFCnther",
      "Frank",
      "Berger",
      "Winkler",
      "Roth",
      "Beck",
      "Lorenz",
      "Baumann",
      "Franke",
      "Albrecht",
      "Schuster",
      "Simon",
      "Ludwig",
      "B\xF6hm",
      "Winter",
      "Krau\xDF",
      "Schumacher",
      "Kr\xE4mer",
      "Vogt",
      "Stein",
      "J\xE4ger",
      "Otto",
      "Sommer",
      "Gro\xDF",
      "Seidel",
      "Heinrich",
      "Brandt",
      "Haas",
      "Schreiber",
      "Graf",
      "Schulte",
      "Dietrich",
      "Ziegler",
      "Kuhn",
      "K\xFChn",
      "Pohl",
      "Engel"
    ]
  },
  IN: {
    firstNames: [
      "Aarav",
      "Vihaan",
      "Vivaan",
      "Advik",
      "Kabir",
      "Reyansh",
      "Atharv",
      "Aayush",
      "Ishaan",
      "Dhruv",
      "Samarth",
      "Shaurya",
      "Aryan",
      "Rudra",
      "Ayaan",
      "Krishna",
      "Sai",
      "Arjun",
      "Rajesh",
      "Suresh",
      "Ramesh",
      "Mahesh",
      "Ganesh",
      "Dinesh",
      "Naresh",
      "Mukesh",
      "Sanjay",
      "Ajay",
      "Vijay",
      "Manoj",
      "Vinod",
      "Ashok",
      "Sunil",
      "Anil",
      "Alok",
      "Amit",
      "Sumit",
      "Rahul",
      "Rohit",
      "Sachin",
      "Gaurav",
      "Saurabh",
      "Vikas",
      "Vishal",
      "Manish",
      "Nitish",
      "Deepak",
      "Sandeep",
      "Pradeep",
      "Kuldeep",
      "Naveen",
      "Praveen",
      "Pankaj",
      "Chetan",
      "Harish",
      "Girish",
      "Satish",
      "Jagdish",
      "Lokesh",
      "Bhavesh",
      "Rakesh",
      "Umesh",
      "Yogesh",
      "Hemant",
      "Prashant",
      "Nishant",
      "Rohan",
      "Vikram",
      "Siddharth",
      "Aditya",
      "Ananya",
      "Diya",
      "Saanvi",
      "Aadhya",
      "Pari",
      "Kiara",
      "Myra",
      "Riya",
      "Riddhi",
      "Sneha",
      "Neha",
      "Pooja",
      "Priya",
      "Shruti",
      "Swati",
      "Divya",
      "Shreya",
      "Deepa",
      "Meera",
      "Sunita",
      "Rekha",
      "Anita",
      "Geeta",
      "Kavya",
      "Avani",
      "Siya",
      "Prisha",
      "Anika",
      "Ira",
      "Tanvi",
      "Ishita",
      "Trisha",
      "Tara",
      "Sanya",
      "Rhea",
      "Nitya",
      "Aditi",
      "Vidya",
      "Malini",
      "Bhavna",
      "Rashmi",
      "Jyoti",
      "Vandana",
      "Preeti",
      "Payal",
      "Komal",
      "Shilpa",
      "Poonam",
      "Archana",
      "Manisha",
      "Seema",
      "Sangeeta",
      "Radha",
      "Lakshmi",
      "Parvati",
      "Shanti",
      "Uma",
      "Durga",
      "Kalyani",
      "Meenakshi"
    ],
    lastNames: [
      "Sharma",
      "Verma",
      "Gupta",
      "Patel",
      "Singh",
      "Kumar",
      "Mishra",
      "Joshi",
      "Yadav",
      "Shah",
      "Rao",
      "Reddy",
      "Nair",
      "Pillai",
      "Iyer",
      "Iyengar",
      "Bhattacharya",
      "Chatterjee",
      "Banerjee",
      "Mukherjee",
      "Sen",
      "Ghosh",
      "Das",
      "Dutta",
      "Bose",
      "Roy",
      "Sengupta",
      "Choudhury",
      "Majumdar",
      "Chakraborty",
      "Nambiar",
      "Menon",
      "Kurup",
      "Shetty",
      "Hegde",
      "Rai",
      "Shenoy",
      "Kamath",
      "Pai",
      "Bhat",
      "Kulkarni",
      "Deshmukh",
      "Patil",
      "Shinde",
      "Pawar",
      "Gaikwad",
      "Chavan",
      "Kadam",
      "Jadhav",
      "Bhosale",
      "Mehta",
      "Trivedi",
      "Pandya",
      "Dave",
      "Shukla",
      "Tiwari",
      "Dubey",
      "Pandey",
      "Upadhyay",
      "Tripathi",
      "Agarwal",
      "Mittal",
      "Bansal",
      "Goyal",
      "Singhal",
      "Garg",
      "Jindal",
      "Goel",
      "Jain",
      "Saxena",
      "Mathur",
      "Srivastava",
      "Bhatnagar",
      "Nigam",
      "Prasad",
      "Sinha",
      "Kapoor",
      "Khanna",
      "Chopra",
      "Malhotra",
      "Sethi",
      "Anand",
      "Ahuja",
      "Grover",
      "Batra",
      "Chawla",
      "Taneja",
      "Bhasin",
      "Bajaj",
      "Dewan"
    ]
  },
  SG: {
    firstNames: [
      // Chinese Singaporean
      "Wei Ming",
      "Zhi Hao",
      "Jun Jie",
      "Kai Le",
      "Wei Lun",
      "Zi Rui",
      "Jian Hao",
      "Zhi Wei",
      "Ming Hui",
      "Xiao Wei",
      "Yan Ting",
      "Hui Min",
      "Jia En",
      "Xin Yi",
      "Shu Ting",
      "Yu Xuan",
      "Zhi Ying",
      "Pei Shan",
      "Darren",
      "Ryan",
      "Megan",
      "Brandon",
      "Chloe",
      "Justin",
      "Nicole",
      "Dylan",
      "Rachel",
      "Marcus",
      "Stephanie",
      "Jason",
      "Vanessa",
      "Bryan",
      "Fiona",
      "Aaron",
      "Melissa",
      "Kevin",
      "Amanda",
      "Gabriel",
      "Grace",
      "Lucas",
      "Cheryl",
      "Keith",
      "Jeremy",
      "Shawn",
      "Derek",
      "Sean",
      "Kenneth",
      "Daryl",
      "Eugene",
      "Colin",
      // Malay Singaporean
      "Muhammad Farhan",
      "Danial",
      "Haziq",
      "Amirul",
      "Khairul",
      "Nabil",
      "Aiman",
      "Irfan",
      "Rahmat",
      "Iskandar",
      "Siti Nurul",
      "Fatin",
      "Nadia",
      "Farah",
      "Natasha",
      "Sabrina",
      "Zulaikha",
      "Nuraisha",
      "Atiqah",
      "Nur Aisyah",
      // Indian Singaporean
      "Suresh",
      "Rajesh",
      "Deepa",
      "Priya",
      "Anand",
      "Harish",
      "Sanjay",
      "Vikram",
      "Kavita",
      "Shanti",
      "Meena",
      "Prakash",
      "Ravi",
      "Senthil",
      "Vignesh",
      "Prema",
      "Karthik",
      "Mohan",
      "Vasanth",
      "Geetha",
      // Eurasian Singaporean
      "Dominic",
      "Sarah",
      "Samantha",
      "Claire",
      "Julian",
      "Christopher",
      "Alyssa",
      "Gemma",
      "Tristan",
      "Nicole"
    ],
    lastNames: [
      // Singapore Chinese Surnames
      "Tan",
      "Lim",
      "Lee",
      "Ng",
      "Ong",
      "Wong",
      "Goh",
      "Chua",
      "Chan",
      "Koh",
      "Teo",
      "Ang",
      "Yeo",
      "Tay",
      "Ho",
      "Low",
      "Toh",
      "Sim",
      "Chia",
      "Seow",
      "Quek",
      "Lau",
      "Loo",
      "Cheong",
      "Foo",
      "Fong",
      "Kwek",
      "Neo",
      "Pang",
      "Soon",
      "Tang",
      "Wee",
      "Yap",
      "Yong",
      "Chung",
      "Leong",
      "Liang",
      "Heng",
      "Khoo",
      "Kwok",
      // Singapore Malay Patronomics / Surnames
      "bin Ismail",
      "bin Rosli",
      "bin Osman",
      "bin Yusof",
      "bin Ibrahim",
      "bin Hassan",
      "bin Abdullah",
      "binte Ahmad",
      "binte Ali",
      "binte Razak",
      "binte Rahim",
      "binte Hashim",
      "binte Rahman",
      "binte Othman",
      // Singapore Indian Surnames
      "Pillai",
      "Raman",
      "Krishnan",
      "Nair",
      "Raj",
      "Menon",
      "Govindasamy",
      "Shanmugam",
      "Subramaniam",
      "Balakrishnan",
      "Murugan",
      "Jayaraman",
      "Chandran",
      "Sundaram",
      "Muthusamy",
      "Arumugam",
      // Singapore Eurasian Surnames
      "De Souza",
      "Pereira",
      "Hendricks",
      "Conceicao",
      "D'Aranjo",
      "Rozario",
      "Danker",
      "Minjoot",
      "Van Huizen"
    ]
  }
};
function sanitizeForEmail(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/['’]/g, "").replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
}
function generateCountryAlignedName(countryCode, id) {
  const data = COUNTRY_NAMES[countryCode] || COUNTRY_NAMES.US;
  const fnIdx = (id * 17 + Math.floor(Math.random() * 5)) % data.firstNames.length;
  const lnIdx = (id * 31 + Math.floor(Math.random() * 7)) % data.lastNames.length;
  const firstName = data.firstNames[fnIdx];
  const lastName = data.lastNames[lnIdx];
  const cleanFirst = sanitizeForEmail(firstName);
  const cleanLast = sanitizeForEmail(lastName);
  const email = `${cleanFirst}.${cleanLast}.${id}@acme.org`;
  return { firstName, lastName, email };
}

// server/db/database.ts
var DB_DIR = path.resolve(process.cwd(), "data");
var DB_PATH = path.join(DB_DIR, "salary_app.db");
var dbInstance = null;
function saveDatabase(db = dbInstance) {
  if (!db) return;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error("Error saving database to disk:", err);
  }
}
function initializeSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS pay_bands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      min_salary REAL NOT NULL,
      max_salary REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS fx_rates (
      currency_code TEXT PRIMARY KEY,
      rate_to_usd REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_code TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      department_id INTEGER NOT NULL REFERENCES departments(id),
      role_title TEXT NOT NULL,
      country_code TEXT NOT NULL,
      currency_code TEXT NOT NULL,
      pay_band_id INTEGER NOT NULL REFERENCES pay_bands(id),
      current_salary REAL DEFAULT 0,
      employment_status TEXT NOT NULL DEFAULT 'active',
      hire_date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS salary_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL REFERENCES employees(id),
      base_salary REAL NOT NULL,
      currency_code TEXT NOT NULL,
      effective_date TEXT NOT NULL,
      is_current INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      status TEXT,
      type TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_emp_dept ON employees(department_id);
    CREATE INDEX IF NOT EXISTS idx_emp_band ON employees(pay_band_id);
    CREATE INDEX IF NOT EXISTS idx_emp_country ON employees(country_code);
    CREATE INDEX IF NOT EXISTS idx_emp_status ON employees(employment_status);
    CREATE INDEX IF NOT EXISTS idx_emp_code ON employees(employee_code);
    CREATE INDEX IF NOT EXISTS idx_sal_emp ON salary_records(employee_id);
    CREATE INDEX IF NOT EXISTS idx_sal_curr ON salary_records(is_current);
  `);
  try {
    db.run("ALTER TABLE employees ADD COLUMN current_salary REAL DEFAULT 0;");
  } catch {
  }
  const deptCount = db.exec("SELECT COUNT(*) as c FROM departments")[0]?.values[0][0];
  if (!deptCount || deptCount === 0) {
    const depts = ["Engineering", "Sales", "Finance", "Operations", "Human Resources", "Marketing"];
    for (const d of depts) {
      db.run("INSERT INTO departments (name) VALUES (?)", [d]);
    }
  }
  const bandCount = db.exec("SELECT COUNT(*) as c FROM pay_bands")[0]?.values[0][0];
  if (!bandCount || bandCount === 0) {
    const bands = [
      { name: "L1 - Associate", min: 4e4, max: 65e3 },
      { name: "L2 - Junior", min: 6e4, max: 95e3 },
      { name: "L3 - Mid-Level", min: 85e3, max: 135e3 },
      { name: "L4 - Senior", min: 125e3, max: 19e4 },
      { name: "L5 - Lead / Principal", min: 18e4, max: 27e4 }
    ];
    for (const b of bands) {
      db.run("INSERT INTO pay_bands (name, min_salary, max_salary) VALUES (?, ?, ?)", [b.name, b.min, b.max]);
    }
  }
  const fxCount = db.exec("SELECT COUNT(*) as c FROM fx_rates")[0]?.values[0][0];
  if (!fxCount || fxCount === 0) {
    const fx = [
      { code: "USD", rate: 1 },
      { code: "EUR", rate: 1.08 },
      { code: "GBP", rate: 1.28 },
      { code: "INR", rate: 0.012 },
      { code: "SGD", rate: 0.74 }
    ];
    for (const f of fx) {
      db.run("INSERT INTO fx_rates (currency_code, rate_to_usd) VALUES (?, ?)", [f.code, f.rate]);
    }
  }
  const actCount = db.exec("SELECT COUNT(*) as c FROM activity_logs")[0]?.values[0][0];
  if (!actCount || actCount === 0) {
    const now = /* @__PURE__ */ new Date();
    db.run(
      `INSERT INTO activity_logs (id, title, subtitle, status, type, created_at) VALUES 
      ('act-1', 'Bonus approval requested', 'by Olivia Brown', 'Pending', 'bonus', ?),
      ('act-2', 'Payroll approved', 'May 15, 2024 Payroll', 'Approved', 'payroll', ?),
      ('act-3', 'Tax report generated', 'Q2 2024 Tax Report', NULL, 'tax', ?),
      ('act-4', 'New employee added', 'James Wilson - Sales Executive', NULL, 'employee', ?),
      ('act-5', 'Payroll processing started', 'May 31, 2024 Payroll', 'Processing', 'payroll', ?)`,
      [
        new Date(now.getTime() - 10 * 6e4).toISOString(),
        new Date(now.getTime() - 60 * 6e4).toISOString(),
        new Date(now.getTime() - 180 * 6e4).toISOString(),
        new Date(now.getTime() - 300 * 6e4).toISOString(),
        new Date(now.getTime() - 1440 * 6e4).toISOString()
      ]
    );
  }
  const empCount = db.exec("SELECT COUNT(*) as c FROM employees")[0]?.values[0][0];
  const nonUsInCount = db.exec("SELECT COUNT(*) FROM employees WHERE country_code NOT IN ('US', 'IN')")[0]?.values[0][0];
  if (!empCount || empCount < 1e4 || nonUsInCount > 0) {
    console.log(`Reseeding database with 2-country demo specification: 31% US & 69% India...`);
    seedEmployees(db, 1e4, true);
  }
}
function seedEmployees(db, count = 1e4, clearExisting = false) {
  if (clearExisting) {
    db.run("DELETE FROM salary_records;");
    db.run("DELETE FROM employees;");
  }
  const countryConfigs = [
    { country: "US", currency: "USD", rate: 1, weight: 0.69 },
    { country: "IN", currency: "INR", rate: 0.012, weight: 0.31 }
  ];
  const rolesByDept = {
    "Engineering": ["Software Engineer", "Frontend Engineer", "Backend Engineer", "DevOps Engineer", "QA Automation Engineer", "Engineering Manager"],
    "Sales": ["Sales Executive", "Account Executive", "Business Development Rep", "Sales Director", "Customer Success Manager"],
    "Finance": ["Financial Analyst", "Senior Accountant", "Payroll Specialist", "Controller", "Finance Manager"],
    "Operations": ["Operations Analyst", "Supply Chain Coordinator", "Project Manager", "Operations Director"],
    "Human Resources": ["HR Specialist", "Technical Recruiter", "HR Business Partner", "Compensation & Benefits Lead"],
    "Marketing": ["Marketing Manager", "Product Marketing Specialist", "Content Strategist", "Growth Marketer", "Creative Director"]
  };
  const departmentsRes = db.exec("SELECT id, name FROM departments");
  const deptList = departmentsRes[0].values.map((v) => ({ id: v[0], name: v[1] }));
  const bandsRes = db.exec("SELECT id, name, min_salary, max_salary FROM pay_bands");
  const bandList = bandsRes[0].values.map((v) => ({
    id: v[0],
    name: v[1],
    min: v[2],
    max: v[3]
  }));
  const maxCodeRes = db.exec("SELECT MAX(id) FROM employees")[0]?.values[0][0];
  let startId = typeof maxCodeRes === "number" ? maxCodeRes + 1 : 1;
  db.run("BEGIN TRANSACTION;");
  const empStmt = db.prepare(`
    INSERT INTO employees (
      employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, current_salary,
      employment_status, hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const salStmt = db.prepare(`
    INSERT INTO salary_records (
      employee_id, base_salary, currency_code, effective_date, is_current
    ) VALUES (?, ?, ?, ?, ?)
  `);
  const showcaseEmployees = [
    {
      code: "EMP-00001",
      first: "Emma",
      last: "Johnson",
      email: "emma.johnson@demo.com",
      deptName: "Marketing",
      role: "Marketing Manager",
      country: "US",
      currency: "USD",
      rate: 1,
      bandIdx: 3,
      salary: 108e3,
      status: "active",
      hireDate: "2021-03-15"
    },
    {
      code: "EMP-00002",
      first: "Aarav",
      last: "Sharma",
      email: "employee@demo.com",
      // Demo employee login persona
      deptName: "Engineering",
      role: "Software Engineer",
      country: "IN",
      currency: "INR",
      rate: 0.012,
      bandIdx: 2,
      salary: 28e5,
      // ~33,600 USD (or competitive INR tech salary)
      status: "active",
      hireDate: "2022-06-10"
    },
    {
      code: "EMP-00003",
      first: "Michael",
      last: "Miller",
      email: "michael.miller@demo.com",
      deptName: "Engineering",
      role: "Engineering Manager",
      country: "US",
      currency: "USD",
      rate: 1,
      bandIdx: 4,
      salary: 165e3,
      status: "active",
      hireDate: "2020-09-01"
    },
    {
      code: "EMP-00004",
      first: "Priya",
      last: "Patel",
      email: "priya.patel@demo.com",
      deptName: "Finance",
      role: "Financial Analyst",
      country: "IN",
      currency: "INR",
      rate: 0.012,
      bandIdx: 1,
      salary: 185e4,
      status: "active",
      hireDate: "2023-01-20"
    },
    {
      code: "EMP-00005",
      first: "Sarah",
      last: "Davis",
      email: "sarah.davis@demo.com",
      deptName: "Human Resources",
      role: "Compensation & Benefits Lead",
      country: "US",
      currency: "USD",
      rate: 1,
      bandIdx: 3,
      salary: 115e3,
      status: "active",
      hireDate: "2022-04-12"
    },
    {
      code: "EMP-00006",
      first: "Rohan",
      last: "Verma",
      email: "rohan.verma@demo.com",
      deptName: "Engineering",
      role: "Backend Engineer",
      country: "IN",
      currency: "INR",
      rate: 0.012,
      bandIdx: 2,
      salary: 24e5,
      status: "active",
      hireDate: "2023-02-15"
    },
    {
      code: "EMP-00007",
      first: "David",
      last: "Wilson",
      email: "david.wilson@demo.com",
      deptName: "Operations",
      role: "DevOps Engineer",
      country: "US",
      currency: "USD",
      rate: 1,
      bandIdx: 3,
      salary: 128e3,
      status: "active",
      hireDate: "2021-11-01"
    },
    {
      code: "EMP-00008",
      first: "Ananya",
      last: "Sen",
      email: "ananya.sen@demo.com",
      deptName: "Engineering",
      role: "Frontend Engineer",
      country: "IN",
      currency: "INR",
      rate: 0.012,
      bandIdx: 2,
      salary: 21e5,
      status: "active",
      hireDate: "2022-08-15"
    },
    {
      code: "EMP-00009",
      first: "Jessica",
      last: "Taylor",
      email: "jessica.taylor@demo.com",
      deptName: "Finance",
      role: "Controller",
      country: "US",
      currency: "USD",
      rate: 1,
      bandIdx: 4,
      salary: 142e3,
      status: "active",
      hireDate: "2019-05-10"
    },
    {
      code: "EMP-00010",
      first: "Vikram",
      last: "Malhotra",
      email: "vikram.malhotra@demo.com",
      deptName: "Operations",
      role: "Operations Director",
      country: "IN",
      currency: "INR",
      rate: 0.012,
      bandIdx: 4,
      salary: 34e5,
      status: "active",
      hireDate: "2020-07-01"
    }
  ];
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let countToGenerate = count;
  if (startId === 1) {
    for (const sc of showcaseEmployees) {
      const dept = deptList.find((d) => d.name === sc.deptName) || deptList[0];
      const band = bandList[sc.bandIdx] || bandList[1];
      empStmt.run([
        sc.code,
        sc.first,
        sc.last,
        sc.email,
        dept.id,
        sc.role,
        sc.country,
        sc.currency,
        band.id,
        sc.salary,
        sc.status,
        sc.hireDate,
        now,
        now
      ]);
      const empIdRes = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
      salStmt.run([empIdRes, Math.round(sc.salary * 0.9), sc.currency, sc.hireDate, 0]);
      salStmt.run([empIdRes, sc.salary, sc.currency, "2024-01-01", 1]);
    }
    countToGenerate -= showcaseEmployees.length;
    startId += showcaseEmployees.length;
  }
  for (let i = 0; i < countToGenerate; i++) {
    const currentId = startId + i;
    const empCode = `EMP-${currentId.toString().padStart(5, "0")}`;
    const distRoll = Math.random();
    const cConf = distRoll < 0.31 ? countryConfigs[0] : countryConfigs[1];
    const { firstName, lastName, email } = generateCountryAlignedName(cConf.country, currentId);
    const dept = deptList[i % deptList.length];
    const roles = rolesByDept[dept.name] || ["Specialist", "Manager", "Coordinator"];
    const roleTitle = roles[Math.floor(Math.random() * roles.length)];
    const rand = Math.random();
    let bandIdx = 0;
    if (rand < 0.25) bandIdx = 0;
    else if (rand < 0.55) bandIdx = 1;
    else if (rand < 0.8) bandIdx = 2;
    else if (rand < 0.95) bandIdx = 3;
    else bandIdx = 4;
    const band = bandList[bandIdx] || bandList[1];
    const status = "active";
    const hireYear = 2018 + Math.floor(Math.random() * 6);
    const hireMonth = (1 + Math.floor(Math.random() * 12)).toString().padStart(2, "0");
    const hireDay = (1 + Math.floor(Math.random() * 28)).toString().padStart(2, "0");
    const hireDate = `${hireYear}-${hireMonth}-${hireDay}`;
    const bandSpread = band.max - band.min;
    const baseUsd = band.min + (Math.random() * 0.9 + 0.05) * bandSpread;
    const localSalary = Math.round(baseUsd / cConf.rate);
    empStmt.run([
      empCode,
      firstName,
      lastName,
      email,
      dept.id,
      roleTitle,
      cConf.country,
      cConf.currency,
      band.id,
      localSalary,
      status,
      hireDate,
      now,
      now
    ]);
    const empIdRes = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
    const hasHistory = Math.random() < 0.4 && hireYear <= 2022;
    if (hasHistory) {
      const pastSalary = Math.round(localSalary * (0.85 + Math.random() * 0.08));
      salStmt.run([empIdRes, pastSalary, cConf.currency, hireDate, 0]);
      salStmt.run([empIdRes, localSalary, cConf.currency, `${hireYear + 1}-04-01`, 1]);
    } else {
      salStmt.run([empIdRes, localSalary, cConf.currency, hireDate, 1]);
    }
  }
  empStmt.free();
  salStmt.free();
  db.run("COMMIT;");
  saveDatabase(db);
}

// test/run_tests.ts
async function runTests() {
  console.log("--- Starting ACME Employee Salary Management Test Suite ---");
  let passed = 0;
  let failed = 0;
  function assert(condition, testName) {
    if (condition) {
      console.log(`PASS: ${testName}`);
      passed++;
    } else {
      console.error(`FAIL: ${testName}`);
      failed++;
    }
  }
  const SQL = await (0, import_sql2.default)();
  const db = new SQL.Database();
  initializeSchema(db);
  console.log("\n[1] Testing Schema and Baseline Reference Data...");
  const depts = db.exec("SELECT COUNT(*) FROM departments")[0].values[0][0];
  assert(depts >= 6, "Departments table seeded with >= 6 departments");
  const payBands = db.exec("SELECT COUNT(*) FROM pay_bands")[0].values[0][0];
  assert(payBands >= 5, "Pay bands table seeded with >= 5 bands");
  const fxRates = db.exec("SELECT COUNT(*) FROM fx_rates")[0].values[0][0];
  assert(fxRates >= 5, "Deterministic FX rate table initialized with 5 currencies");
  console.log("\n[2] Testing Employee Creation and Validation...");
  const now = (/* @__PURE__ */ new Date()).toISOString();
  db.run(`
    INSERT INTO employees (
      employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, employment_status,
      hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    "EMP-TEST1",
    "Sarah",
    "Connor",
    "sarah.connor@acme.test",
    1,
    "Lead Architect",
    "US",
    "USD",
    5,
    "active",
    "2023-01-15",
    now,
    now
  ]);
  const newEmpId = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
  assert(newEmpId > 0, "New employee created with unique code EMP-TEST1");
  db.run(`
    INSERT INTO salary_records (
      employee_id, base_salary, currency_code, effective_date, is_current
    ) VALUES (?, ?, ?, ?, 1)
  `, [newEmpId, 21e4, "USD", "2023-01-15"]);
  const salId = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
  assert(salId > 0, "Initial salary record created with is_current = 1");
  let emailDupeFailed = false;
  try {
    db.run(`
      INSERT INTO employees (
        employee_code, first_name, last_name, email, department_id,
        role_title, country_code, currency_code, pay_band_id, employment_status,
        hire_date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      "EMP-TEST2",
      "Duplicate",
      "User",
      "sarah.connor@acme.test",
      1,
      "Architect",
      "US",
      "USD",
      5,
      "active",
      "2023-01-15",
      now,
      now
    ]);
  } catch {
    emailDupeFailed = true;
  }
  assert(emailDupeFailed, "Duplicate email correctly rejected by database constraint");
  console.log("\n[3] Testing Salary History and Updates...");
  db.run("UPDATE salary_records SET is_current = 0 WHERE employee_id = ?", [newEmpId]);
  db.run(`
    INSERT INTO salary_records (
      employee_id, base_salary, currency_code, effective_date, is_current
    ) VALUES (?, ?, ?, ?, 1)
  `, [newEmpId, 235e3, "USD", "2024-03-01"]);
  const histRecords = db.exec("SELECT base_salary, is_current FROM salary_records WHERE employee_id = ? ORDER BY effective_date ASC", [newEmpId])[0].values;
  assert(histRecords.length === 2, "Employee retains 2 historical salary records");
  assert(histRecords[0][0] === 21e4 && histRecords[0][1] === 0, "First salary marked inactive (is_current = 0)");
  assert(histRecords[1][0] === 235e3 && histRecords[1][1] === 1, "Latest salary marked current (is_current = 1)");
  console.log("\n[4] Testing Soft Delete (Audit Trail Retention)...");
  db.run("UPDATE employees SET employment_status = 'inactive', updated_at = ? WHERE id = ?", [(/* @__PURE__ */ new Date()).toISOString(), newEmpId]);
  const statusRes = db.exec("SELECT employment_status FROM employees WHERE id = ?", [newEmpId])[0].values[0][0];
  assert(statusRes === "inactive", "Employee status updated to inactive on soft delete");
  const countStillInDb = db.exec("SELECT COUNT(*) FROM employees WHERE id = ?", [newEmpId])[0].values[0][0];
  assert(countStillInDb === 1, "Employee record preserved in database for audit compliance");
  console.log("\n[5] Testing Currency Conversion & Aggregation Functions...");
  db.run(`
    INSERT INTO employees (
      employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, employment_status,
      hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    "EMP-EUR1",
    "Hans",
    "Mueller",
    "hans.mueller@acme.test",
    1,
    "DevOps Engineer",
    "DE",
    "EUR",
    4,
    "active",
    "2023-05-01",
    now,
    now
  ]);
  const deEmpId = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
  db.run(`
    INSERT INTO salary_records (employee_id, base_salary, currency_code, effective_date, is_current)
    VALUES (?, ?, ?, ?, 1)
  `, [deEmpId, 1e5, "EUR", "2023-05-01"]);
  const convertedUsd = db.exec(`
    SELECT sr.base_salary * fx.rate_to_usd
    FROM salary_records sr
    JOIN employees e ON sr.employee_id = e.id
    JOIN fx_rates fx ON e.currency_code = fx.currency_code
    WHERE e.id = ? AND sr.is_current = 1
  `, [deEmpId])[0].values[0][0];
  assert(Math.round(convertedUsd) === 108e3, "Deterministic FX rate (1.08) accurately converts 100,000 EUR to $108,000 USD");
  console.log("\n[6] Testing Edge Cases...");
  db.run(`
    INSERT INTO employees (
      employee_code, first_name, last_name, email, department_id,
      role_title, country_code, currency_code, pay_band_id, current_salary, employment_status,
      hire_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    "EMP-NOSAL",
    "No",
    "Salary",
    "no.salary@acme.test",
    2,
    "Intern",
    "US",
    "USD",
    1,
    0,
    "active",
    "2024-01-01",
    now,
    now
  ]);
  const noSalId = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
  const noSalQuery = db.exec(`
    SELECT e.id, sr.base_salary, e.current_salary
    FROM employees e
    LEFT JOIN salary_records sr ON e.id = sr.employee_id AND sr.is_current = 1
    WHERE e.id = ?
  `, [noSalId])[0].values[0];
  assert(noSalQuery[1] === null, "Employee with no salary history safely handled with null current salary in records");
  const emptyFilter = db.exec("SELECT COUNT(*) FROM employees WHERE department_id = 9999")[0].values[0][0];
  assert(emptyFilter === 0, "Non-existent department filter returns 0 records without crashing");
  const pagedRes = db.exec("SELECT * FROM employees LIMIT 5 OFFSET 0")[0].values;
  assert(pagedRes.length <= 5, "Pagination limit strictly respected");
  console.log("\n[7] Testing Direct Current Salary Column & Database Pagination...");
  const colInfo = db.exec("PRAGMA table_info(employees)")[0].values;
  const hasCurrentSalaryCol = colInfo.some((col) => col[1] === "current_salary");
  assert(hasCurrentSalaryCol, "employees table has dedicated current_salary column");
  db.run("UPDATE employees SET current_salary = 245000, updated_at = ? WHERE id = ?", [(/* @__PURE__ */ new Date()).toISOString(), newEmpId]);
  const updatedEmpSalary = db.exec("SELECT current_salary FROM employees WHERE id = ?", [newEmpId])[0].values[0][0];
  assert(updatedEmpSalary === 245e3, "current_salary column updated to 245,000");
  const coalesceQuery = db.exec(`
    SELECT COALESCE(e.current_salary, sr.base_salary, 0) as effective_salary
    FROM employees e
    LEFT JOIN salary_records sr ON e.id = sr.employee_id AND sr.is_current = 1
    WHERE e.id = ?
  `, [newEmpId])[0].values[0][0];
  assert(coalesceQuery === 245e3, "COALESCE returns direct current_salary immediately");
  const page1 = db.exec("SELECT id FROM employees ORDER BY id ASC LIMIT 2 OFFSET 0")[0].values;
  const page2 = db.exec("SELECT id FROM employees ORDER BY id ASC LIMIT 2 OFFSET 2")[0].values;
  assert(page1.length <= 2, "Page 1 correctly limits records to 2");
  assert(page2.length <= 2, "Page 2 correctly limits records to 2");
  if (page1.length > 0 && page2.length > 0) {
    assert(page1[0][0] !== page2[0][0], "Page 1 and Page 2 records are distinct via OFFSET");
  }
  console.log(`
================================`);
  console.log(`Tests finished: ${passed} passed, ${failed} failed.`);
  console.log(`================================
`);
  if (failed > 0) {
    process.exit(1);
  }
}
runTests().catch((err) => {
  console.error("Test runner fatal error:", err);
  process.exit(1);
});
