/**
 * Contacts Module
 * 
 * Re-exports all Contacts-related functions for convenient importing.
 */

import mapContacts from "./mapper"
export { mapContacts }
export {
  getContacts,
} from "./api"
export type { Contact } from "../types"

