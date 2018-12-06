//
// todo use call return pattern

function arrify(val) {
  return val == null ? [] : Array.isArray(val) ? val : [val];
}

const TEXT_ELEMENT = "TEXT ELEMENT";
function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}
function createElement(type, config, ...args) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];
  props.children = rawChildren
    .filter(c => c != null && c !== false)
    .map(c => (c instanceof Object ? c : createTextElement(c)));
  return { type, props };
}

//

let context = {
  children: [],
  instance: {
    children: [],
    states: null,
    stateIndex: 0,
    element: null,
    effects: null,
    effectIndex: 0,
    refs: [],
    refIndex: 0
  }
};

let rootInstance = newInstance();

function logTree(instance, leftPad = "") {
  if (window.__CROCHET_DEVTOOLS_GLOBAL_HOOK__) {
    window.__CROCHET_DEVTOOLS_GLOBAL_HOOK__.post(
      JSON.parse(JSON.stringify(instance))
    );
  }
  if (leftPad === "") {
    console.log("---");
  }
  const { element, children, refs, states } = instance;
  console.log(
    leftPad +
      "<" +
      (element.type.name ? element.type.name : element.type) +
      "/>"
  );
  console.log(leftPad + "refs", refs);
  console.log(leftPad + "states", states);
  console.log(leftPad + "children", children);

  children.forEach(child => logTree(child, leftPad + "  "));
}

function updateWithEffects(instance) {
  logTree(instance);
  update(instance);
  runEffects(instance);
}

function newInstance() {
  return { refs: [], children: [] };
}

function runEffects(instance) {
  instance.children.forEach(runEffects);
  const childRefs = instance.children.map(child => child.returnRef);
  // console.log("childRefs", childRefs);
  if (instance.effects) {
    // console.log(instance.effects);
    instance.effects.forEach(effect => {
      const [fn, input, shouldRun, cleanup] = effect;

      // console.log("cleanup", effect);
      if (cleanup) {
        console.log("RUNNING CLEANUP", cleanup.name);
        cleanup();
      }

      console.log("RUNNING EFFECT", fn.name);
      const newCleanup = fn(childRefs);

      effect[3] = newCleanup;
    });
  }
}

function update(instance) {
  if (!instance.element) {
    // ummount
    return;
  }

  console.log("RENDER", instance.element.type.name);

  context.children = [];
  context.instance = instance;
  context.instance.stateIndex = 0;
  context.instance.effectIndex = 0;
  context.instance.refIndex = 0;
  context.instance.returnRef = {};

  // render
  instance.element.type(instance.element.props);

  // reconciliation
  const childElements = context.children;
  const childInstances = instance.children || [];
  const newChildInstances = [];
  for (
    let i = 0;
    i < Math.max(childElements.length, childInstances.length);
    i++
  ) {
    let childInstance = childInstances[i];
    const childElement = childElements[i];
    if (!childInstance) {
      // mount
      childInstance = newInstance();
      childInstance.element = childElement;
      update(childInstance);
    } else if (childInstance.element.type !== childElement.type) {
      // umount
      childInstance.prevElement = childInstance.element;
      childInstance.element = null;
      update(childInstance);

      // mount
      childInstance = newInstance();
      childInstance.element = childElement;
      update(childInstance);
    } else {
      // update
      childInstance.prevElement = childInstance.element;
      childInstance.element = childElement;
      update(childInstance);
    }

    if (childInstance && childInstance.element) {
      newChildInstances.push(childInstance);
    }
  }

  instance.children = newChildInstances;
}

function renderRoot(element) {
  rootInstance.element = element;
  updateWithEffects(rootInstance);
}

export function useChildren(elements) {
  context.children.push(...arrify(elements));
}

export function useState(initial) {
  const { instance } = context;
  instance.states = instance.states || [];
  const { states, stateIndex } = instance;
  if (states.length === stateIndex) {
    states.push([
      initial,
      newState => {
        console.log("setState", states[stateIndex][0], newState);
        states[stateIndex][0] = newState;
        updateWithEffects(instance);
      }
    ]);
  }
  instance.stateIndex = stateIndex + 1;
  // console.log("states", states, stateIndex);
  return states[stateIndex];
}

export function useRef(initial) {
  const { refs, refIndex } = context.instance;
  if (refs.length === refIndex) {
    refs.push(initial);
  }
  context.instance.refIndex++;
  return refs[refIndex];
}

export function useReturnRef() {
  return context.instance.returnRef;
}

export function useEffect(effect, inputs) {
  const { instance } = context;
  instance.effects = instance.effects || [];

  const { effects, effectIndex } = instance;
  const previousEffect = instance.effects[effectIndex];
  effects[effectIndex] = [
    effect,
    inputs,
    true,
    previousEffect && previousEffect[3]
  ];
  instance.effectIndex++;
}

export default {
  render: renderRoot,
  createElement
};
