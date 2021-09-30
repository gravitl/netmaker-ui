
export const correctIPRegex = new RegExp(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i)


export const correctUserNameRegex = new RegExp(
  /^([a-zA-Z0-9,\-,.]{3,40})|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})$/i
);
export const correctPasswordRegex = new RegExp(/^.{5,64}$/i);
