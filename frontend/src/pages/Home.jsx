import { Link } from 'react-router-dom';
import {motion} from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { ArrowRight, Sparkles, Image, Zap, Palette, Users, Shield, Star, ChevronRight, Check } from 'lucide-react';
function Home() {
  return (
    <AuroraBackground>
    <div className="min-h-screen md:pt-96 pt-72 bg-background">
    <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-5xl font-bold dark:text-white text-center">
          Its time to show power of your words.
        </div>
        <div className="font-extralight text-base md:text-3xl dark:text-neutral-200 md:py-4 py-2">
          Fastest and smartest AIs for $0
        </div>
        <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Start Creating Now
        </button>
      </motion.div> 
      {/* Hero Section */}
      <section className="container px-4 py-16 mt-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-accent/30 border-accent">
              <span className="flex items-center text-white">
                <Star className="h-3.5 w-3.5 mr-1 text-primary" color="yellow" />
                New Features Available
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
              Transform Ideas into
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent block mt-2 pb-4">
                Stunning Images
              </span>
            </h1>
              
            <p className="text-base sm:text-lg text-muted-foreground max-w-[600px] leading-relaxed">
              Create beautiful, unique images in seconds with our advanced AI technology. 
              Perfect for artists, designers, and creative professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/generate"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Start Creating <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border border-accent bg-accent/20 text-primary rounded-lg hover:bg-accent/30 transition-colors"
              >
                View Gallery
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                "https://picsum.photos/seed/1/400",
                "https://picsum.photos/seed/2/400",
                "https://picsum.photos/seed/3/400",
                "https://picsum.photos/seed/4/400"
              ].map((url, index) => (
                <div key={index} className={`${index % 2 === 1 ? 'mt-8' : ''}`}>
                  <img
                    src={url}
                    alt={`AI Generated Art ${index + 1}`}
                    className="rounded-lg shadow-lg w-full aspect-square object-cover transform hover:scale-105 transition-transform duration-300"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { value: "100K+", label: "Images Generated" },
            { value: "50K+", label: "Active Users" },
            { value: "99%", label: "Satisfaction Rate" },
            { value: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div key={index} className="p-6 bg-accent/20 rounded-lg text-center border border-accent/30 backdrop-blur-sm">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-white bg-clip-text text-transparent">
                {stat.value}
              </h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 border-t border-accent/30">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-primary">
          Why Choose Raider
        </h2>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {[
            {
              icon: <Sparkles className="h-12 w-12 text-blue-400" />,
              title: "Advanced AI",
              description: "State-of-the-art image generation powered by cutting-edge AI technology"
            },
            {
              icon: <Zap className="h-12 w-12 text-purple-400" />,
              title: "Lightning Fast",
              description: "Generate high-quality images in seconds, not minutes"
            },
            {
              icon: <Image className="h-12 w-12 text-blue-400" />,
              title: "High Quality",
              description: "Create stunning, professional-grade images every time"
            }
          ].map((feature, index) => (
            <div key={index} 
                 className="flex flex-col items-center text-center p-6 rounded-lg border border-accent/30 bg-accent/20 backdrop-blur-sm hover:bg-accent/30 transition-colors">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2 mt-4 text-primary">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16 border-t border-accent/30">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Ready to Transform Your Ideas?</h2>
          <p className="text-muted-foreground">
            Join thousands of creators who are already using Raider to bring their imagination to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generate"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Creating Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border border-accent bg-accent/20 text-primary rounded-lg hover:bg-accent/30 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    
    </div>
    </AuroraBackground>
  );
}

export default Home;
