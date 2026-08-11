import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  QrCode,
  ShieldCheck,
  Stethoscope,
  Activity,
  Clock,
  ChevronRight,
  Shield,
  Smartphone,
  CheckCircle2,
  Calendar,
  Users,
  Compass
} from 'lucide-react';

const Home = () => {
  const stats = [
    { value: '50K+', label: 'Patients Treated', icon: Users, color: 'text-teal-500' },
    { value: '150+', label: 'Specialist Doctors', icon: Stethoscope, color: 'text-sky-500' },
    { value: '24/7', label: 'Emergency Support', icon: Clock, color: 'text-red-500' },
    { value: '99.8%', label: 'Recovery Rate', icon: Activity, color: 'text-purple-500' },
  ];

  const qrFeatures = [
    {
      title: 'Digital Wristband Profile',
      desc: 'Patients receive an auto-generated unique QR card on intake, linked directly to their secure digital chart.',
      icon: QrCode,
      bg: 'bg-teal-50 dark:bg-teal-950/20',
      iconColor: 'text-teal-600 dark:text-teal-400'
    },
    {
      title: 'Webcam Clinical Scan',
      desc: 'Attending physicians scan patient wristbands via standard webcam lenses to fetch clinical records in milliseconds.',
      icon: Smartphone,
      bg: 'bg-sky-50 dark:bg-sky-950/20',
      iconColor: 'text-sky-600 dark:text-sky-400'
    },
    {
      title: 'Role-Based Protection',
      desc: 'Highly sensitive EMR diagnostic logs are restricted to doctors, while check-in and billing are accessible to receptionists.',
      icon: ShieldCheck,
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const services = [
    { title: 'Emergency Trauma Care', desc: 'State-of-the-art 24/7 level 1 trauma unit staffed by critical care physicians.', icon: HeartPulse, color: 'border-t-4 border-t-red-500' },
    { title: 'Advanced Outpatient Clinic', desc: 'Comprehensive consultations, routine health screenings, and preventative care.', icon: Stethoscope, color: 'border-t-4 border-t-teal-500' },
    { title: 'Laboratory Diagnostics', desc: 'Fully automated path labs providing rapid blood tests, pathology, and biopsies.', icon: Activity, color: 'border-t-4 border-t-sky-500' },
    { title: '24/7 Smart Pharmacy', desc: 'Instant checkouts and prescription updates synced via patient QR wristbands.', icon: ShieldCheck, color: 'border-t-4 border-t-purple-500' },
    { title: 'Telemedicine Support', desc: 'Consult with leading specialist medical practitioners from the comfort of home.', icon: Compass, color: 'border-t-4 border-t-blue-500' },
    { title: 'Intense Care Unit (ICU)', desc: 'Advanced monitoring and specialized nursing teams for critical patient needs.', icon: Clock, color: 'border-t-4 border-t-indigo-500' },
  ];

  const departments = [
    { name: 'General Medicine', desc: 'Primary diagnosis, health risk screenings, and adult medical care plans.' },
    { name: 'Cardiology', desc: 'Coronary artery disease treatments, ECG testing, and pacing therapies.' },
    { name: 'Neurology', desc: 'Advanced brain, nerve, and spine disease diagnostics and stroke management.' },
    { name: 'Orthopedics', desc: 'Joint replacements, reconstructive surgeries, and physical therapies.' },
    { name: 'Pediatrics', desc: 'Caring for infants, children, and teens with expert developmental pediatrics.' },
    { name: 'Emergency Room', desc: 'Rapid assessment, resuscitation, and urgent life-saving medical operations.' }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-24 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 dark:from-slate-900/10 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side text info */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/35 border border-teal-100 dark:border-teal-900 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider animate-pulse-soft">
                <QrCode size={14} /> Smart QR-Based Healthcare
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                Smart Patient Care,<br />
                <span className="bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                  Secured via QR
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-650 dark:text-slate-350 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                MediQR integrates digital hospital tracking wristbands with state-of-the-art EMR engines, allowing doctors to securely scan and retrieve medical files in seconds.
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/appointment"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar size={18} />
                  <span>Book Appointment</span>
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Learn More</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right side graphical card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-teal-500/10 to-sky-600/10 dark:from-teal-500/5 dark:to-sky-600/5 rounded-3xl p-6 border border-slate-100 dark:border-slate-900 shadow-xl overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-white/20 dark:bg-slate-950/20 backdrop-blur-md"></div>
                <div className="relative z-10 space-y-6 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">MediQR Intake Scanner</span>
                    </div>
                    <QrCode size={22} className="text-teal-500" />
                  </div>
                  
                  {/* Mock scanner image center */}
                  <div className="w-48 h-48 rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 mx-auto flex flex-col items-center justify-center p-4 relative shadow-inner">
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-bold">
                      <Smartphone size={8} /> Active
                    </div>
                    {/* Simulated laser scan bar */}
                    <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981] animate-bounce top-1/2"></div>
                    <QrCode size={100} className="text-white opacity-80" />
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/85 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-black text-xs">ID</div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800 dark:text-white">James Carter</h4>
                      <p className="text-[9px] text-teal-600 dark:text-teal-400 font-mono mt-0.5">MEDQR-9021 • Demographics Decoded</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hospital Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block mb-1">Who We Are</span>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white">A Patient-First Medical Facility Redefining Efficiency</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              MediQR General Hospital provides superior clinical treatments alongside advanced technical innovations. We understand that medical emergencies require zero friction, which is why our digital intake systems eliminate paperwork queues and secure critical medical folders.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              With 150+ staff clinicians, specialized operating theatres, and 24/7 level 1 trauma response networks, we deliver medical care with maximum reliability and clinical precision.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex gap-2">
                <CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-slate-350 font-semibold">100% Secure EMR Records</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-slate-350 font-semibold">Zero Paperwork Intake</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-slate-350 font-semibold">Attending Doctor Validation</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-slate-350 font-semibold">Instant Triage Categorization</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-850 hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Shield size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Our Mission</h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed">
                Deliver high-quality medical practices integrated with transparent patient workflows to make hospital check-ins secure, efficient, and direct.
              </p>
            </div>
            <div className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-850 hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <HeartPulse size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Our Vision</h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed">
                Redefine international hospital intake standards by leveraging IoT wristbands and instant decodable clinical systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QR-Based Healthcare Features */}
      <section className="bg-slate-100/50 dark:bg-slate-900/20 py-16 border-y border-slate-200/50 dark:border-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Technological Innovation</span>
            <h2 className="text-3xl font-black text-slate-850 dark:text-white">How MediQR Simplifies Your Visit</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our clinic utilizes unique, automated QR code profile tracking. No more repeating histories or waiting on folders during outpatient appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {qrFeatures.map((f, index) => {
              const IconComp = f.icon;
              return (
                <div key={index} className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl ${f.bg} ${f.iconColor} flex items-center justify-center`}>
                      <IconComp size={24} />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">{f.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Medical Solutions</span>
          <h2 className="text-3xl font-black text-slate-850 dark:text-white">Comprehensive Clinical Services</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            From critical cardiac care to remote home consultations, we provide a wide spectrum of healthcare solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, index) => {
            const IconComp = s.icon;
            return (
              <div key={index} className={`glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-850 ${s.color} hover:shadow-md transition-shadow space-y-3`}>
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
                  <IconComp size={20} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">{s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Statistics Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950 p-8 sm:p-12 rounded-3xl text-white border border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-sky-600/10 opacity-30"></div>
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {stats.map((s, index) => {
            const IconComp = s.icon;
            return (
              <div key={index} className="pt-6 lg:pt-0 space-y-2 flex flex-col items-center justify-center">
                <IconComp size={28} className={s.color} />
                <h3 className="text-3xl sm:text-4xl font-black">{s.value}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Departments Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Medical Divisions</span>
          <h2 className="text-3xl font-black text-slate-850 dark:text-white">Our Specialized Departments</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our hospital operates 6 main specialized clinical wings, each headed by leading senior medical specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((d, index) => (
            <div key={index} className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-850 hover:border-teal-500 transition-colors space-y-3">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center justify-between">
                <span>{d.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 font-bold uppercase">Wing {index + 1}</span>
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Appointment CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-teal-500 to-sky-600 p-8 sm:p-12 text-white overflow-hidden shadow-xl shadow-teal-500/10">
          {/* Background circles */}
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-white/10 blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute left-0 bottom-0 w-80 h-80 rounded-full bg-black/10 blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 max-w-4xl mx-auto">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-black">Ready to Book Your Doctor Appointment?</h2>
              <p className="text-xs sm:text-sm text-teal-50 leading-relaxed">
                Schedule a consultation online, receive your personal healthcare QR card, and check in instantly upon arrival.
              </p>
            </div>
            <div className="flex justify-center shrink-0">
              <Link
                to="/appointment"
                className="px-8 py-4 bg-white text-teal-600 hover:bg-slate-50 font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] hover:scale-[1.02] cursor-pointer"
              >
                Schedule Appointment Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
