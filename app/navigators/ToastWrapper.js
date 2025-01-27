import React, { forwardRef, useImperativeHandle } from 'react';
import Toast from 'react-native-toast-message';

const ToastWrapper = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    show: (options) => {
      Toast.show(options);
    },
    hide: () => {
      Toast.hide();
    },
  }));

  return <Toast/>;
});

export default ToastWrapper;
