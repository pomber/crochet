export function getName(instance) {
  const elementType = instance.element.type;
  return typeof elementType === "string"
    ? elementType
    : elementType.name || "Anonymous";
}

export function componentNamesTree(instance) {
  return {
    name: getName(instance),
    children: instance.children.map(componentNamesTree)
  };
}
