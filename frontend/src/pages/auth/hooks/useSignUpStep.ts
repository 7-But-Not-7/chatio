import { create } from "zustand";

// Using Linked List to manage the steps

interface StepNode {
    step: number | string;
    next: StepNode | null;
    prev: StepNode | null;
}

interface SignUpStepState {
    currentStep: StepNode;
    next: () => void;
    prev: () => void;
    reset: () => void;
}

// Function to create a linked list from the given steps
const createLinkedList = (steps: (number | string)[]): StepNode => {
    const nodes: StepNode[] = steps.map((step) => ({
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


const steps = [0, 1, 2, 3];
const initialStep = createLinkedList(steps);

// Create the Zustand store with the necessary actions and state
export const useSignUpStep = create<SignUpStepState>((set) => ({
    currentStep: initialStep,
    next: () => set((state) => {
        if (state.currentStep.next) {
            return { currentStep: state.currentStep.next };
        }
        return state;
    }),
    prev: () => set((state) => {
        if (state.currentStep.prev) {
            return { currentStep: state.currentStep.prev };
        }
        return state;
    }),
    reset: () => set({ currentStep: initialStep }), // Reset to the initial step
}));
