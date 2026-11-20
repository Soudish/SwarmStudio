import React from 'react';
import { User } from '../../types';
import { useLenis } from './hooks/useLenis';
import { ScrollProgressBar } from './ScrollProgressBar';
import { LandingNavbar } from './LandingNavbar';
import { Hero } from './Hero';
import { MeetSwarmStudio } from './MeetSwarmStudio';
import { StoryScroll } from './StoryScroll';
import { FeatureShowcase } from './FeatureShowcase';
import { SwarmOrbit } from './SwarmOrbit';
import { WorkspacePreview } from './WorkspacePreview';
import { Faq } from './Faq';
import { FinalCta } from './FinalCta';
import { Footer } from './Footer';

interface LandingPageProps {
  onEnterStudio: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  currentUser: User | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterStudio,
  onOpenAuth,
  currentUser,
}) => {
  // Initialize Lenis smooth scroll; auto-destroys on unmount
  const { scrollTo } = useLenis(true);

  const handleNavigate = (target: string) => {
    scrollTo(target, -80);
  };

  return (
    <div className="font-landing text-text1 min-h-screen relative bg-bg selection:bg-accent-tint selection:text-accent-text theme-transition">
      {/* 2px Page Scroll Progress Line */}
      <ScrollProgressBar />

      {/* Floating Centered Pill Navbar */}
      <LandingNavbar
        onEnterStudio={onEnterStudio}
        onOpenAuth={onOpenAuth}
        currentUser={currentUser}
        onNavigate={handleNavigate}
      />

      {/* 1. Static Fixed Hero in background */}
      <div className="fixed top-0 left-0 right-0 h-screen z-0 pointer-events-auto">
        <Hero
          onEnterStudio={onEnterStudio}
          onExploreClick={() => handleNavigate('#how-it-works')}
        />
      </div>

      {/* 100vh placeholder spacer to allow scrolling */}
      <div className="h-screen w-full pointer-events-none" />

      {/* 2. Curtain Wrapper that slides UP OVER the static hero */}
      <div className="relative z-20 bg-bg rounded-t-[36px] sm:rounded-t-[48px] shadow-[0_-24px_50px_rgba(0,0,0,0.35)] border-t border-border/80">
        {/* Meet SwarmStudio section (Veriq 3-card layout) */}
        <MeetSwarmStudio onExploreClick={() => handleNavigate('#how-it-works')} />

        {/* Pinned Scroll Story with card deck animation */}
        <StoryScroll />

        {/* Horizontal Scroll Gallery */}
        <FeatureShowcase />

        {/* Interactive Orbit */}
        <SwarmOrbit />

        {/* Framed Workspace Preview */}
        <WorkspacePreview />

        {/* Large-type Accordion FAQ */}
        <Faq />

        {/* Final CTA with blurred orbit card */}
        <FinalCta onEnterStudio={onEnterStudio} />

        {/* Cinematic Nebula Footer (Veriq reference style) */}
        <Footer onNavigate={handleNavigate} onEnterStudio={onEnterStudio} />
      </div>
    </div>
  );
};

export default LandingPage;
