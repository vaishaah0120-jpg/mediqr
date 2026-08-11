import React from 'react';
import { HeartPulse, Stethoscope, Activity, ShieldCheck, Compass, Clock, Check } from 'lucide-react';

const Services = () => {
  const serviceDetails = [
    {
      title: 'Emergency Medicine',
      desc: '24/7 level 1 trauma response staffed by senior emergency board-certified physicians. Armed with specialized resuscitation suites and telemetry monitoring.',
      icon: HeartPulse,
      points: ['24/7 Trauma coverage', 'Advanced Cardiac Life Support', 'Instant QR check-in & triage priority']
    },
    {
      title: 'Outpatient Consultations',
      desc: 'Scheduled visits and executive health packages with top specialist clinicians across Cardiology, Neurology, Pediatrics, and Orthopedics.',
      icon: Stethoscope,
      points: ['Flexible booking options', 'Comprehensive diagnostic follow-ups', 'Detailed digital prescriptions']
    },
    {
      title: 'Laboratory Diagnostics',
      desc: 'State-of-the-art pathology, hematology, and biochemistry testing labs with automated diagnostic reporting and rapid online file uploads.',
      icon: Activity,
      points: ['Rapid test turnarounds', 'Fully automated digital reports', 'Secure EMR report sync']
    },
    {
      title: '24/7 Hospital Pharmacy',
      desc: 'In-house pharmacy providing automated drug dispensing, medication counseling, and immediate checkout matching synced QR- wristbands.',
      icon: ShieldCheck,
      points: ['Prescription synchronization', 'Verified drug safety controls', '24-hour drive-thru intake']
    },
    {
      title: 'Telemedicine Clinics',
      desc: 'Secure virtual video appointments with leading physicians, offering digital advice and fast prescription syncs to your hospital EMR profile.',
      icon: Compass,
      points: ['Remote video appointments', 'Online drug advising', 'Direct digital records sync']
    },
    {
      title: 'Intensive Care Unit (ICU)',
      desc: 'Dedicated high-dependency wards for critical patient care, offering continuous physiological monitoring and close nursing assistance.',
      icon: Clock,
      points: ['Continuous cardiac monitoring', '1:1 patient-to-nurse critical ratio', 'Advanced ventilator suites']
    }
  ];

  return (
    <div className="space-y-20 pb-20 pt-12">
      {/* Title Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">What We Offer</span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">Our Specialized Medical Services</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          MediQR Hospital delivers a full spectrum of primary, secondary, and tertiary clinical services, matching premium expertise with fast technical check-ins.
        </p>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceDetails.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div key={idx} className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-850 hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50/70 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <IconComp size={24} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">{s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
              
              <ul className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-4 text-[10px] font-bold text-slate-650 dark:text-slate-350">
                {s.points.map((p, pIdx) => (
                  <li key={pIdx} className="flex items-center gap-2">
                    <Check size={12} className="text-teal-500 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Trust Quote Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Need Customized Critical Care?</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Our specialized clinical response units are on standby 24/7/365. For outpatient bookings, please visit our online scheduler.
        </p>
      </section>
    </div>
  );
};

export default Services;
