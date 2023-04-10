import { setupAPIClient } from "./api";

export const api = setupAPIClient();

// export async function logIn(credentials) {
//      return api.post('/login',credentials).then(response => {
//         return response.data;
//     }).catch(error => {
//         console.log(error);
//     })
// }