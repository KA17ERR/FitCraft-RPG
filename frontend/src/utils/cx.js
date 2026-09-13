import clsx from "clsx";

/**
 * Thin wrapper around clsx so components have one place to import from.
 * Usage: cx("base-class", condition && "conditional-class")
 */
export function cx(...args) {
  return clsx(...args);
}
