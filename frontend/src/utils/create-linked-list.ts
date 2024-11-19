import { StepNode } from "../types";

 
// Function to create a linked list from the given steps
export const createLinkedList = (steps: string[]): StepNode<typeof steps[number]> => {
    const nodes: StepNode<typeof steps[number]>[] = steps.map((step) => ({
        step,
        next: null,
        prev: null,
    }));

    // Linking the nodes together
    nodes.forEach((node, index) => {
        if (index > 0) {
            node.prev = nodes[index - 1];   // Set the prev reference
            nodes[index - 1].next = node;   // Set the next reference
        }
    });

    return nodes[0];
};