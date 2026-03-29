import { GraduationCap, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white/60 backdrop-blur-md border-t border-gray-200 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <GraduationCap className="h-8 w-8 text-primary-600" />
                        <span className="text-2xl font-bold gradient-text">EduSphere</span>
                    </div>

                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Smart University Academic Ecosystem - Empowering students through collaboration and innovation
                    </p>

                    <div className="flex items-center justify-center gap-1 text-gray-600">
                        <span>© 2026 EduSphere</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
