import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import experiences from '../data/experiences.json'
import projects from '../data/projects.json'
import diary from '../data/diary.json'
import { getVisibilityStatus, toggleVisibility, getHiddenKeys } from '../data/utils'

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zeffie-black">内容管理</h1>
            <p className="text-sm text-zeffie-muted mt-1">
              当前已隐藏 {hiddenCount} 项内容
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="px-4 py-2 text-sm text-zeffie-gray hover:text-zeffie-black border border-gray-300 rounded-lg transition-colors"
            >
              查看首页
            </Link>
          </div>
        </div>

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
      </div>
    </main>
  )
}
