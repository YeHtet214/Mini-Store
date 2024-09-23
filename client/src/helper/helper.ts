export const requsetClientToRegister = (toLogin: boolean) => {
      return toLogin;
}

export const getUserId = () => {
      return Number(localStorage.getItem('user_id'));
}

export const removeLeadingZero = (value: number, firstChar: number) => {
      // limit the maximum value
      if (value > 20) value = 20;
      const integer = Number(String(value).replace(/^0+/, ''));
      return (
            firstChar === 0 ? integer// remove leading zero
            : value < 1 ? 1
            : value
      )
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
      let timeout: number | null;
  
      return function(this: ThisParameterType<T>, ...args: Parameters<T>): void {
            if (timeout) {
                  clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                  func.apply(this, args);
            }, delay);
      };
  }
  