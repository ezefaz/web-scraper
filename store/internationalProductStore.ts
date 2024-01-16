import { create } from 'zustand';

const internationalProductStore = create((set) => ({
  productData: null,
  setProductData: (data: any) => set({ productData: data }),
}));

export default internationalProductStore;
