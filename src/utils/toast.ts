import toast from 'react-hot-toast';

interface ShowToastOptions {
  id?: string;
}

export const toastUtils = {
  loading(message: string): string {
    return toast.loading(message);
  },

  success(message: string, options?: ShowToastOptions) {
    if (options?.id) {
      return toast.success(message, { id: options.id });
    }
    return toast.success(message);
  },

  error(message: string, options?: ShowToastOptions) {
    if (options?.id) {
      return toast.error(message, { id: options.id });
    }
    return toast.error(message);
  },

  dismiss(toastId?: string): void {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};
