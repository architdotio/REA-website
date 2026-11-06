'use client';

import React, { useEffect, useRef, useState } from 'react';
import { WebGLStage } from '@/lib/webgl/scene';
import { InputController } from '@/lib/scroll';
import { AudioManager } from '@/lib/audio';
import { CHAPTERS, Chapter, PROJECTS, Project } from '@/lib/data';

import Header from './Header';
import IntroSection from './IntroSection';
import ChapterSection from './ChapterSection';
import WorkLabels from './WorkLabels';
import FrameTags from './FrameTags';
import FinaleSection from './FinaleSection';
import RailNav from './RailNav';
import ScrollCue from './ScrollCue';
import BasicPortfolio from './BasicPortfolio';
import IndexDrawer from './IndexDrawer';
import WorkModal from './WorkModal';
import Loader from './Loader';
import CustomCursor from './CustomCursor';
import AwwwardsBadge from './AwwwardsBadge';
import Footer from './Footer';

export default function CanvasStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<WebGLStage | null>(null);
  const audioRef = useRef<AudioManager | null>(null);
  const inputRef = useRef<InputController | null>(null);

  // UI state
  const [loadingProgress, setLoadingProgress] = useState(0.1);
  const [isReady, setIsReady] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  // Chapter and scroll state
  const [progress, setProgress] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [introOpacity, setIntroOpacity] = useState(1);
  const [isFinaleActive, setIsFinaleActive] = useState(false);

  // 3D Work cards & modal
  const [hoveredCard, setHoveredCard] = useState(-1);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Simulate loader progress
    let p = 0.1;
    const loadInterval = setInterval(() => {
      p += 0.08;
      if (p >= 1) {
        p = 1;
        clearInterval(loadInterval);
        setIsReady(true);
      }
      setLoadingProgress(Math.min(1, p));
    }, 120);

    const audio = new AudioManager();
    audioRef.current = audio;

    const input = new InputController({
      storyMax: () => {
        if (typeof document === 'undefined') return 3000;
        return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      },
    });
    inputRef.current = input;

    const stage = new WebGLStage(canvas, input, {
      onProgressUpdate: (scrollProg, sceneF, chapterIdx, localProg) => {
        setProgress(scrollProg);
        setCurrentChapterIndex(chapterIdx);
        setLocalProgress(localProg);

        // Intro fades in chapter 0
        const introAmt = Math.max(0, 1 - scrollProg * 6);
        setIntroOpacity(introAmt);

        // Finale activates at end
        setIsFinaleActive(scrollProg > 0.88);

        // Update audio engine
        audio.update({
          scrollV: Math.abs(input.scrollVel),
          sceneF,
          modal: isModalOpen,
          footer: input.footer,
        });
      },
      onHoverWorkCard: (cardIdx) => {
        setHoveredCard(cardIdx);
      },
      onSelectProject: (projIdx) => {
        setActiveProject(PROJECTS[projIdx] || null);
        setIsModalOpen(true);
        audio.playSfx('open');
      },
      onLoaded: () => {
        setLoadingProgress(1);
        setIsReady(true);
      },
    });
    stageRef.current = stage;

    return () => {
      clearInterval(loadInterval);
      stage.destroy();
      input.destroy();
    };
  }, [isModalOpen]);

  const handleEnter = (sound: boolean) => {
    setIsDone(true);
    document.documentElement.classList.remove('gate');
    if (audioRef.current) {
      audioRef.current.enter(sound);
      setSoundOn(audioRef.current.on);
    }
  };

  const handleToggleSound = () => {
    if (audioRef.current) {
      audioRef.current.toggle();
      setSoundOn(audioRef.current.on);
    }
  };

  const handleJump = (chapterIdx: number) => {
    if (stageRef.current) {
      stageRef.current.jumpToChapter(chapterIdx);
    }
  };

  const handleBeginAgain = () => {
    handleJump(0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    audioRef.current?.playSfx('close');
  };

  const currentChapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];

  return (
    <>
      <canvas id="gl" ref={canvasRef} aria-hidden="true" />
      <div id="scroll" aria-hidden="true" style={{ height: '700vh', width: '1px' }} />

      <main id="ui">
        <Header
          currentChapter={currentChapterIndex}
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onToggleIndex={() => setIsIndexOpen((prev) => !prev)}
          onJumpStart={() => handleJump(0)}
        />

        <IntroSection introOpacity={introOpacity} />

        <ChapterSection
          chapter={currentChapter}
          chapterIndex={currentChapterIndex}
          isActive={introOpacity < 0.8 && !isFinaleActive}
          localProgress={localProgress}
        />

        <WorkLabels
          activeIndex={hoveredCard}
          isHot={hoveredCard >= 0}
          onSelectProject={(idx) => {
            setActiveProject(PROJECTS[idx] || null);
            setIsModalOpen(true);
            audioRef.current?.playSfx('open');
          }}
        />

        <FrameTags />

        <FinaleSection isActive={isFinaleActive} />

        <RailNav
          progress={progress}
          currentChapter={currentChapterIndex}
          onJump={handleJump}
        />

        <ScrollCue opacity={introOpacity} />

        <BasicPortfolio />

        <IndexDrawer
          isOpen={isIndexOpen}
          currentChapter={currentChapterIndex}
          onClose={() => setIsIndexOpen(false)}
          onJump={handleJump}
        />
      </main>

      <WorkModal
        project={activeProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Footer onBeginAgain={handleBeginAgain} />

      <Loader
        progress={loadingProgress}
        isReady={isReady}
        isDone={isDone}
        onEnter={handleEnter}
      />

      <CustomCursor />

      <AwwwardsBadge />
    </>
  );
}
