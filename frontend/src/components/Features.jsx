import { Brain, Users, ShoppingBag } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: Brain,
            title: 'AI-Powered Student Support',
            description: 'Get intelligent assistance and personalized learning recommendations powered by advanced AI technology.',
        },
        {
            icon: Users,
            title: 'Smart Peer Learning & Kuppi Management',
            description: 'Collaborate effectively with organized study groups and peer-to-peer learning sessions.',
        },
        {
            icon: ShoppingBag,
            title: 'Student Marketplace & Collaboration',
            description: 'Exchange resources, share knowledge, and build meaningful academic partnerships.',
        },
    ];

    return (
        <section id="features" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Why EduSphere?</span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Experience a comprehensive platform designed specifically for modern university students
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg card-hover border border-gray-100"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl mb-6">
                                <feature.icon className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
