import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, FileText, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleModuleClick = (moduleTitle) => {
    if (moduleTitle === "Learning Trajectory Graph") {
      navigate('/student/learning-trajectory');
    } else {
      // Handle other modules as needed
      console.log(`Navigate to ${moduleTitle}`);
    }
  };

  const modules = [
    {
      icon: TrendingUp,
      tag: "Subjects Tracked",
      tagColor: "bg-purple-100 text-purple-700",
      title: "Learning Trajectory Graph",
      description: "Visualize your academic progress over time with detailed analytics and insights",
      features: [
        "Track performance trends across subjects",
        "Identify strengths and weaknesses", 
        "Monitor streaks and consistency",
        "Get personalized recommendations"
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      buttonText: "Explore Learning Trajectory Graph"
    },
    {
      icon: BarChart3,
      tag: "Improvement Insights",
      tagColor: "bg-green-100 text-green-700",
      title: "Smart Comparison",
      description: "Compare your progress with your past self and current growth rate in a healthy way",
      features: [
        "Compare with past performance",
        "Analyze growth rate trends",
        "Identify improvement areas",
        "Set realistic goals"
      ],
      buttonColor: "bg-green-600 hover:bg-green-700",
      buttonText: "Explore Smart Comparison"
    },
    {
      icon: FileText,
      tag: "Avg. Time Saved",
      tagColor: "bg-purple-100 text-purple-700",
      title: "Assignment Submission",
      description: "Get AI-powered predictions and feedback on your assignments before submission",
      features: [
        "Pre-submission grade prediction",
        "Weak area identification",
        "Rubric compliance check",
        "Instant feedback"
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      buttonText: "Explore Assignment Submission"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Student Progress Management System
        </h1>
        <p className="text-xl text-gray-600 font-medium">
          Track. Compare. Improve.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-8">
                  {/* Icon Section */}
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-xl mb-6">
                    <Icon className="w-8 h-8 text-gray-700" />
                  </div>

                  {/* Tag */}
                  <div className="inline-block">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${module.tagColor} mb-4`}>
                      {module.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {module.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {module.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button 
                    onClick={() => handleModuleClick(module.title)}
                    className={`w-full py-3 px-6 rounded-lg text-white font-medium ${module.buttonColor} transition-colors duration-200 flex items-center justify-center group`}
                  >
                    {module.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
