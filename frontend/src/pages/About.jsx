import PremiumCard from '../components/PremiumCard';
import { Github, Mail, Code, Database, BrainCircuit, LayoutTemplate } from 'lucide-react';

export default function About() {
  const techStack = [
    { name: 'Python', icon: Code, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'FastAPI', icon: Database, color: 'text-teal-500', bg: 'bg-teal-50' },
    { name: 'Scikit-Learn', icon: BrainCircuit, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Pandas', icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'SHAP', icon: BrainCircuit, color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'React', icon: LayoutTemplate, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { name: 'Tailwind CSS', icon: LayoutTemplate, color: 'text-sky-500', bg: 'bg-sky-50' },
    { name: 'Vite', icon: Code, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="pb-12 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">About TrueSight</h1>
        <p className="text-gray-500 mt-2">MSoC 2026 Hackathon Submission - Data Science Track</p>
      </header>

      <PremiumCard className="mb-8 p-8 border-t-4 border-t-orangeFarm-500">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Project Description</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
          <p>
            Online marketplaces thrive on buyer reviews, but this trust is constantly eroded by fake review farms. A few thousand dollars spent on fake reviews can translate into hundreds of thousands in additional sales, severely harming consumers and honest sellers alike.
          </p>
          <p>
            <strong>TrueSight</strong> is a robust, multi-faceted fake-review detector that fuses signals across three critical axes: <strong>Review Text</strong>, <strong>Reviewer Behavior</strong>, and <strong>Metadata</strong>. By analyzing metrics such as lexical diversity, review velocity, and location entropy, we prevent modern LLM-generated reviews from slipping through.
          </p>
          <p>
            Furthermore, the platform provides interpretable SHAP signals, empowering marketplace Trust-and-Safety teams to confidently audit and act on predictions without relying on a "black box" model.
          </p>
        </div>
      </PremiumCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <PremiumCard title="Tech Stack">
          <div className="grid grid-cols-2 gap-4 mt-4">
            {techStack.map(tech => (
              <div key={tech.name} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tech.bg}`}>
                  <tech.icon className={`w-5 h-5 ${tech.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{tech.name}</span>
              </div>
            ))}
          </div>
        </PremiumCard>

        <PremiumCard title="Contact & Source">
          <div className="space-y-6 mt-4">
            <a 
              href="https://github.com/Tanish-30-08-2006/Fake-Product-Review-Detection" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group"
            >
              <div className="bg-gray-900 p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                <Github className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">GitHub Repository</p>
                <p className="text-xs text-gray-500 break-all">github.com/Tanish-30-08-2006/Fake-Product-Review-Detection</p>
              </div>
            </a>

            <a 
              href="mailto:tanishsanghavi2@gmail.com"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-orangeFarm-50 transition-colors group"
            >
              <div className="bg-orangeFarm-100 p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-orangeFarm-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Contact Email</p>
                <p className="text-xs text-gray-500">tanishsanghavi2@gmail.com</p>
              </div>
            </a>
          </div>
        </PremiumCard>
      </div>
      
      <footer className="text-center pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} TrueSight. Built for MSoC Hackathon 2026.</p>
      </footer>
    </div>
  );
}
