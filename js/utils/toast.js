import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const toast = {
  success(message) {
    Toastify({
      text: message,
      duration: 3000,
      destination: 'https://github.com/apvarun/toastify-js',
      newWindow: true,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `right`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#81c784',
      },
      onClick: function () {}, // Callback after click
    }).showToast()
  },

  error(message) {
    Toastify({
      text: message,
      duration: 3000,
      destination: 'https://github.com/apvarun/toastify-js',
      newWindow: true,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `right`, `center` or `right`
      // stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: '#e57373',
      },
      onClick: function () {}, // Callback after click
    }).showToast()
  },
}
