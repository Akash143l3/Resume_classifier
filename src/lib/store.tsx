import { create } from "zustand";

type JobStore = {
  role: string;
  description: string;
  setJobDetails: (role: string, description: string) => void;
};

export const useJobStore = create<JobStore>((set:any) => ({
  role: "Developer",
  description: "Python",
  setJobDetails: (role:any, description:any) => set({ role, description }),
}));
