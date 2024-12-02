import { motion } from "framer-motion";
import { TrendingUp, Shield, Brain, ChevronDown, Star } from "lucide-react";
import { ConnectKitButton } from "connectkit";

export function LandingPage() {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "AI-Powered Strategy",
      description:
        "Automatically identifies and secures positions in high-potential tokens based on real-time market analysis.",
      gradient: "from-blue-600/10 to-blue-400/5",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
      title: "Smart Position Sizing",
      description:
        "Dynamically adjusts position sizes based on market conditions and whale wallet movements.",
      gradient: "from-purple-600/10 to-purple-400/5",
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-400" />,
      title: "Risk Management",
      description:
        "Maintains optimal exposure while protecting your downside through intelligent portfolio balancing.",
      gradient: "from-indigo-600/10 to-indigo-400/5",
    },
  ];

  const insights = [
    {
      value: "87%",
      label: "Average Win Rate",
      description: "Of moonbags tracked show positive returns",
    },
    {
      value: "5.2x",
      label: "Average Return",
      description: "Multiplier on successful positions",
    },
    {
      value: "24/7",
      label: "Market Coverage",
      description: "Continuous monitoring and execution",
    },
  ];

  const experiences = [
    {
      quote:
        "The AI's ability to spot emerging trends before they go viral is incredible. It's like having a seasoned trader working for you 24/7.",
      author: "Alex K.",
      role: "Full-time Trader",
    },
    {
      quote:
        "Finally found a way to stay in promising projects long-term without constantly watching charts. Game-changer for my trading psychology.",
      author: "Sarah M.",
      role: "DeFi Investor",
    },
    {
      quote:
        "Set it up once, and it handles everything. My portfolio has grown steadily since I started using the moonbag strategy.",
      author: "Mike R.",
      role: "Crypto Enthusiast",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl px-4 sm:px-6 lg:px-8"
      >
        {/* Hero Section */}
        <div className="relative mb-16">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
          />
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Trade Smarter,
            <br />
            Hold Stronger
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let AI secure your upside potential while you focus on finding the
            next big opportunity.
          </p>
          <ConnectKitButton.Custom>
            {({ show }) => (
              <motion.button
                onClick={show}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                Start Your Journey
              </motion.button>
            )}
          </ConnectKitButton.Custom>
        </div>

        {/* Insights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {insights.map((insight, index) => (
            <div
              key={index}
              className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl"
            >
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {insight.value}
              </h3>
              <p className="font-medium text-gray-200 mb-2">{insight.label}</p>
              <p className="text-sm text-gray-400">{insight.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 rounded-xl bg-gradient-to-b ${feature.gradient} border border-gray-800 hover:border-gray-700 transition-colors`}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16 bg-gray-800/30 backdrop-blur-sm rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                step: "01",
                title: "Connect",
                description:
                  "Link your wallet and set your preferences for automated moonbag creation.",
              },
              {
                step: "02",
                title: "Trade",
                description:
                  "Continue trading as usual. Our AI monitors your transactions in real-time.",
              },
              {
                step: "03",
                title: "Grow",
                description:
                  "The system automatically maintains strategic positions in promising tokens.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-5xl font-bold text-gray-700/30 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Trader Experiences</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/30 p-6 rounded-xl backdrop-blur-sm text-left"
              >
                <Star className="w-6 h-6 text-yellow-400 mb-4" />
                <p className="text-gray-300 mb-4">{exp.quote}</p>
                <div>
                  <p className="font-medium">{exp.author}</p>
                  <p className="text-sm text-gray-400">{exp.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative p-8 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl blur-xl" />
          <h2 className="text-3xl font-bold mb-4 relative z-10">
            Ready to Evolve Your Trading?
          </h2>
          <p className="text-gray-400 mb-6 relative z-10">
            Join traders who've transformed their strategy with AI-powered
            moonbag automation.
          </p>
          <ConnectKitButton.Custom>
            {({ show }) => (
              <motion.button
                onClick={show}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 relative z-10"
              >
                Get Started Now
              </motion.button>
            )}
          </ConnectKitButton.Custom>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-12 text-gray-400"
        >
          <ChevronDown className="w-6 h-6 mx-auto" />
        </motion.div>
      </motion.div>
    </div>
  );
}
