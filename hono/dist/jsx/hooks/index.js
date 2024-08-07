// src/jsx/hooks/index.ts
import { DOM_STASH } from "../constants.js";
import { build, buildDataStack, update } from "../dom/render.js";
var STASH_SATE = 0;
var STASH_EFFECT = 1;
var STASH_CALLBACK = 2;
var STASH_USE = 3;
var STASH_MEMO = 4;
var STASH_REF = 5;
var resolvedPromiseValueMap = /* @__PURE__ */ new WeakMap();
var isDepsChanged = (prevDeps, deps) => !prevDeps || !deps || prevDeps.length !== deps.length || deps.some((dep, i) => dep !== prevDeps[i]);
var viewTransitionState = void 0;
var documentStartViewTransition = (cb) => {
  if (document?.startViewTransition) {
    return document.startViewTransition(cb);
  } else {
    cb();
    return { finished: Promise.resolve() };
  }
};
var updateHook = void 0;
var viewTransitionHook = (context, node, cb) => {
  const state = [true, false];
  let lastVC = node.vC;
  return documentStartViewTransition(() => {
    if (lastVC === node.vC) {
      viewTransitionState = state;
      cb(context);
      viewTransitionState = void 0;
      lastVC = node.vC;
    }
  }).finished.then(() => {
    if (state[1] && lastVC === node.vC) {
      state[0] = false;
      viewTransitionState = state;
      cb(context);
      viewTransitionState = void 0;
    }
  });
};
var startViewTransition = (callback) => {
  updateHook = viewTransitionHook;
  try {
    callback();
  } finally {
    updateHook = void 0;
  }
};
var useViewTransition = () => {
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    return [false, () => {
    }];
  }
  if (viewTransitionState) {
    viewTransitionState[1] = true;
  }
  return [!!viewTransitionState?.[0], startViewTransition];
};
var pendingStack = [];
var runCallback = (type, callback) => {
  pendingStack.push(type);
  try {
    callback();
  } finally {
    pendingStack.pop();
  }
};
var startTransition = (callback) => {
  runCallback(1, callback);
};
var startTransitionHook = (callback) => {
  runCallback(2, callback);
};
var useTransition = () => {
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    return [false, () => {
    }];
  }
  const [context] = buildData;
  return [context[0] === 2, startTransitionHook];
};
var useDeferredValue = (value) => {
  const buildData = buildDataStack.at(-1);
  if (buildData) {
    buildData[0][0] = 1;
  }
  return value;
};
var setShadow = (node) => {
  if (node.vC) {
    node.s = node.vC;
    node.vC = void 0;
  }
  ;
  node.s?.forEach(setShadow);
};
var useState = (initialState) => {
  const resolveInitialState = () => typeof initialState === "function" ? initialState() : initialState;
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    return [resolveInitialState(), () => {
    }];
  }
  const [, node] = buildData;
  const stateArray = node[DOM_STASH][1][STASH_SATE] ||= [];
  const hookIndex = node[DOM_STASH][0]++;
  return stateArray[hookIndex] ||= [
    resolveInitialState(),
    (newState) => {
      const localUpdateHook = updateHook;
      const stateData = stateArray[hookIndex];
      if (typeof newState === "function") {
        newState = newState(stateData[0]);
      }
      if (!Object.is(newState, stateData[0])) {
        stateData[0] = newState;
        if (pendingStack.length) {
          const pendingType = pendingStack.at(-1);
          update([pendingType, false, localUpdateHook], node).then((node2) => {
            if (!node2 || pendingType !== 2) {
              return;
            }
            const lastVC = node2.vC;
            const addUpdateTask = () => {
              setTimeout(() => {
                if (lastVC !== node2.vC) {
                  return;
                }
                const shadowNode = Object.assign({}, node2);
                shadowNode.vC = void 0;
                build([], shadowNode, void 0);
                setShadow(shadowNode);
                node2.s = shadowNode.s;
                update([0, false, localUpdateHook], node2);
              });
            };
            if (localUpdateHook) {
              requestAnimationFrame(addUpdateTask);
            } else {
              addUpdateTask();
            }
          });
        } else {
          update([0, false, localUpdateHook], node);
        }
      }
    }
  ];
};
var useReducer = (reducer, initialArg, init) => {
  const [state, setState] = useState(() => init ? init(initialArg) : initialArg);
  return [
    state,
    (action) => {
      setState((state2) => reducer(state2, action));
    }
  ];
};
var useEffectCommon = (index, effect, deps) => {
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    return;
  }
  const [, node] = buildData;
  const effectDepsArray = node[DOM_STASH][1][STASH_EFFECT] ||= [];
  const hookIndex = node[DOM_STASH][0]++;
  const [prevDeps, , prevCleanup] = effectDepsArray[hookIndex] ||= [];
  if (isDepsChanged(prevDeps, deps)) {
    if (prevCleanup) {
      prevCleanup();
    }
    const runner = () => {
      data[index] = void 0;
      data[2] = effect();
    };
    const data = [deps, void 0, void 0, void 0, void 0];
    data[index] = runner;
    effectDepsArray[hookIndex] = data;
  }
};
var useEffect = (effect, deps) => useEffectCommon(3, effect, deps);
var useLayoutEffect = (effect, deps) => useEffectCommon(1, effect, deps);
var useInsertionEffect = (effect, deps) => useEffectCommon(4, effect, deps);
var useCallback = (callback, deps) => {
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    return callback;
  }
  const [, node] = buildData;
  const callbackArray = node[DOM_STASH][1][STASH_CALLBACK] ||= [];
  const hookIndex = node[DOM_STASH][0]++;
  const prevDeps = callbackArray[hookIndex];
  if (isDepsChanged(prevDeps?.[1], deps)) {
    callbackArray[hookIndex] = [callback, deps];
  } else {
    callback = callbackArray[hookIndex][0];
  }
  return callback;
};
var useRef = (initialValue) => {
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    return { current: initialValue };
  }
  const [, node] = buildData;
  const refArray = node[DOM_STASH][1][STASH_REF] ||= [];
  const hookIndex = node[DOM_STASH][0]++;
  return refArray[hookIndex] ||= { current: initialValue };
};
var use = (promise) => {
  const cachedRes = resolvedPromiseValueMap.get(promise);
  if (cachedRes) {
    if (cachedRes.length === 2) {
      throw cachedRes[1];
    }
    return cachedRes[0];
  }
  promise.then(
    (res2) => resolvedPromiseValueMap.set(promise, [res2]),
    (e) => resolvedPromiseValueMap.set(promise, [void 0, e])
  );
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    throw promise;
  }
  const [, node] = buildData;
  const promiseArray = node[DOM_STASH][1][STASH_USE] ||= [];
  const hookIndex = node[DOM_STASH][0]++;
  promise.then(
    (res2) => {
      promiseArray[hookIndex] = [res2];
    },
    (e) => {
      promiseArray[hookIndex] = [void 0, e];
    }
  );
  const res = promiseArray[hookIndex];
  if (res) {
    if (res.length === 2) {
      throw res[1];
    }
    return res[0];
  }
  throw promise;
};
var useMemo = (factory, deps) => {
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    return factory();
  }
  const [, node] = buildData;
  const memoArray = node[DOM_STASH][1][STASH_MEMO] ||= [];
  const hookIndex = node[DOM_STASH][0]++;
  const prevDeps = memoArray[hookIndex];
  if (isDepsChanged(prevDeps?.[1], deps)) {
    memoArray[hookIndex] = [factory(), deps];
  }
  return memoArray[hookIndex][0];
};
var idCounter = 0;
var useId = () => useMemo(() => `:r${(idCounter++).toString(32)}:`, []);
var useDebugValue = (_value, _formatter) => {
};
var createRef = () => {
  return { current: null };
};
var forwardRef = (Component) => {
  return (props) => {
    const { ref, ...rest } = props;
    return Component(rest, ref);
  };
};
var useImperativeHandle = (ref, createHandle, deps) => {
  useEffect(() => {
    ref.current = createHandle();
    return () => {
      ref.current = null;
    };
  }, deps);
};
var useSyncExternalStore = (subscribe, getSnapshot, getServerSnapshot) => {
  const buildData = buildDataStack.at(-1);
  if (!buildData) {
    if (!getServerSnapshot) {
      throw new Error("getServerSnapshot is required for server side rendering");
    }
    return getServerSnapshot();
  }
  const [serverSnapshotIsUsed] = useState(!!(buildData[0][4] && getServerSnapshot));
  const [state, setState] = useState(
    () => serverSnapshotIsUsed ? getServerSnapshot() : getSnapshot()
  );
  useEffect(() => {
    if (serverSnapshotIsUsed) {
      setState(getSnapshot());
    }
    return subscribe(() => {
      setState(getSnapshot());
    });
  }, []);
  return state;
};
export {
  STASH_EFFECT,
  createRef,
  forwardRef,
  startTransition,
  startViewTransition,
  use,
  useCallback,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  useViewTransition
};
