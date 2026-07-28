import { useState, useMemo } from 'react'
import diary from '../data/diary.json'
import { isVisible } from '../data/utils'

export default function Diary() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const visibleEntries = useMemo(() => {
    return diary
      .filter((entry) => isVisible(entry))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(visibleEntries.map((e) => e.category).filter(Boolean))
    return ['全部', ...cats]
  }, [visibleEntries])

  const [activeCategory, setActiveCategory] = useState('全部')

  const filteredEntries = useMemo(() => {
    if (activeCategory === '全部') return visibleEntries
    return visibleEntries.filter((e) => e.category === activeCategory)
  }, [activeCategory, visibleEntries])

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <p className="text-sm text-zeffie-muted uppercase tracking-widest mb-2">日记</p>
          <h1 className="text-3xl md:text-4xl font-bold text-zeffie-black">产品思考与日常</h1>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-zeffie-black text-white'
                    : 'text-zeffie-gray hover:text-zeffie-black hover:bg-zeffie-light'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Diary Entries */}
        {filteredEntries.length > 0 ? (
          <div className="space-y-6">
            {filteredEntries.map((entry) => (
              <article key={entry.id} className="border-b border-gray-100 pb-6">
                <button
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  className="w-full text-left group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-lg font-semibold text-zeffie-black group-hover:text-gray-600 transition-colors">
                        {entry.title}
                      </h2>
                      {entry.category && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-zeffie-light text-zeffie-muted">
                          {entry.category}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zeffie-muted whitespace-nowrap ml-4 mt-1">
                      {entry.date}
                    </span>
                  </div>
                  <p className="text-sm text-zeffie-gray">{entry.description}</p>
                </button>
                {expandedId === entry.id && entry.body && (
                  <div className="mt-4 pl-0">
                    <div className="text-sm text-zeffie-gray leading-relaxed whitespace-pre-line bg-zeffie-light/50 p-4 rounded-lg">
                      {entry.body}
                    </div>
                  </div>
                )}
              </article>
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
