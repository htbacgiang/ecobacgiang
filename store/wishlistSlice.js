import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Save to localStorage (only for authenticated users)
const saveWishlistToLocalStorage = (state, userId) => {
  if (userId && typeof window !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(state));
  }
};

// Clear localStorage
const clearWishlistFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("wishlist");
  }
};

// Async Thunks for API calls
export const addToWishlistDB = createAsyncThunk(
  "wishlist/addToWishlistDB",
  async ({ userId, product, style }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/wishlist", { userId, product, style });
      return response.data.wishlist; // API returns updated wishlist
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlistDB = createAsyncThunk(
  "wishlist/removeFromWishlistDB",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/wishlist/${productId}`, {
        data: { userId },
      });
      return response.data.wishlist; // API returns updated wishlist
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

export const fetchWishlistDB = createAsyncThunk(
  "wishlist/fetchWishlistDB",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/wishlist?userId=${userId}`);
      return response.data.wishlist; // API returns wishlist
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

export const clearWishlistDB = createAsyncThunk(
  "wishlist/clearWishlistDB",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete("/api/wishlist/clear", {
        data: { userId },
      });
      return response.data.wishlist; // API returns empty wishlist
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear wishlist");
    }
  }
);

const initialState = {
  wishlistItems: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      if (!Array.isArray(action.payload.wishlistItems)) {
        console.warn("Dữ liệu wishlistItems không hợp lệ:", action.payload.wishlistItems);
        state.wishlistItems = [];
      } else {
        state.wishlistItems = action.payload.wishlistItems;
      }
      saveWishlistToLocalStorage(state, action.payload.userId);
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.status = "idle";
      state.error = null;
      clearWishlistFromLocalStorage();
    },
  },
  extraReducers: (builder) => {
    // Add to Wishlist
    builder
      .addCase(addToWishlistDB.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToWishlistDB.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlistItems = action.payload;
        saveWishlistToLocalStorage(state, action.meta.arg.userId);
      })
      .addCase(addToWishlistDB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlistDB.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromWishlistDB.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlistItems = action.payload;
        saveWishlistToLocalStorage(state, action.meta.arg.userId);
      })
      .addCase(removeFromWishlistDB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Fetch Wishlist
    builder
      .addCase(fetchWishlistDB.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlistDB.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlistItems = action.payload;
        saveWishlistToLocalStorage(state, action.meta.arg);
      })
      .addCase(fetchWishlistDB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Clear Wishlist
    builder
      .addCase(clearWishlistDB.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearWishlistDB.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlistItems = action.payload;
        saveWishlistToLocalStorage(state, action.meta.arg.userId);
      })
      .addCase(clearWishlistDB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;