import { ToasterProps } from 'react-hot-toast';

const TOAST_COLORS = {
  default: {
    background: '#363636',
    text: '#FFFFFF',
  },
  success: {
    background: '#4CAF50',
    text: '#FFFFFF',
  },
  error: {
    background: '#EF4444',
    text: '#FFFFFF',
  },
} as const;

const TOAST_DURATION = {
  default: 4000,
  success: 3000,
  error: 5000,
} as const;

export const toastConfig: ToasterProps = {
  position: 'top-right',
  toastOptions: {
    duration: TOAST_DURATION.default,
    style: {
      background: TOAST_COLORS.default.background,
      color: TOAST_COLORS.default.text,
    },
    success: {
      duration: TOAST_DURATION.success,
      style: {
        background: TOAST_COLORS.success.background,
        color: TOAST_COLORS.success.text,
      },
    },
    error: {
      duration: TOAST_DURATION.error,
      style: {
        background: TOAST_COLORS.error.background,
        color: TOAST_COLORS.error.text,
      },
    },
  },
};
