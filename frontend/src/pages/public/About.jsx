import React from 'react';
import { ShieldCheck, Users, Activity, Award, Calendar, HeartPulse } from 'lucide-react';

const About = () => {
  const values = [
    { title: 'Clinical Integrity', desc: 'Operating with transparent clinical codes and HIPAA compliant EMR structures.', icon: ShieldCheck },
    { title: 'Care Excellence', desc: 'Focusing on individual care plans and keeping recovery rates above 99.8%.', icon: Award },
    { title: 'Technical Innovation', desc: 'Using digital wristband scanning systems to eliminate queue bottlenecks.', icon: Activity },
  ];

  const milestones = [
    { year: '2015', title: 'Hospital Foundation', desc: 'MediQR opened its doors with a 100-bed facility in Health City.' },
    { year: '2018', title: 'Level 1 Trauma Unit', desc: 'Received state accreditation for advanced critical emergency response.' },
    { year: '2021', title: 'Vanguard Medical Wing', desc: 'Inaugurated our cardiovascular surgical labs and specialized ICU wards.' },
    { year: '2026', title: 'QR Wristband Check-in', desc: 'Launched the first IoT-synced patient wristband and instant EMR retrieval engines.' },
  ];

  const team = [
    { name: 'Dr. Sarah Connor', role: 'Chief Medical Officer & Cardiologist', info: 'MD from Harvard. Leading clinical cardiovascular research and digital EMR standards.' },
    { name: 'John Doe', role: 'Director of Healthcare Operations', info: 'MHA from Johns Hopkins. Focused on administrative workflow automation and receptionist desks.' },
    { name: 'Nurse Clara Oswald', role: 'Head of Clinical Nursing', info: 'RN with 12+ years experience in ICU and emergency trauma nurse administration.' }
  ];

  return (
    <div className="space-y-20 pb-20 pt-12">
      {/* Title Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">About MediQR</span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">Our Mission & Hospital History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          MediQR Hospital is a state-of-the-art facility dedicated to clinical excellence, patient security, and healthcare workflow digitization.
        </p>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((v, idx) => {
          const IconComp = v.icon;
          return (
            <div key={idx} className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-850 hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <IconComp size={24} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">{v.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Hospital History Timeline */}
      <section className="bg-slate-100/50 dark:bg-slate-900/20 py-16 border-y border-slate-200/50 dark:border-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-black text-slate-850 dark:text-white">Our Historical Milestones</h2>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-2">A timeline of our clinical growth and technology adoption.</p>
          </div>
          
          <div className="relative border-l-2 border-teal-500 dark:border-teal-900 ml-4 md:ml-32 space-y-8">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-6 md:pl-10">
                {/* Timeline node dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-teal-500 border-4 border-white dark:border-slate-950 shadow-sm"></div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                  <span className="text-sm font-black text-teal-600 dark:text-teal-400 font-mono">{m.year}</span>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">{m.title}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership / Medical Board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-slate-850 dark:text-white">Executive & Medical Board</h2>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-2">The leadership team guiding our clinical standards and patient experiences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((t, idx) => (
            <div key={idx} className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-500 to-sky-600 text-white flex items-center justify-center font-black text-lg mx-auto shadow-md">
                {t.name.split(' ').pop().charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">{t.name}</h3>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider mt-0.5">{t.role}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.info}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
