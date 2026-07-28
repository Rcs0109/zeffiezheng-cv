interface ContentCardProps {
  title: string
  date: string
  role?: string
  description: string
  tags?: string[]
  onClick?: () => void
}

export default function ContentCard({ title, date, role, description, tags, onClick }: ContentCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer p-6 rounded-lg border border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-zeffie-black group-hover:text-gray-600 transition-colors">
          {title}
        </h3>
        <span className="text-xs text-zeffie-muted whitespace-nowrap ml-4 mt-0.5">{date}</span>
      </div>
      {role && (
        <p className="text-xs text-zeffie-muted mb-2">{role}</p>
      )}
      <p className="text-sm text-zeffie-gray leading-relaxed">{description}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-zeffie-light text-zeffie-gray"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
