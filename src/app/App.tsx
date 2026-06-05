import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { StateProvider } from '../context/StateContext';
import { router } from './routes';

export default function App() {
  return (
    <StateProvider>
      <RouterProvider router={router} />
    </StateProvider>
  );
}
