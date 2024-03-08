import { create } from "zustand";

interface PublishProductStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useProductModal = create<PublishProductStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useProductModal;
