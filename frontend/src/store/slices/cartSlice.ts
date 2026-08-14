import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Cart, AddToCartData, UpdateCartItemData } from '../../types/cart';
import cartService from '../../services/cartService';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  isUpdating: false,
};

function recalcCart(cart: Cart): Cart {
  const subtotal = cart.cart_items.reduce((sum, item) => {
    return sum + parseFloat(item.item_price) * item.quantity;
  }, 0);
  return {
    ...cart,
    cart_items: cart.cart_items.map((item) => ({
      ...item,
      total_price: (parseFloat(item.item_price) * item.quantity).toFixed(2),
    })),
    subtotal: subtotal.toFixed(2),
    total: subtotal.toFixed(2),
    items_count: cart.cart_items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await cartService.getCart();
  return response.data;
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: AddToCartData & { silent?: boolean }, { rejectWithValue }) => {
    const { silent, ...payload } = data;
    try {
      const response = await cartService.addItem(payload);
      if (!silent) toast.success('Item added to cart!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      if (!silent) toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (
    { itemId, data }: { itemId: number; data: UpdateCartItemData },
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = (getState() as { cart: CartState }).cart;
    const previousCart = state.cart;

    // Optimistic update
    dispatch(cartSlice.actions.optimisticUpdateQuantity({ itemId, quantity: data.quantity }));

    try {
      const response = await cartService.updateItem(itemId, data);
      return response.data;
    } catch (error: any) {
      // Revert
      dispatch(cartSlice.actions.setCart(previousCart));
      const message = error.response?.data?.message || 'Failed to update cart item';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: number, { dispatch, getState, rejectWithValue }) => {
    const state = (getState() as { cart: CartState }).cart;
    const previousCart = state.cart;

    // Optimistic update
    dispatch(cartSlice.actions.optimisticRemoveItem(itemId));

    try {
      const response = await cartService.removeItem(itemId);
      toast.success('Item removed from cart');
      return response.data;
    } catch (error: any) {
      // Revert
      dispatch(cartSlice.actions.setCart(previousCart));
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = (getState() as { cart: CartState }).cart;
    const previousCart = state.cart;

    // Optimistic update
    dispatch(cartSlice.actions.setCart(null));

    try {
      await cartService.clearCart();
      toast.success('Cart cleared');
      return null;
    } catch (error: any) {
      // Revert
      dispatch(cartSlice.actions.setCart(previousCart));
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cart = null;
      state.error = null;
    },
    setCart: (state, action: PayloadAction<Cart | null>) => {
      state.cart = action.payload;
    },
    optimisticUpdateQuantity: (
      state,
      action: PayloadAction<{ itemId: number; quantity: number }>
    ) => {
      if (!state.cart) return;
      const item = state.cart.cart_items.find((i) => i.id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
        state.cart = recalcCart(state.cart);
      }
    },
    optimisticRemoveItem: (state, action: PayloadAction<number>) => {
      if (!state.cart) return;
      state.cart.cart_items = state.cart.cart_items.filter((i) => i.id !== action.payload);
      state.cart = recalcCart(state.cart);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.isUpdating = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Update cart item — optimistic already applied; just sync server response
      .addCase(updateCartItem.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Remove from cart — optimistic already applied; just sync server response
      .addCase(removeFromCart.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Clear cart — optimistic already applied
      .addCase(clearCart.pending, (state) => {
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
