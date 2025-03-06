import { create } from 'zustand';

const useOnboarding = create((set) => ({
    currentStep: 'welcome',
    selectedOption: null,
    setSelectedOption: (option) => set({ selectedOption: option }),
    nextStep: () => set({ currentStep: 'setup' }),
    prevStep: () => set({ currentStep: 'welcome' }),
    resetOnboarding: () => set({ currentStep: 'welcome', selectedOption: null })
}));

export default useOnboarding; 