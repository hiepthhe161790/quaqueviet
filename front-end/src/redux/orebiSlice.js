import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  userInfo: {},
  products: [],
  checkedBrands: [],
  checkedCategorys: [],
  checkedPrices: [],
  checkedColors: [],
  allproducts: [],
  wishlish: [],
  cartTotalCount: 0,
  wistlistTotalCount: 0,
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id && item.variant  === action.payload.variant 
      );
      if (item) {
        const productInStock = action.payload.inStock.find(stock => stock.variant  === item.variant );
        if (item.quantity < productInStock.quantity) {
          item.quantity += action.payload.quantity;
        } else {
          toast.warning("Đã đạt tối đa số lượng sản phẩm !");
        }
      } else {
        state.products.push(action.payload);
        toast.success("Sản phẩm đã được thêm vào giỏ hàng");
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id && item.variant  === action.payload.variant 
      );
      if (item) {
        item.quantity++;
      }
    },
    drecreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id && item.variant  === action.payload.variant 
      );
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload._id || item.variant  !== action.payload.variant 
      );
      toast.success("Sản phẩm đã bỏ khỏi giỏ hàng");
    },
    deleteItemWL: (state, action) => {
      state.wishlish = state.wishlish.filter(
        (item) => item._id !== action.payload._id || item.variant  !== action.payload.variant 
      );
      toast.success("Sản phẩm đã bỏ khỏi Wishlist");
    },
    resetCart: (state) => {
      state.products = [];
    },
    addToWishlist: (state, action) => {
      const item = state.wishlish.find(
        (item) => item._id === action.payload._id && item.variant  === action.payload.variant 
      );
      if (item) {
        toast.warning("Sản phẩm đã tồn tại trong Wishlist");
      } else {
        state.wishlish.push(action.payload);
        toast.success("Sản phẩm đã được thêm vào Wishlist");
      }
    },
    resetWishlist: (state) => {
      state.wishlish = [];
    },

    calculateCartTotalCount: (state) => {
      state.cartTotalCount = state.products?.reduce((total, item) => total + item.quantity, 0);
    },

    calculateWishlistTotalCount: (state) => {
      state.wistlistTotalCount = state.wishlish?.reduce((total, item) => total + item.quantity, 0);
    },

    toggleBrand: (state, action) => {
      const brand = action.payload;
      const isBrandChecked = state.checkedBrands.some(
        (b) => b._id === brand._id
      );

      if (isBrandChecked) {
        state.checkedBrands = state.checkedBrands.filter(
          (b) => b._id !== brand._id
        );
      } else {
        state.checkedBrands.push(brand);
      }
    },

    toggleCategory: (state, action) => {
      const category = action.payload;
      const isCategoryChecked = state.checkedCategorys.some(
        (b) => b._id === category._id
      );

      if (isCategoryChecked) {
        state.checkedCategorys = state.checkedCategorys.filter(
          (b) => b._id !== category._id
        );
      } else {
        state.checkedCategorys.push(category);
      }
    },
    togglePrice: (state, action) => {
      const priceItem = action.payload;
      // If the clicked item is already selected, clear the selection.
      // The `find` is needed because state is an array `[item]`.
      if (priceItem && state.checkedPrices.find(p => p._id === priceItem._id)) {
        state.checkedPrices = [];
      } else {
        // Otherwise, set the selection to be ONLY the new item.
        state.checkedPrices = priceItem ? [priceItem] : [];
      }
    },
    toggleColor: (state, action) => {
      const color = action.payload;
      const isColorChecked = state.checkedColors.some(
        (c) => c._id === color._id
      );
      if (isColorChecked) {
        state.checkedColors = state.checkedColors.filter(
          (c) => c._id !== color._id
        );
      } else {
        state.checkedColors.push(color);
      }
    },
    resetFilters: (state) => {
      state.checkedBrands = [];
      state.checkedCategorys = [];
      state.checkedPrices = [];
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    resetUserInfo: (state) => {
      state.userInfo = {};
    },
    setProducts: (state, action) => {
      state.allproducts = action.payload;
    },
    resetProducts: (state) => {
      state.allproducts = [];
    },
    resetCheckedPrices: (state) => {
  state.checkedPrices = [];
},
  },
});

export const {
  addToCart,
  increaseQuantity,
  drecreaseQuantity,
  deleteItem,
  deleteItemWL,
  resetCart,
  toggleBrand,
  toggleCategory,
  togglePrice,
  toggleColor,
  resetFilters,
  setUserInfo,
  resetUserInfo,
  setProducts,
  resetProducts,
  addToWishlist,
  calculateCartTotalCount,
  calculateWishlistTotalCount,
  resetWishlist,
  resetCheckedPrices,
} = orebiSlice.actions;

export default orebiSlice.reducer;
