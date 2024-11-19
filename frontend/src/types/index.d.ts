
// Step Node
export interface StepNode<T> {
    step: T;
    next: StepNode<T> | null;
    prev: StepNode<T> | null;
}