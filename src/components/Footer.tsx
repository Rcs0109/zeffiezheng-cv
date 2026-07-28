import profile from '../data/profile.json'

export default function Footer() {
  return (
    <footer className="bg-zeffie-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Tagline */}
          <div>
            <h3 className="text-lg font-bold mb-2">Zeffie Zheng</h3>
            <p className="text-sm text-gray-400">{profile.title}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">
              快速链接
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">首页</a></li>
              <li><a href="/portfolio" className="hover:text-white transition-colors">作品集</a></li>
              <li><a href="/diary" className="hover:text-white transition-colors">日记</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">
              联系我
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {profile.email && (
                <li>
                  <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile.github && (
                <li>
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Zeffie Zheng. Built with product thinking.
          </p>
          <p className="text-xs text-gray-500 italic">
            {profile.quote}
          </p>
        </div>
      </div>
    </footer>
  )
}
