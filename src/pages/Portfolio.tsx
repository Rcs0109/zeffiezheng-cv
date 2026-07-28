import { useState, useMemo } from 'react'
import ContentCard from '../components/ContentCard'
import experiences from '../data/experiences.json'
import projects from '../data/projects.json'
import { isVisible } from '../data/utils'

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'internship', label: '实习经历' },
  { key: 'campus', label: '校园经历' },
  { key: 'project', label: '项目作品' },
  { key: 'assignment', label: '课程作业' },
]

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('all')

  const allItems = useMemo(() => {
    const expItems = experiences
      .filter((e) => isVisible(e))
      .map((e) => ({ ...e, category: e.type }))
    const projItems = projects
      .filter((p) => isVisible(p))
      .map((p) => ({ ...p, category: p.type }))
    return [...expItems, ...projItems].sort((a, b) => {
      // Sort by date descending (latest first)
      return b.date.localeCompare(a.date)
    })
  }, [])

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return allItems
    return allItems.filter((item) => {
      if (activeTab === 'internship' || activeTab === 'campus') {
        return item.type === activeTab
      }
      if (activeTab === 'project' || activeTab === 'assignment') {
        return item.type === activeTab
      }
      return true
    })
  }, [activeTab, allItems])

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <p className="text-sm text-zeffie-muted uppercase tracking-widest mb-2">作品集</p>
          <h1 className="text-3xl md:text-4xl font-bold text-zeffie-black">我的经历与作品</h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-zeffie-black text-white'
                  : 'text-zeffie-gray hover:text-zeffie-black hover:bg-zeffie-light'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                date={item.date}
                role={item.role}
                description={item.description}
                tags={item.tags}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zeffie-muted text-sm">暂无可见内容</p>
          </div>
        )}
      </div>
    </main>
  )
}
