import { toast } from 'react-toastify';

export default (type, message) => {
  switch (type) {
    case 'success':
      return toast.success(message);

    case 'info':
      return toast.info(message);

    case 'warn':
      return toast.warn(message);

    case 'error':
      return toast.error(message);

    default:
      return toast.dismiss();
  }
};
