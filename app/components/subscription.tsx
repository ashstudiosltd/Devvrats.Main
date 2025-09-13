import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Feature {
  icon: string;
  text: string;
}

interface Tier {
  id: string;
  name: string;
  priceINR: number;
  priceUSD: number;
  features: Feature[];
  badge?: string;
  accentColor: string;
  popular?: boolean;
}

interface Country {
  code: string;
  name: string;
  currency: 'INR' | 'USD';
}

// Sample data
const tiers: Tier[] = [
  {
    id: 'white',
    name: 'White Belt',
    priceINR: 0,
    priceUSD: 0,
    features: [
      { icon: '🥋', text: 'Limited daily challenges (1-2/day)' },
      { icon: '💡', text: 'Basic feedback (rule-based hints)' },
      { icon: '🚫', text: 'No AI coaching' }
    ],
    accentColor: 'border-gray-300'
  },
  {
    id: 'blue',
    name: 'Blue Belt',
    priceINR: 299,
    priceUSD: 5,
    features: [
      { icon: '🏠', text: 'Access to 1 Dojo/Day' },
      { icon: '⚡', text: 'Unlimited daily challenges' },
      { icon: '📈', text: 'Beginner + intermediate levels' }
    ],
    accentColor: 'border-blue-500'
  },
  {
    id: 'black',
    name: 'Black Belt',
    priceINR: 699,
    priceUSD: 15,
    features: [
      { icon: '✅', text: 'Everything in Blue Belt' },
      { icon: '🎓', text: 'Advanced & expert challenges' },
      { icon: '🗺️', text: 'Full Dojo training path (personalized roadmaps)' },
    ],
    badge: 'Most Popular',
    accentColor: 'border-black',
    popular: true
  },
  {
    id: 'sensei',
    name: 'Sensei Circle',
    priceINR: 1199,
    priceUSD: 25,
    features: [
      { icon: '✅', text: 'Everything in Black Belt' },
      { icon: '👥', text: '1:1 mentorship sessions' },
      { icon: '🔒', text: 'Access to private dojo challenges' },
    ],
    accentColor: 'border-purple-500'
  }
];

const countries: Country[] = [
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'US', name: 'Others', currency: 'USD' },
];

// Helper functions
const formatPrice = (price: number, currency: 'INR' | 'USD'): string => {
  if (price === 0) return 'Free';
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${price}`;
};

const mapCountryToCurrency = (countryCode: string): 'INR' | 'USD' => {
  return countryCode === 'IN' ? 'INR' : 'USD';
};

const DojoSubscriptionCards: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleExpanded = (tierId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(tierId)) {
      newExpanded.delete(tierId);
    } else {
      newExpanded.add(tierId);
    }
    setExpandedCards(newExpanded);
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) setSelectedCountry(country);
  };

  const getPrice = (tier: Tier): number => {
    return selectedCountry.currency === 'INR' ? tier.priceINR : tier.priceUSD;
  };

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-800/10 backdrop-blur-xl rounded-2xl border border-gray-700/50">
      {/* Header with country selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Dojo Path</h1>
          <p className="text-lg text-gray-400">Level up your coding skills with our martial arts-inspired training</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <label htmlFor="country-select" className="block text-sm font-medium text-gray-300 mb-1">
            Country
          </label>
          <select
            id="country-select"
            value={selectedCountry.code}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="px-4 py-2 border border-gray-600 bg-transparent text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subscription cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {tiers.map((tier, index) => {
          const isExpanded = expandedCards.has(tier.id);

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative rounded-2xl shadow-lg border-2 ${tier.accentColor} overflow-hidden ${
                tier.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              {/* Popular badge */}
              {tier.badge && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {tier.badge}
                </div>
              )}

              <div className="p-6">
                {/* Tier name */}
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>

                {/* Price */}
                <motion.div
                  key={`${tier.id}-${selectedCountry.currency}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <div className="text-4xl font-bold text-white mb-1">
                    {formatPrice(getPrice(tier), selectedCountry.currency)}
                  </div>
                  {tier.priceINR > 0 && (
                    <div className="text-sm text-white">
                      Billed monthly. Taxes may apply.
                    </div>
                  )}
                </motion.div>

                {/* Features with smooth expand */}
                <motion.div
                  animate={{ height: isExpanded ? "auto" : 140, opacity: 1 }}
                  initial={false}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden space-y-3 mb-4"
                >
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">{feature.icon}</span>
                      <span className="text-sm text-white">{feature.text}</span>
                    </div>
                  ))}
                </motion.div>


                {/* CTA button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTierSelect(tier.id)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    tier.id === 'white'
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : tier.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {tier.id === 'white' ? 'Register' : 'Register'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DojoSubscriptionCards;