import { useDispatch, useSelector } from 'react-redux';

/**
 * Typed hooks for Redux
 * Use these instead of plain useDispatch and useSelector
 */
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

