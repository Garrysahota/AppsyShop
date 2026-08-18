/**
 * Typed useAppDispatch hook — AppsyShop
 * Use this instead of plain useDispatch everywhere in the app.
 */

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@store/store';

const useAppDispatch = () => useDispatch<AppDispatch>();
export default useAppDispatch;
