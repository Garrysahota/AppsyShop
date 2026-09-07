import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@store/rootReducer';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;
