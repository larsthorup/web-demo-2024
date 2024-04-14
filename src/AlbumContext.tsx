// Type of state

import { createContext, useContext, useReducer } from "react";

export interface Album {
  title: string;
  date: string;
}

interface AlbumState {
  albums: Album[];
  artist: string;
  date: string;
}

// Initial state
const initialState: AlbumState = {
  albums: [],
  artist: "",
  date: "",
};

// Type of actions
type AlbumAction =
  | { type: "fetched"; payload: { albums: Album[], artist: string, date: string } }
  | { type: "reset" };

// Reducer
const albumReducer = (state: AlbumState, action: AlbumAction) => {
  switch (action.type) {
    case "fetched":
      return { ...state, ...action.payload };
    case "reset":
      return { ... initialState };
  }
};

// State context
const AlbumContext = createContext<AlbumState | null>(null);

// Dispatch context
const AlbumDispatchContext = createContext<React.Dispatch<AlbumAction> | null>(null);

// Provider
type AlbumProviderProps = React.PropsWithChildren<{ state?: AlbumState }>;
export function AlbumProvider({ children, state: explicitState }: AlbumProviderProps) {
  const [state, dispatch] = useReducer(
    albumReducer,
    explicitState || initialState
  );
  return (
    <AlbumContext.Provider value={state}>
      <AlbumDispatchContext.Provider value={dispatch}>
        {children}
      </AlbumDispatchContext.Provider>
    </AlbumContext.Provider>
  );
}

// state hook
export function useAlbumState() {
  const myState = useContext(AlbumContext);
  if (myState === null) {
    throw new Error("Unexpected useAlbumState without parent <MyProvider>");
  }
  return myState;
}

// dispatch hook
export function useAlbumDispatch() {
  const dispatch = useContext(AlbumDispatchContext);
  if (dispatch === null) {
    throw new Error("Unexpected useAlbumDispatch without parent <MyProvider>");
  }
  return dispatch;
}
