interface SelectableElement {
  className: string;
  id: string;
  type: string;
}
export const isMatch = (selector: string, element: SelectableElement) => {
  if (selector === "*") {
    return true;
  }
  if (selector.startsWith("#")) {
    return element.id === selector.substring(1);
  }
  if (selector.startsWith(".")) {
    if (selector === ".*") {
      return !element.className;
    }
    return (element.className || "").split(" ").includes(selector.substring(1));
  }
  return element.type === selector;
};
export const select = (
  selector: string,
  elements: readonly SelectableElement[],
): readonly SelectableElement[] => {
  if (selector === "*") {
    return elements;
  }
  if (selector.startsWith("#")) {
    const id = selector.substring(1);
    return elements.filter((e) => e.id === id);
  }
  if (selector.startsWith(".")) {
    const clz = selector.substring(1);
    return elements.filter((e) => (e.className || "").split(" ").includes(clz));
  }
  // select by tag "rectangle" | "freedraw" | "line" | "text"
  return elements.filter((e) => e.type === selector);
};
