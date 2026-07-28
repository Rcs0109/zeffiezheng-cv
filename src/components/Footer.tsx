import { Link } from 'react-router-dom'
import profile from '../data/profile.json'

export default function Footer() {
  return (
    <footer id="footer" className="bg-zeffie-black text-white">
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
              <li><Link to="/" className="hover:text-white transition-colors">首页</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">项目</Link></li>
              <li><Link to="/diary" className="hover:text-white transition-colors">日记</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">
              联系方式
            </h4>
            <ul className="text-sm text-gray-300 space-y-2 font-mono">
              {profile.email && (
                <li className="grid grid-cols-[5rem_1fr] items-baseline">
                  <span className="text-gray-500 text-xs uppercase tracking-wider text-right pr-3">email</span>
                  <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile.social?.wechat && (
                <li className="grid grid-cols-[5rem_1fr] items-baseline">
                  <span className="text-gray-500 text-xs uppercase tracking-wider text-right pr-3">wechat</span>
                  <span className="hover:text-white transition-colors cursor-pointer" title="点击复制">
                    {profile.social.wechat}
                  </span>
                </li>
              )}
              {profile.social?.phone_cn && (
                <li className="grid grid-cols-[5rem_1fr] items-baseline">
                  <span className="text-gray-500 text-xs uppercase tracking-wider text-right pr-3">tel CN</span>
                  <a href={`tel:${profile.social.phone_cn}`} className="hover:text-white transition-colors">
                    {profile.social.phone_cn}
                  </a>
                </li>
              )}
              {profile.social?.phone_hk && (
                <li className="grid grid-cols-[5rem_1fr] items-baseline">
                  <span className="text-gray-500 text-xs uppercase tracking-wider text-right pr-3">tel HK</span>
                  <a href={`tel:${profile.social.phone_hk}`} className="hover:text-white transition-colors">
                    {profile.social.phone_hk}
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
        </div>
      </div>
    </footer>
  )
}
