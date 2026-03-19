import { ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../reducers/root-reducer';

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, any>;

