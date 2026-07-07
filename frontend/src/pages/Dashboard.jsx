import { useState } from 'react';
import PremiumCard from '../components/PremiumCard';
import ProgressBar from '../components/ProgressBar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, ShieldCheck, ShieldAlert, Activity } from 'lucide-react';
import clsx from 'clsx';

const API_URL = 'http://localhost:8000'; // Hardcoded for dev, should be env var

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    rating: 1.0,
    reviewUsefulCount: 0.0,
    friendCount: 0.0,
    reviewCount: 1.0,
    firstCount: 0.0,
    usefulCount: 0.0,
    complimentCount: 0.0,
    tipCount: 0.0,
    restaurantRating: 4.0,
    ReviewLength: 120.0,
    review_year: 2024.0,
    sentiment_score: 0.8,
    reviewer_sentiment_var: 0.1,
    lexical_diversity_ttr: 0.7,
    capitalization_ratio: 0.05,
    location_entropy: 0.5,
    days_active: 5.0,
    review_velocity: 0.5,
    restaurant_rating_var: 0.2,
    avg_word_length: 4.5,
    has_friends: 0.0,
    has_useful_votes: 0.0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Prediction failed", error);
      alert("Failed to connect to the prediction API.");
    } finally {
      setLoading(false);
    }
  };

  const InputGroup = ({ label, children }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );

  const InputField = ({ name, label, step = "0.01" }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        step={step}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orangeFarm-500/20 focus:border-orangeFarm-500 transition-colors shadow-sm"
      />
    </div>
  );

  return (
    <div className="pb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Review Inspector</h1>
        <p className="text-gray-500 mt-1">Analyze product reviews for fraudulent patterns using AI.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Input Form */}
        <div className="lg:col-span-8">
          <PremiumCard>
            <form onSubmit={handleSubmit}>
              <InputGroup label="Review Details">
                <InputField name="rating" label="Review Rating (1-5)" step="1" />
                <InputField name="ReviewLength" label="Review Length (chars)" step="1" />
                <InputField name="review_year" label="Review Year" step="1" />
                <InputField name="restaurantRating" label="Product/Restaurant Rating" />
              </InputGroup>

              <InputGroup label="Text Characteristics">
                <InputField name="sentiment_score" label="Sentiment Score" />
                <InputField name="lexical_diversity_ttr" label="Lexical Diversity" />
                <InputField name="capitalization_ratio" label="Capitalization Ratio" />
                <InputField name="avg_word_length" label="Avg Word Length" />
              </InputGroup>

              <InputGroup label="Reviewer Behavior">
                <InputField name="reviewCount" label="Total Reviews" step="1" />
                <InputField name="review_velocity" label="Review Velocity" />
                <InputField name="days_active" label="Days Active" step="1" />
                <InputField name="reviewer_sentiment_var" label="Sentiment Variance" />
                <InputField name="restaurant_rating_var" label="Rating Variance" />
                <InputField name="location_entropy" label="Location Entropy" />
                <InputField name="firstCount" label="First Reviews Count" step="1" />
              </InputGroup>
              
              <InputGroup label="Engagement & Social">
                <InputField name="reviewUsefulCount" label="Useful Votes on Review" step="1" />
                <InputField name="usefulCount" label="Total Useful Votes" step="1" />
                <InputField name="friendCount" label="Friend Count" step="1" />
                <InputField name="complimentCount" label="Compliments" step="1" />
                <InputField name="tipCount" label="Tips Count" step="1" />
                <InputField name="has_friends" label="Has Friends (0/1)" step="1" />
                <InputField name="has_useful_votes" label="Has Useful Votes (0/1)" step="1" />
              </InputGroup>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                  {loading ? 'Analyzing...' : 'Run Analysis'}
                </button>
              </div>
            </form>
          </PremiumCard>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-4 space-y-6">
          
          <PremiumCard title="Prediction Result" className={clsx(
            "transition-all duration-500",
            result ? (result.prediction === 1 ? "ring-2 ring-red-500/20 bg-red-50/30" : "ring-2 ring-green-500/20 bg-green-50/30") : ""
          )}>
            {!result ? (
              <div className="h-40 flex items-center justify-center text-gray-400 text-sm flex-col gap-3">
                 <Activity className="w-8 h-8 opacity-20" />
                 Waiting for input...
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                {result.prediction === 1 ? (
                  <>
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <ShieldAlert className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Suspicious</h2>
                    <p className="text-sm font-medium text-red-600 mt-1">High probability of fraud</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Genuine</h2>
                    <p className="text-sm font-medium text-green-600 mt-1">Review appears authentic</p>
                  </>
                )}
                
                <div className="w-full mt-8 space-y-5">
                   <ProgressBar 
                     label="Fraud Probability" 
                     percentage={result.fraud_probability} 
                     colorClass="bg-red-500" 
                   />
                   <ProgressBar 
                     label="Genuine Probability" 
                     percentage={result.genuine_probability} 
                     colorClass="bg-green-500" 
                   />
                </div>
              </div>
            )}
          </PremiumCard>

          {result && result.feature_importance && (
            <PremiumCard title="SHAP Explainability" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                This chart shows which features pushed the model's prediction towards Fraud (positive values) or Genuine (negative values).
              </p>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={result.feature_importance.slice(0, 8)} // Top 8 features
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 40, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="feature" 
                      type="category" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      width={100}
                    />
                    <Tooltip 
                      cursor={{fill: 'rgba(0,0,0,0.02)'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)'}}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                      {
                        result.feature_importance.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#22c55e'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </PremiumCard>
          )}

        </div>
      </div>
    </div>
  );
}
