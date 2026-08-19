import { useSyncExternalStore } from 'react'

// Demo authentication only.
// Production authentication must use secure server-side authentication.
const ADMIN_KEY = 'vortexnova_admin'
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin'

let authenticated = false
try {
  authenticated = window.localStorage.getItem(ADMIN_KEY) === '1'
} catch {
  /* storage unavailable */
}

const listeners = new Set()

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emit() {
  listeners.forEach((fn) => fn())
}

export function loginAdmin(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    authenticated = true
    try {
      window.localStorage.setItem(ADMIN_KEY, '1')
    } catch {
      /* ignore */
    }
    emit()
    return true
  }
  return false
}

export function logoutAdmin() {
  authenticated = false
  try {
    window.localStorage.removeItem(ADMIN_KEY)
  } catch {
    /* ignore */
  }
  emit()
}

export function isAdminAuthenticated() {
  return authenticated
}

export function useAdminAuth() {
  return useSyncExternalStore(subscribe, () => authenticated)
}