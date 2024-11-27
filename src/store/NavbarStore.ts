import { create } from "zustand";
import { CategoriesType, VariantsType } from "../pages/index.ts";

interface NavbarStoreType {
    categories:CategoriesType | null;
    handleMenu:boolean,
    handleBasket:boolean,
    handleAccount:boolean,
    handlePopupMenu:number | null,
    basket:VariantsType[],
    setCategories: (categories: CategoriesType) => void;
    sethandleMenu: () => void;
    sethandleBasket: () => void;
    sethandleAccount: () => void;
    sethandlePopupMenu: (handlePopupMenu:number | null) => void;
    setBasket:(newBasket: VariantsType[]) => void;
    removeFromBasket:(variantToRemove:VariantsType) => void;
}

export const navBarStore = create<NavbarStoreType>()((set) => ({
    categories:null,
    handleMenu:false,
    handleBasket:false,
    handleAccount:false,
    handlePopupMenu:null,
    basket:[],
    setCategories: (categories) => set({categories}),
    sethandleMenu: () => set((state) => ({handleMenu: !state.handleMenu})),
    sethandleBasket: () => set((state) => ({handleBasket: !state.handleBasket})),
    sethandleAccount:() => set((state) => ({handleAccount: !state.handleAccount})),
    sethandlePopupMenu:(handlePopupMenu) => set({handlePopupMenu}),
    setBasket: (newBasket) => set({basket:newBasket}),
    removeFromBasket: (variantToRemove) => set((state) => ({
        basket:state.basket.filter(
            (variant) => variant.id !== variantToRemove.id
        ),
    })),
}));