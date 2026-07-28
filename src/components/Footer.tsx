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
              <li><Link to="/diary" className="hover:text-white transition-colors">碎碎念</Link></li>
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
                    email {profile.email}
                  </a>
                </li>
              )}
              {profile.social?.wechat && (
                <li className="flex items-center gap-2">
                  <span className="text-gray-500">Wechat</span>
                  <span>{profile.social.wechat}</span>
                </li>
              )}
              {profile.social?.phone_cn && (
                <li>
                  <a href={`tel:${profile.social.phone_cn}`} className="hover:text-white transition-colors">
                    tel {profile.social.phone_cn}
                  </a>
                </li>
              )}
              {profile.social?.phone_hk && (
                <li>
                  <a href={`tel:${profile.social.phone_hk}`} className="hover:text-white transition-colors">
                    tel {profile.social.phone_hk}
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
