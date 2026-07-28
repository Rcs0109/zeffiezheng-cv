const HIDDEN_KEYS_KEY = 'zeffie_hidden_keys'

export function getHiddenKeys(): Set<string> {
  try {
    const stored = localStorage.getItem(HIDDEN_KEYS_KEY)
    if (stored) {
      return new Set(JSON.parse(stored))
    }
  } catch {}
  return new Set()
}

export function setHiddenKeys(keys: Set<string>) {
  localStorage.setItem(HIDDEN_KEYS_KEY, JSON.stringify([...keys]))
}

export function isVisible(item: { id: string; hidden?: boolean }): boolean {
  const hiddenKeys = getHiddenKeys()
  // If it's manually hidden in admin panel, hide it
  if (hiddenKeys.has(item.id)) return false
  // If the item's default is hidden, hide it
  if (item.hidden) return false
  return true
}

export function toggleVisibility(itemId: string): boolean {
  const hiddenKeys = getHiddenKeys()
  if (hiddenKeys.has(itemId)) {
    hiddenKeys.delete(itemId)
    setHiddenKeys(hiddenKeys)
    return true // now visible
  } else {
    hiddenKeys.add(itemId)
    setHiddenKeys(hiddenKeys)
    return false // now hidden
  }
}

export function getVisibilityStatus(itemId: string): boolean {
  return !getHiddenKeys().has(itemId)
}
