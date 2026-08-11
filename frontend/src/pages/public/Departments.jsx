import React from 'react';
import { Stethoscope, Heart, Activity, Scissors, Baby, FlameKindling, MapPin, Shield } from 'lucide-react';

const Departments = () => {
  const deptsList = [
    {
      name: 'General Medicine',
      desc: 'Comprehensive adult healthcare services. Focuses on preventative consultations, diagnostics, risk screenings, and primary medical care management plans.',
      head: 'Dr. John Watson, MD',
      floor: 'Wing A, 1st Floor',
      icon: Stethoscope,
      treatments: ['Chronic Disease Care', 'Immunizations & Risk Profiling', 'Diagnostic Physicals']
    },
    {
      name: 'Cardiology',
      desc: 'Expert care for cardiovascular conditions. Offering high-fidelity ECG readings, echocardiography, pacemaker diagnostics, and coronary treatments.',
      head: 'Dr. Sarah Connor, MD (CMO)',
      floor: 'Wing B, 2nd Floor',
      icon: Heart,
      treatments: ['Coronary Artery Screening', 'Echocardiograms', 'Hypertension & BP Management']
    },
    {
      name: 'Neurology',
      desc: 'Diagnostics and clinical plans for central and peripheral nervous system disorders. Specialized stroke units and seizure diagnostics.',
      head: 'Dr. Stephen Strange, PhD',
      floor: 'Wing C, 3rd Floor',
      icon: Activity,
      treatments: ['Epilepsy & Seizure Care', 'Migraine & Chronic Pain Management', 'Stroke Rehabilitation']
    },
    {
      name: 'Orthopedics',
      desc: 'Corrective procedures for bone, joint, ligament, and muscle disorders. Offering orthopedic surgeries and dedicated physical rehab wings.',
      head: 'Dr. Gregory House, MD',
      floor: 'Wing D, Ground Floor',
      icon: Scissors,
      treatments: ['Joint Replacement Surgery', 'Fracture Casting & Cast Checks', 'Spine & Scoliosis Therapies']
    },
    {
      name: 'Pediatrics',
      desc: 'Providing specialized clinical care for infants, children, and adolescents. Focusing on immunizations and pediatric developmental health.',
      head: 'Dr. Clara Oswald, Ped.D',
      floor: 'Wing E, 2nd Floor',
      icon: Baby,
      treatments: ['Newborn Assessments', 'Pediatric Immunizations', 'Adolescent Care & Wellness']
    },
    {
      name: 'Emergency Medicine',
      desc: 'Rapid level 1 trauma assessments, critical resuscitations, and urgent emergency surgery preparation. Open 24/7/365 with zero down-time.',
      head: 'Dr. Bruce Banner, MD',
      floor: 'Wing F, Ground Floor (Emergency Entrance)',
      icon: FlameKindling,
      treatments: ['Trauma Resuscitation', 'Acute Pain Management', 'Cardiac Life Support Wards']
    }
  ];

  return (
    <div className="space-y-20 pb-20 pt-12">
      {/* Title Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">Medical Wings</span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">Our Clinical Departments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          MediQR features 6 core clinical departments, each fully integrated with our QR digital record systems for immediate file lookups.
        </p>
      </section>

      {/* Departments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deptsList.map((d, idx) => {
          const IconComp = d.icon;
          return (
            <div key={idx} className="glass-card dark:glass-card-dark p-6 rounded-2xl border border-slate-100 dark:border-slate-850 hover:shadow-md hover:border-teal-500/50 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
                    <IconComp size={20} />
                  </div>
                  <span className="flex items-center gap-1 text-[9px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded">
                    <MapPin size={10} />
                    <span>{d.floor}</span>
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">{d.name}</h3>
                  <p className="text-[10px] text-teal-650 dark:text-teal-400 font-bold mt-0.5">Head: {d.head}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{d.desc}</p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-2">
                <strong className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">Common Services</strong>
                <div className="flex flex-wrap gap-1.5">
                  {d.treatments.map((t, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-bold text-slate-650 dark:text-slate-300 bg-slate-50 hover:bg-teal-50/50 dark:bg-slate-900 dark:hover:bg-teal-950/20 border border-slate-200 dark:border-slate-800 py-1 px-2.5 rounded-lg transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Departments;
