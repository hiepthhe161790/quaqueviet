import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "react-toastify";
import WishlistService from "../../services/api/WishlistService";

const userId = '6660389839c9c42c124688a3'
// const userId = null

export const fetchWistlist = createAsyncThunk('wishlist/fetchWistlist', async () => {
  const res = await WishlistService.getWishlist(userId)
  return res.items
})

const initialState = {
  status: '',
  wishlistData: [],
  productQuantity: 0,
  totalCount: 0,
  totalSubAmount: 0,
  tax: 0,
}

const wistlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWistlist: (state, action) => {
      const newProduct = action.payload.product;
      const itemIndex = state.wishlistData.findIndex(item => item?.productId?._id === newProduct._id);
      if (itemIndex < 0) {
        state.wishlistData.push({
          productId: newProduct,
          variant: newProduct.inStock[0].variant,
        });
        state.totalCount += 1;
        toast.success("Add new Food to wishlist successful..");
      } else {
        toast.error("Food already in wishlist!");
      }
    },
    deleteWishlist: (state, action) => {
      const { productId, variant } = action.payload;
      state.wishlistData = state.wishlistData.filter(item => !(item?.productId?._id === productId && item?.variant === variant));
      toast.success("Remove Food from wishlist successful!")
    },
    calculateTotalCountWL: (state, action) => {
      state.totalCount = state.wishlistData?.length
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWistlist.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchWistlist.fulfilled, (state, action) => {
        state.wishlistData = action.payload
        state.status = 'idle'
      })
  }
})

export const { addToWistlist, deleteWishlist, calculateTotalCountWL } = wistlistSlice.actions

export default wistlistSlice.reducer