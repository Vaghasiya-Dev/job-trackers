'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LandingPage } from './LandingPage';
import { Dashboard } from './Dashboard';
import { JobBoard } from './JobBoard';
import { Analytics } from './Analytics';
import { JobModal } from './JobModal';
import { useJobStore, Job } from '@/store/job-store';

export function AppShell() {
  const currentView = useJobStore((state) => state.currentView);
  const setCurrentView = useJobStore((state) => state.setCurrentView);
  const isModalOpen = useJobStore((state) => state.isModalOpen);
  const editingJob = useJobStore((state) => state.editingJob);
  const openModal = useJobStore((state) => state.openModal);
  const closeModal = useJobStore((state) => state.closeModal);
  const addJob = useJobStore((state) => state.addJob);
  const updateJob = useJobStore((state) => state.updateJob);

  const handleNavigate = (view: 'landing' | 'dashboard' | 'jobs' | 'analytics') => {
    setCurrentView(view);
  };

  const handleAddJob = () => {
    openModal();
  };

  const handleEditJob = (job: Job) => {
    openModal(job);
  };

  const handleSaveJob = (jobData: Omit<Job, 'id' | 'dateCreated' | 'dateUpdated'>) => {
    addJob(jobData);
  };

  const handleUpdateJob = (id: string, updates: Partial<Job>) => {
    updateJob(id, updates);
  };

  // Landing Page doesn't need shell
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage onGetStarted={() => handleNavigate('dashboard')} />
        <JobModal
          isOpen={isModalOpen}
          editingJob={editingJob}
          onClose={closeModal}
          onSave={handleSaveJob}
          onUpdate={handleUpdateJob}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onNavigate={handleNavigate} />
      
      <div className="flex-1 flex">
        <Sidebar onNavigate={handleNavigate} onAddJob={handleAddJob} />
        
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {currentView === 'dashboard' && <Dashboard />}
              {currentView === 'jobs' && (
                <JobBoard onAddJob={handleAddJob} onEditJob={handleEditJob} />
              )}
              {currentView === 'analytics' && <Analytics />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <JobModal
        isOpen={isModalOpen}
        editingJob={editingJob}
        onClose={closeModal}
        onSave={handleSaveJob}
        onUpdate={handleUpdateJob}
      />
    </div>
  );
}
