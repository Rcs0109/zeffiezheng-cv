import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import experiences from '../data/experiences.json'
import projects from '../data/projects.json'
import diary from '../data/diary.json'
import { getVisibilityStatus, toggleVisibility, getHiddenKeys, publishToGithub, getGithubToken, setGithubToken } from '../data/utils'

type ContentItem = {
  id: string
  title: string
  type?: string
  date: string
  section: string
  hidden?: boolean
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const [items, setItems] = useState<ContentItem[]>([])
  const [, forceUpdate] = useState(0)

  // Publish state
  const [showPublish, setShowPublish] = useState(false)
  const [ghToken, setGhToken] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [publishLog, setPublishLog] = useState<string[]>([])
  const [publishDone, setPublishDone] = useState(false)

  const refresh = useCallback(() => {
    const allItems: ContentItem[] = [
      ...experiences.map((e) => ({ ...e, section: '经历' })),
      ...projects.map((p) => ({ ...p, section: '项目' })),
      ...diary.map((d) => ({ ...d, section: '日记' })),
    ]
    setItems(allItems)
    forceUpdate((v) => v + 1)
  }, [])

  useEffect(() => {
    const authed = localStorage.getItem('zeffie_admin_auth')
    if (authed === 'true') {
      setIsAuthed(true)
      refresh()
    }
    // Restore saved token
    const saved = getGithubToken()
    if (saved) setGhToken(saved)
  }, [refresh])

  const handleLogin = () => {
    if (password === 'zeffie2024') {
      setIsAuthed(true)
      localStorage.setItem('zeffie_admin_auth', 'true')
      refresh()
    } else {
      alert('密码错误')
    }
  }

  const handleToggle = (itemId: string) => {
    toggleVisibility(itemId)
    refresh()
  }

  const hiddenCount = getHiddenKeys().size

  const handlePublish = async () => {
    if (!ghToken) {
      alert('请先输入 GitHub Token')
      return
    }
    setGithubToken(ghToken)
    setPublishing(true)
    setPublishLog([])
    setPublishDone(false)

    // Build visibility map from localStorage
    const hiddenKeys = getHiddenKeys()
    const visibilityMap: Record<string, boolean> = {}
    for (const item of items) {
      visibilityMap[item.id] = !hiddenKeys.has(item.id)
    }

    try {
      const commitUrl = await publishToGithub(visibilityMap, ghToken, (msg) => {
        setPublishLog((prev) => [...prev, msg])
      })
      setPublishLog((prev) => [...prev, `🔗 ${commitUrl}`])
      setPublishDone(true)
    } catch (err: any) {
      setPublishLog((prev) => [...prev, `❌ 错误: ${err.message}`])
    } finally {
      setPublishing(false)
    }
  }

  // Build share URL from current hidden state
  const shareUrl = (() => {
    const hiddenKeys = getHiddenKeys()
    if (hiddenKeys.size === 0) return ''
    const ids = [...hiddenKeys].join(',')
    return `${window.location.origin}/zeffiezheng-cv/?hide=${ids}`
  })()

  if (!isAuthed) {
    return (
      <main className="min-h-screen pt-32 pb-16 px-6">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-zeffie-black mb-6">管理面板</h1>
          <input
            type="password"
            placeholder="输入管理员密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-zeffie-black mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2.5 bg-zeffie-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            登录
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zeffie-black">内容管理</h1>
            <p className="text-sm text-zeffie-muted mt-1">
              当前已隐藏 {hiddenCount} 项内容
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPublish(!showPublish)}
              className="px-4 py-2 text-sm bg-zeffie-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {showPublish ? '返回管理' : '📤 发布到线上'}
            </button>
            <Link
              to="/"
              className="px-4 py-2 text-sm text-zeffie-gray hover:text-zeffie-black border border-gray-300 rounded-lg transition-colors"
            >
              查看首页
            </Link>
          </div>
        </div>

        {/* Publish Section */}
        {showPublish ? (
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-zeffie-black mb-4">📤 发布到线上网站</h2>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
              <p className="font-medium mb-1">⚠️ 发布说明</p>
              <p>当前可见性设置仅保存在本浏览器中。点击发布后，将直接修改 GitHub 仓库中的 JSON 文件并自动部署。</p>
              <p className="mt-1">部署后约 1-2 分钟，线上网站更新生效。</p>
            </div>

            {/* Token input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zeffie-black mb-1">GitHub Token</label>
              <input
                type="password"
                placeholder="输入 GitHub Personal Access Token"
                value={ghToken}
                onChange={(e) => setGhToken(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-zeffie-black"
              />
              <p className="text-xs text-zeffie-muted mt-1">Token 保存在本浏览器中，不会上传到其他服务</p>
            </div>

            {/* Changes preview */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-zeffie-black mb-2">即将发布的更改：</h3>
              <div className="text-sm text-zeffie-gray bg-zeffie-light/50 rounded-lg p-3">
                {items.filter((i) => !getVisibilityStatus(i.id)).length > 0 ? (
                  <ul className="space-y-1">
                    {items.filter((i) => !getVisibilityStatus(i.id)).map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <span className="text-red-500">🔴 隐藏</span>
                        <span>{item.title}</span>
                        <span className="text-zeffie-muted">({item.section})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>所有内容均为可见状态，无需发布。</p>
                )}
              </div>
            </div>

            {/* Publish button */}
            <button
              onClick={handlePublish}
              disabled={publishing || !ghToken}
              className="w-full px-4 py-3 bg-zeffie-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {publishing ? '发布中...' : '🚀 一键发布到 GitHub'}
            </button>

            {/* Publish logs */}
            {publishLog.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-zeffie-gray space-y-1 max-h-40 overflow-y-auto">
                {publishLog.map((log, i) => (
                  <p key={i}>{log}</p>
                ))}
              </div>
            )}

            {publishDone && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium">✅ 发布成功！</p>
                <p className="text-xs text-green-700 mt-1">线上网站将在 1-2 分钟后更新。刷新页面即可看到效果。</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Share URL hint */}
            {shareUrl && (
              <div className="bg-zeffie-light/50 border border-gray-200 rounded-lg p-3 mb-6">
                <p className="text-xs text-zeffie-muted mb-1">💡 临时分享链接（无需发布即可使用）：</p>
                <code className="text-xs text-zeffie-black break-all">{shareUrl}</code>
              </div>
            )}

            {/* Section: Experiences */}
            <section className="mb-10">
              <h2 className="text-sm font-medium uppercase tracking-widest text-zeffie-muted mb-4">经历</h2>
              <div className="space-y-2">
                {items.filter((i) => i.section === '经历').map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium text-zeffie-black truncate">{item.title}</p>
                      <p className="text-xs text-zeffie-muted">{item.date}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getVisibilityStatus(item.id)}
                        onChange={() => handleToggle(item.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zeffie-black" />
                      <span className="ml-3 text-xs text-zeffie-muted min-w-[3em]">
                        {getVisibilityStatus(item.id) ? '可见' : '隐藏'}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Projects */}
            <section className="mb-10">
              <h2 className="text-sm font-medium uppercase tracking-widest text-zeffie-muted mb-4">项目</h2>
              <div className="space-y-2">
                {items.filter((i) => i.section === '项目').map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium text-zeffie-black truncate">{item.title}</p>
                      <p className="text-xs text-zeffie-muted">{item.date}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getVisibilityStatus(item.id)}
                        onChange={() => handleToggle(item.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zeffie-black" />
                      <span className="ml-3 text-xs text-zeffie-muted min-w-[3em]">
                        {getVisibilityStatus(item.id) ? '可见' : '隐藏'}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Diary */}
            <section className="mb-10">
              <h2 className="text-sm font-medium uppercase tracking-widest text-zeffie-muted mb-4">日记</h2>
              <div className="space-y-2">
                {items.filter((i) => i.section === '日记').map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium text-zeffie-black truncate">{item.title}</p>
                      <p className="text-xs text-zeffie-muted">{item.date}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={getVisibilityStatus(item.id)}
                        onChange={() => handleToggle(item.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zeffie-black" />
                      <span className="ml-3 text-xs text-zeffie-muted min-w-[3em]">
                        {getVisibilityStatus(item.id) ? '可见' : '隐藏'}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
