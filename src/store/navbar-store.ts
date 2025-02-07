import { create } from "zustand";
import { ProductInfo, CategoriesType } from "../routes/index.ts";
import { UsersType } from "../types/account-types.ts";
import { BasketProductType } from "../types/product-detail-types.ts";

interface NavbarStoreType {
    categories:CategoriesType | null;
    handleMenu:boolean,
    handleBasket:boolean,
    handleAccount:boolean,
    handlePopupMenu:number | null,
    basket:BasketProductType | undefined,
    search:string | undefined,
    searchResults:ProductInfo[] | undefined,
    profileDetail:UsersType | undefined
    setCategories: (categories: CategoriesType) => void;
    sethandleMenu: () => void;
    sethandleBasket: () => void;
    sethandleAccount: () => void;
    sethandlePopupMenu: (handlePopupMenu:number | null) => void;
    setBasket:(newBasket: BasketProductType | undefined) => void;
    setSearch:(search:string | undefined) => void,
    setSearchResults: (searchResults: ProductInfo[] | undefined) => void;
    setProfileDetail:(profileDetail:UsersType | undefined) => void;
}

export const navBarStore = create<NavbarStoreType>()((set) => ({
    categories:null,
    handleMenu:false,
    handleBasket:false,
    handleAccount:false,
    handlePopupMenu:null,
    basket:undefined,
    search:undefined,
    searchResults:undefined,
    profileDetail:undefined,
    setCategories: (categories) => set({categories}),
    sethandleMenu: () => set((state) => ({handleMenu: !state.handleMenu})),
    sethandleBasket: () => set((state) => ({handleBasket: !state.handleBasket})),
    sethandleAccount:() => set((state) => ({handleAccount: !state.handleAccount})),
    sethandlePopupMenu:(handlePopupMenu) => set({handlePopupMenu}),
    setBasket: (newBasket) => set({basket:newBasket}),
    setSearch:(search) => set({search}),
    setSearchResults: (searchResults) => set({searchResults}),
    setProfileDetail: (profileDetail) => set({profileDetail}),
}));