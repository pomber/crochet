import { useChildren, useEffect, useReturnRef, useRef } from "./crochet";

export function useRoot($root) {
  useEffect(function commitRoot(childRefs) {
    let childNodes = childRefs.map(ref => ref.$nodes)[0];
    // console.log("childNodes", childRefs);
    // console.log("childNodes", childNodes);

    childNodes.forEach($child => $root.appendChild($child));
    return function cleanupRoot() {
      childNodes.forEach($child => $root.removeChild($child));
    };
  });
}

export function useDomChildren(element) {
  const $selfRef = useReturnRef();
  useChildren(element);
  useEffect(function commitDomChildren(childRefs) {
    const childNodes = childRefs.map(ref => ref.$node);
    $selfRef.$nodes = childNodes;
  });
}

export function Div(props) {
  // console.log("Div", props);
  const returnRef = useReturnRef();
  const selfRef = useRef({});

  useEffect(function commitDiv() {
    if (!selfRef.$node) {
      selfRef.$node = document.createElement("div");
    }
    selfRef.$node.innerText = props.name;
    returnRef.$node = selfRef.$node;
    return function cleanupDiv() {
      // ??
      // $root.removeChild($self);
    };
  });
}

export function Button(props) {
  const returnRef = useReturnRef();
  const selfRef = useRef({});
  useEffect(function commitButton() {
    if (!selfRef.$node) {
      selfRef.$node = document.createElement("button");
    }
    selfRef.$node.innerText = "Click";

    selfRef.$node.addEventListener("click", props.onClick);
    returnRef.$node = selfRef.$node;
    return function cleanupButton() {
      // $root.removeChild($self);
      selfRef.$node.removeEventListener("click", props.onClick);
    };
  });
}
