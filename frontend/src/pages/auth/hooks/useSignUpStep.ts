import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SignUpStepState {
    currentStep: string;
    steps: string[]; 
    next: () => void; 
    prev: () => void; 
    reset: () => void;
}

const steps = ["sign-up", "otp", "profile", "success"]; // Define your steps

export const useSignUpStep = create(
    persist<SignUpStepState>(
        (set) => ({
            currentStep: steps[0], // Start at the first step
            steps,
            next: () => {
                set((state) => {
                    const currentIndex = state.steps.indexOf(state.currentStep);
                    if (currentIndex < state.steps.length - 1) {
                        return { currentStep: state.steps[currentIndex + 1] };
                    }
                    return state;
                });
            },
            prev: () => {
                set((state) => {
                    const currentIndex = state.steps.indexOf(state.currentStep);
                    if (currentIndex > 0) {
                        return { currentStep: state.steps[currentIndex - 1] };
                    }
                    return state;
                });
            },
            reset: () => set({ currentStep: steps[0] }), // Reset to the first step
        }),
        {
            name: "sign-up-step", // Storage key
            storage: createJSONStorage(() => localStorage),
        }
    )
);
