import { create } from "zustand";
import { createLinkedList } from "../../../utils/create-linked-list";
import { StepNode } from "../../../types";
import { createJSONStorage, persist } from "zustand/middleware";

interface SignUpStepState {
    currentStep: StepNode<typeof steps[number]>; // The current step
    next: () => void;
    prev: () => void;
    reset: () => void;
}

const steps = ["sign-up", "otp", "profile", "success"];

const initialStep = createLinkedList(steps);

// Create the Zustand store with the necessary actions and state
export const useSignUpStep = create(
    persist<SignUpStepState>(
        (set) => ({
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
        }),
        {
            name: "sign-up-step", // name of the item in the storage
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
