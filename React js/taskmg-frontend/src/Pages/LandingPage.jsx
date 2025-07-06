import { useState } from 'react';
import { CheckCircle, Calendar, Users, List, BarChart2, Bell, Moon, Clock, Settings, Search, Heart, Shield, Zap } from 'lucide-react';

export default function TaskManagementLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const features = [
    { 
      icon: <CheckCircle className="w-8 h-8 mb-4 text-blue-500" />, 
      title: "Task Tracking", 
      description: "Easily create, organize, and track tasks with intuitive drag-and-drop interfaces."
    },
    { 
      icon: <Calendar className="w-8 h-8 mb-4 text-blue-500" />, 
      title: "Scheduling", 
      description: "Plan your work with calendar integration and deadline reminders."
    },
    { 
      icon: <Users className="w-8 h-8 mb-4 text-blue-500" />, 
      title: "Team Collaboration", 
      description: "Share tasks, assign responsibilities, and collaborate effectively."
    },
    { 
      icon: <BarChart2 className="w-8 h-8 mb-4 text-blue-500" />, 
      title: "Analytics", 
      description: "Get insights into productivity and track project progress."
    },
    { 
      icon: <Bell className="w-8 h-8 mb-4 text-blue-500" />, 
      title: "Notifications", 
      description: "Stay updated with customizable alerts and reminders."
    },
    { 
      icon: <Moon className="w-8 h-8 mb-4 text-blue-500" />, 
      title: "Dark Mode", 
      description: "Work comfortably day or night with theme options."
    },
    { 
      icon: <Shield className="w-8 h-8 mb-4 text-blue-500" />, 
      title: "Secure Storage", 
      description: "Keep your tasks and projects secure with enterprise-grade encryption."
    },
    { 
      icon: <Zap className="w-8 h-8 mb-4 text-blue-500" />, 
      title: "Automations", 
      description: "Automate repetitive tasks and workflows to save time and reduce errors."
    }
  ];

  const testimonials = [
    {
      quote: "This task management system has completely transformed how our team works. We've seen a 30% increase in productivity!",
      author: "Sarah Johnson",
      role: "Project Manager",
      company: "TechCorp Inc."
    },
    {
      quote: "The intuitive interface and powerful features make this the best task management tool I've ever used.",
      author: "Michael Chen",
      role: "Tech Lead",
      company: "Innovate Solutions"
    },
    {
      quote: "From personal to-dos to complex team projects, this system handles it all beautifully.",
      author: "Priya Patel",
      role: "Product Owner",
      company: "DigitalFirst"
    },
    {
      quote: "The automation features have saved my team countless hours on repetitive tasks. Game changer!",
      author: "James Wilson",
      role: "Marketing Director",
      company: "Growth Strategies"
    }
  ];

  const tabContent = {
    personal: {
      title: "Personal Task Management",
      description: "Stay on top of your personal tasks and goals. Organize your day, track habits, and never miss a deadline.",
      image: "images/image1.png",
      features: [
        "Track personal tasks and goals",
        "Daily, weekly, and monthly views",
        "Habit tracking and streaks",
        "Priority management"
      ]
    },
    teams: {
      title: "Team Collaboration",
      description: "Streamline team workflow, assign tasks, track progress, and communicate effectively in one place.",
      image: "images/image1.png",
      features: [
        "Task delegation and tracking",
        "Team dashboards and progress views",
        "Comments and real-time collaboration",
        "Role-based permissions"
      ]
    },
    enterprise: {
      title: "Enterprise Solutions",
      description: "Powerful tools for large organizations with advanced security, reporting, and customization.",
      image: "images/image1.png",
      features: [
        "Custom workflow creation",
        "Advanced analytics and reporting",
        "SSO and enterprise security",
        "Dedicated support and training"
      ]
    }
  };

  return (
    <div className="min-h-screen max-w-8xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <List className="h-8 w-8 text-blue-500 mr-2" />
            <span className="text-xl font-bold">TaskMaster</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-blue-500 font-medium">Features</a>
            <a href="#solutions" className="hover:text-blue-500 font-medium">Solutions</a>
            <a href="#testimonials" className="hover:text-blue-500 font-medium">Testimonials</a>
            <a href="#contact" className="hover:text-blue-500 font-medium">Contact</a>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden md:flex space-x-4 items-center">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
            <a href='/login' className="px-4 py-2 font-medium text-blue-500 hover:text-blue-600">Login</a>
            <a href='/login' className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300">Sign Up Free</a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-2">
              <nav className="flex flex-col space-y-3 pb-3">
                <a href="#features" className="hover:text-blue-500 font-medium" onClick={() => setIsMenuOpen(false)}>Features</a>
                <a href="#solutions" className="hover:text-blue-500 font-medium" onClick={() => setIsMenuOpen(false)}>Solutions</a>
                <a href="#testimonials" className="hover:text-blue-500 font-medium" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
                <a href="#contact" className="hover:text-blue-500 font-medium" onClick={() => setIsMenuOpen(false)}>Contact</a>
                <div className="pt-2 flex space-x-4">
                  <button className="px-4 py-2 font-medium text-blue-500 hover:text-blue-600">Login</button>
                  <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600">Sign Up Free</button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Manage Tasks. <br />Boost Productivity.</h1>
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
                The all-in-one task management solution for individuals and teams. Organize, track, and complete tasks with ease.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-md hover:from-blue-600 hover:to-blue-700 shadow-lg transition duration-300 transform hover:-translate-y-1">
                  Get Started - It's Free
                </button>
                <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition duration-300">
                  <Clock className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
              <div className="mt-8 flex items-center">
                
                <span className="ml-2 text-gray-600 dark:text-gray-300">Joined by 10,000+ users</span>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden p-2 border border-gray-200 dark:border-gray-700 transform transition duration-500 hover:scale-105">
                <div className="bg-gray-100 dark:bg-gray-700 h-8 rounded-t-md flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <img src="images/image1.png" alt="Task Management Dashboard" className="rounded-b-md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-500">1M+</p>
              <p className="text-gray-600 dark:text-gray-300">Active Users</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-500">50M+</p>
              <p className="text-gray-600 dark:text-gray-300">Tasks Completed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-500">10K+</p>
              <p className="text-gray-600 dark:text-gray-300">Teams</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-500">99%</p>
              <p className="text-gray-600 dark:text-gray-300">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Tabs Section */}
      <section id="solutions" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Solutions for Everyone</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whether you're an individual, small team, or large enterprise, we have the right solution for you.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center mb-8">
            <button 
              onClick={() => setActiveTab('personal')} 
              className={`px-6 py-2 font-medium mx-2 mb-4 rounded-full transition-colors ${activeTab === 'personal' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              Personal
            </button>
            <button 
              onClick={() => setActiveTab('teams')} 
              className={`px-6 py-2 font-medium mx-2 mb-4 rounded-full transition-colors ${activeTab === 'teams' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              Teams
            </button>
            <button 
              onClick={() => setActiveTab('enterprise')} 
              className={`px-6 py-2 font-medium mx-2 mb-4 rounded-full transition-colors ${activeTab === 'enterprise' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              Enterprise
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-8">
                <h3 className="text-2xl font-bold mb-4">{tabContent[activeTab].title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{tabContent[activeTab].description}</p>
                <ul className="space-y-3">
                  {tabContent[activeTab].features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300">
                  Learn More
                </button>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  <img src={tabContent[activeTab].image} alt={tabContent[activeTab].title} className="rounded-md w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage tasks effectively and boost your productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg hover:shadow-md transition-all duration-300 hover:transform hover:-translate-y-1 border border-transparent hover:border-blue-100 dark:hover:border-blue-900">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screenshot Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Beautiful & Intuitive Interface</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our task management system is designed to be simple to use while providing powerful functionality.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute -top-4 -left-4 right-4 bottom-4 bg-blue-500 rounded-xl opacity-20"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-700 h-10 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto bg-white dark:bg-gray-600 rounded-full px-4 py-1 text-xs text-gray-600 dark:text-gray-300">
                    app.taskmaster.com
                  </div>
                </div>
                <img src="images/image1.png" alt="Task Management Interface" className="w-full" />
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300 shadow-lg">
                Try It Yourself
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <div className="text-blue-400 text-4xl font-serif mb-4">"</div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <button className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Read More Success Stories
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to boost your productivity?</h2>
            <p className="text-xl mb-8">
              Join thousands of individuals and teams who have transformed their workflow with our task management system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 shadow-lg transition duration-300">
                Get Started for Free
              </button>
              <button className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-blue-700 transition duration-300">
                Schedule a Demo
              </button>
            </div>
            <p className="mt-4 text-blue-200 flex items-center justify-center">
              <Shield className="w-4 h-4 mr-2" />
              No credit card required. 14-day free trial.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Have questions or need assistance? Our team is here to help. Send us a message and we'll get back to you as soon as possible.
                </p>
                <form>
                  <div className="mb-4">
                    <input type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="mb-4">
                    <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="mb-4">
                    <textarea placeholder="Your Message" rows="4" className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <button type="submit" className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300">
                    Send Message
                  </button>
                </form>
              </div>
              <div className="md:w-1/2 bg-blue-500 p-8 md:p-12 text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-blue-100">123 Productivity St, San Francisco, CA 94107</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-blue-100">(123) 456-7890</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-blue-100">info@taskmaster.com</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  <h4 className="font-medium mb-4">Connect With Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <List className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold text-white">TaskMaster</span>
              </div>
              <p className="mb-4">
                The complete task management solution for teams and individuals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <select className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English (US)</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}