import type { IComparable, IComparer } from "./types";

const PriorityComparer: IComparable<{ priority: number }> = {
  priority: 0,
  compareTo(other) {
    return this.priority - other.priority;
  },
}

const compare = (state): IComparable<{ state: number, }> => ({
  state,
  compareTo(other) {
    return this.state - other.state;
  }
})