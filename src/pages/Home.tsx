import { Link } from 'react-router-dom'
import profile from '../data/profile.json'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-zeffie-muted uppercase tracking-widest mb-4">
            {profile.shortBio}
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zeffie-black mb-6 leading-tight">
            {profile.name}
          </h1>
          <p className="text-lg text-zeffie-gray max-w-xl leading-relaxed mb-8">
            {profile.bio}
          </p>

          {/* Quote */}
          <blockquote className="border-l-2 border-zeffie-black pl-4 mb-10">
            <p className="text-sm italic text-zeffie-gray">{profile.quote}</p>
            {profile.quoteSource && (
              <cite className="text-xs text-zeffie-muted not-italic mt-1 block">—— {profile.quoteSource}</cite>
            )}
          </blockquote>

          {/* CTA */}
          <div className="flex gap-4">
            <Link
              to="/portfolio"
              className="inline-flex items-center px-5 py-2.5 bg-zeffie-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              查看作品集
            </Link>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-zeffie-black text-sm font-medium rounded-lg hover:border-gray-500 transition-colors"
            >
              联系我
            </a>
          </div>
        </div>
      </section>

      {/* Featured Preview */}
      <section className="py-16 px-6 bg-zeffie-light/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-widest text-zeffie-muted mb-2">
            版本号 v1.0
          </h2>
          <p className="text-sm text-zeffie-gray">
            这个网站本身就是我的产品——迭代中。
          </p>
        </div>
      </section>
    </main>
  )
}
