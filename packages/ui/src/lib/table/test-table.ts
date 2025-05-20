/**
 * This file contains definitions used specifically for testing table components.
 * Add any test-related object definitions here.
 */

export interface Person {
  name: string;
  // do not allow children to have children
  children: Array<Person & { children: [] }>;
}
