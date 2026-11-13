// Demo assessment store: accounts, sessions and carts live in memory.
// Restarting the API clears this data. Use a database for production persistence.
export const accounts = new Map();
export const sessions = new Map();
export const carts = new Map();
