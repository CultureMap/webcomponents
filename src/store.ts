import { State } from "@stencil/core";

/**
 * Function to dispatch a message to the store.
 */
export interface Dispatch<M> {
  (message: M): void;
}

/**
 * Contains the two key elements needed by render functions to build interactive UIs: the current state and a dispatch
 * function.
 */
export interface Store<S, M> {
  state: S;
  dispatch: Dispatch<M>;
}

/**
 * Makes your Stencil web component a Store.
 */
export abstract class StoreBase<S, M> implements Store<S, M> {

  /**
   * The current state of the store; the single source of truth. May only be modified by sending messages to the
   * dispatch function.
   */
  @State() state: S;

  /**
   * Called by the dispatch function to transform the current state into a new state.
   * @param state {S}
   * @param message {M}
   * @template S, M
   */
  abstract update(state: S, message: M): S;

  /**
   * Dispatch a message to the store.
   * @param message {M}
   * @template M
   */
  dispatch(message: M) {
    try {
      this.state = this.update(this.state, message);
    } catch (err) {
      console.error("StoreBase.dispatch: exception dispatching message", err, message, this.state);
    }
  }
}
