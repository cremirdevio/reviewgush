import { auth_cache_key } from './../../config/site.config';
import { RGProfile, CachedUser } from "./../../types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AuthManagerService from "../../services/AuthManagerService";
import { RootState } from "../../store";
import { LoadingState, LoginData, RegisterData, RGUser } from "../../types";

export interface AuthState {
  user: RGUser | null;
  profile: RGProfile | null;
  status: LoadingState;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  status: "idle",
};

// Async Thunks

/**
 * Log User In with Email and Password
 */
export const logUserIn = createAsyncThunk(
  "auth/logUserIn",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      return AuthManagerService.logUserIn(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Log User out of their account
 */
export const logUserOut = createAsyncThunk(
  "auth/logUserOut",
  async (_, { rejectWithValue }) => {
    try {
      return AuthManagerService.logUserOut();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Register a new user account
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      return AuthManagerService.registerUser(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Update users profile
 */
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      // return AuthManagerService.updateProfile(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Get the updated users profile
 */
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user, status } = getState() as AuthState;

      return AuthManagerService.getUserProfile(user!.uid);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logUserInFromCache: (state, action: PayloadAction<CachedUser>) => {
      state.user = action.payload.user;
      state.profile = action.payload.profile;
    },
  },
  extraReducers: (builder) => {
    // logUserIn Reducer
    builder.addCase(logUserIn.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(logUserIn.fulfilled, (state, { payload }) => {
      state.status = "success";

      if (payload) {
        state.user = payload.user;
        state.profile = payload.profile;
        
        window.localStorage.setItem(auth_cache_key, JSON.stringify({ user: payload.user, profile: payload.profile}))
      }
    });
    builder.addCase(logUserIn.rejected, (state, action) => {
      state.status = "failed";
    });

    // logUserOut Reducer
    builder.addCase(logUserOut.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(logUserOut.fulfilled, (state, action) => {
      state.status = "success";
      state.user = null;
      state.profile = null;

      window.localStorage.removeItem(auth_cache_key);
    });
    builder.addCase(logUserOut.rejected, (state, action) => {
      state.status = "failed";
    });

    // registerNewUser Reducer
    builder.addCase(registerUser.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.status = "success";

      if (payload) {
        state.user = payload.user;
        state.profile = payload.profile;
      }
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = "failed";
    });

    // updateUserProfile Reducer
    builder.addCase(updateUserProfile.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(updateUserProfile.fulfilled, (state, { payload }) => {
      state.status = "success";
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.status = "failed";
    });

    // Fetch Users Profile Reducer
    builder.addCase(fetchUserProfile.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
      state.status = "success";
      state.profile = payload;

      window.localStorage.setItem(
        "authenticated_user",
        JSON.stringify({ user: state.user, profile: payload })
      );
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export const { logUserInFromCache } = authSlice.actions;
