import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-md">
                    <Sparkles className="h-4 w-4 text-accent-600" />
                    <span className="text-sm font-medium text-gray-700">Welcome to the Future of Learning</span>
                </div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6">
                    <span className="gradient-text">EduSphere</span>
                </h1>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-8">
                    Smart University Academic Ecosystem
                </h2>

                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
                    EduSphere is a student-managed academic ecosystem designed to support university students
                    through peer learning, AI-powered guidance, and structured collaboration. Join a community
                    that empowers you to learn smarter, connect deeper, and achieve excellence together.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/register"
                        className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        Register Now
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 bg-white/80 backdrop-blur-sm text-primary-700 rounded-full font-semibold text-lg hover:shadow-xl hover:bg-white transition-all duration-300 border-2 border-primary-200"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
