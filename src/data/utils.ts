const HIDDEN_KEYS_KEY = 'zeffie_hidden_keys'
const ADMIN_TOKEN_KEY = 'zeffie_github_token'

// ────────── localStorage (local preview only) ──────────

export function getHiddenKeys(): Set<string> {
  try {
    const stored = localStorage.getItem(HIDDEN_KEYS_KEY)
    if (stored) return new Set(JSON.parse(stored))
  } catch {}
  return new Set()
}

export function setHiddenKeys(keys: Set<string>) {
  localStorage.setItem(HIDDEN_KEYS_KEY, JSON.stringify([...keys]))
}

export function toggleVisibility(itemId: string): boolean {
  const hiddenKeys = getHiddenKeys()
  if (hiddenKeys.has(itemId)) {
    hiddenKeys.delete(itemId)
    setHiddenKeys(hiddenKeys)
    return true
  } else {
    hiddenKeys.add(itemId)
    setHiddenKeys(hiddenKeys)
    return false
  }
}

export function getVisibilityStatus(itemId: string): boolean {
  return !getHiddenKeys().has(itemId)
}

// ────────── URL parameter override ──────────

export function getUrlHiddenIds(): Set<string> {
  const params = new URLSearchParams(window.location.search)
  const hideParam = params.get('hide')
  if (hideParam) {
    return new Set(hideParam.split(',').map((s) => s.trim()).filter(Boolean))
  }
  return new Set()
}

export function isItemGloballyVisible(item: { id: string; hidden?: boolean }): boolean {
  // Check JSON default first
  if (item.hidden) return false
  return true
}

export function isItemVisibleToVisitor(item: { id: string; hidden?: boolean }): boolean {
  // Priority 1: URL parameter override (?hide=...)
  const urlHiddenIds = getUrlHiddenIds()
  if (urlHiddenIds.has(item.id)) return false

  // Priority 2: localStorage override (set from admin panel)
  const hiddenKeys = getHiddenKeys()
  if (hiddenKeys.has(item.id)) return false

  // Priority 3: JSON default
  if (item.hidden) return false

  return true
}

// ────────── GitHub token (for publish) ──────────

export function getGithubToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setGithubToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

// ────────── GitHub API: publish visibility changes ──────────

const GITHUB_OWNER = 'Rcs0109'
const GITHUB_REPO = 'zeffiezheng-cv'

type VisibilityMap = Record<string, boolean> // itemId → visible?

export async function publishToGithub(
  visibilityMap: VisibilityMap,
  token: string,
  onProgress?: (msg: string) => void
): Promise<string> {
  const log = (msg: string) => { onProgress?.(msg); console.log(msg) }

  // 1. Build updated JSON for each file
  const fileUpdates: Record<string, any[]> = {
    'src/data/experiences.json': [],
    'src/data/projects.json': [],
    'src/data/diary.json': [],
  }

  // Load current files
  const { default: experiences } = await import('./experiences.json')
  const { default: projects } = await import('./projects.json')
  const { default: diary } = await import('./diary.json')

  // Merge visibility state
  function mergeVisibility(items: any[]) {
    return items.map((item: any) => {
      const visible = visibilityMap[item.id]
      if (visible !== undefined) {
        return { ...item, hidden: !visible }
      }
      return item
    })
  }

  fileUpdates['src/data/experiences.json'] = mergeVisibility(experiences)
  fileUpdates['src/data/projects.json'] = mergeVisibility(projects)
  fileUpdates['src/data/diary.json'] = mergeVisibility(diary)

  // 2. Get latest commit SHA
  log('正在获取最新提交...')
  const shaRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/main`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
  if (!shaRes.ok) throw new Error('GitHub 认证失败，请检查 Token')
  const shaData = await shaRes.json()
  const latestSha = shaData.object.sha
  log('✓ 已获取最新提交')

  // 3. Get base tree
  const treeRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${latestSha}`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
  })
  const treeData = await treeRes.json()
  const baseTreeSha = treeData.tree.sha

  // 4. Create blobs
  const blobs = []
  for (const [filePath, items] of Object.entries(fileUpdates)) {
    if (items.length === 0) continue
    log(`正在更新 ${filePath}...`)
    const content = JSON.stringify(items, null, 2) + '\n'
    const blobRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs`, {
      method: 'POST',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, encoding: 'utf-8' }),
    })
    const blobData = await blobRes.json()
    blobs.push({ path: filePath, mode: '100644', type: 'blob', sha: blobData.sha })
  }

  // 5. Create new tree
  log('正在创建新提交树...')
  const newTreeRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees`, {
    method: 'POST',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ base_tree: baseTreeSha, tree: blobs }),
  })
  const newTreeData = await newTreeRes.json()
  const newTreeSha = newTreeData.sha

  // 6. Create commit
  log('正在创建提交...')
  const commitRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`, {
    method: 'POST',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'chore: update content visibility settings',
      tree: newTreeSha,
      parents: [latestSha],
    }),
  })
  const commitData = await commitRes.json()
  const newCommitSha = commitData.sha

  // 7. Update branch
  log('正在推送到 main 分支...')
  const updateRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/main`, {
    method: 'PATCH',
    headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sha: newCommitSha, force: false }),
  })
  if (!updateRes.ok) throw new Error('推送失败')
  log('✅ 发布成功！网站将在 1-2 分钟后自动更新。')

  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commit/${newCommitSha}`
}
