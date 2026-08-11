import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, Info, Clock, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const hotlines = [
    { title: 'Emergency Trauma Desk', phone: '+1 (800) 555-0199', desc: 'Critical care, cardiac arrest, and accident dispatch.', icon: Phone, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
    { title: 'Reception check-in Desk', phone: '+1 (800) 555-0102', desc: 'Patient check-ins, registration, and queue details.', icon: Clock, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
    { title: 'Pathology & Lab Wards', phone: '+1 (800) 555-0155', desc: 'Blood reports, biopsies, and lab diagnostics.', icon: Info, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' }
  ];

  return (
    <div className="space-y-20 pb-20 pt-12">
      {/* Title Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">Get Support</span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">Contact Our Hospital Wings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Need details on medical operating hours, reports status, or help booking a specialist consult? Reach out to our intake desk.
        </p>
      </section>

      {/* Hotlines and Form Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Columns: Hotlines and Info */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Emergency & Desk Hotlines</h3>
          
          <div className="space-y-4">
            {hotlines.map((h, idx) => {
              const IconComp = h.icon;
              return (
                <div key={idx} className="glass-card dark:glass-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-850 flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${h.color}`}>
                    <IconComp size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-805 dark:text-white">{h.title}</h4>
                    <p className="text-sm font-black text-slate-850 dark:text-teal-400 mt-0.5">{h.phone}</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card dark:glass-card-dark p-5 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-800 dark:text-white">Administrative Mailing</h4>
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-teal-500 shrink-0" />
              <span>operations@mediqr-hospital.com</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={16} className="text-teal-500 shrink-0" />
              <span>123 Medical Center Dr, Plaza Level, NY 10001</span>
            </div>
          </div>
        </div>

        {/* Right Columns: Interactive Query Form */}
        <div className="lg:col-span-7">
          <div className="glass-card dark:glass-card-dark rounded-3xl border border-slate-100 dark:border-slate-850 p-6 sm:p-8 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider mb-6">Send an Administrative Inquiry</h3>

            {success ? (
              <div className="py-10 text-center space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto border border-teal-500/20">
                  <CheckCircle size={24} />
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">Inquiry Submitted!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Thank you for writing. Our patient relations desks will review your query and respond within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-250 text-[10px] font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Peter Parker"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. peter@gmail.com"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Medical Records Inquiry"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Message / Inquiry *</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your inquiry in detail..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-teal-650 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer shadow-sm"
                  >
                    {loading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block"></span>
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Simulated Google Map Mockup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-900 dark:bg-slate-950 p-6 border border-slate-800 overflow-hidden shadow-md flex flex-col justify-between h-96">
          {/* Mock Grid Lines representing Map Streets */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #334155 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)', backgroundSize: '120px 120px' }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/75 p-4 rounded-2xl border border-slate-850 backdrop-blur-md max-w-lg">
            <div>
              <h4 className="text-xs font-extrabold text-white">MediQR General Hospital Campus</h4>
              <p className="text-[10px] text-slate-400 mt-1">123 Medical Center Dr, Health Plaza, NY 10001</p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors shrink-0"
            >
              Get Directions
            </a>
          </div>

          {/* Map Marker Mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
            <span className="w-4 h-4 rounded-full bg-teal-500 border-2 border-white animate-ping absolute"></span>
            <div className="w-6 h-6 rounded-full bg-teal-550 border-2 border-white flex items-center justify-center text-white relative z-10 shadow-md">
              <MapPin size={12} className="fill-white text-teal-600" />
            </div>
            <span className="bg-slate-950/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow border border-slate-800 whitespace-nowrap">
              MediQR Main Entrance
            </span>
          </div>

          <div className="relative z-10 self-end text-[9px] text-slate-500 font-medium">
            Interactive Map Engine Mockup • Active GPS Coordinates: 40.7128° N, 74.0060° W
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
