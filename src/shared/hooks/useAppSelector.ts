/**
 * Typed useAppSelector hook — AppsyShop
 * Use this instead of plain useSelector everywhere in the app.
 */

import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@store/rootReducer';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;
