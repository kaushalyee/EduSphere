import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const CTA = () => {
    return (
        <section id="cta" className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                            <Rocket className="h-10 w-10 text-white" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Join the EduSphere Community
                        </h2>

                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Be part of a transformative academic experience. Connect with peers, access AI-powered support,
                            and unlock your full potential in a collaborative learning environment.
                        </p>

                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-700 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            Get Started
                            <Rocket className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
