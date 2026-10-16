import "./ParticlesBg.css";
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface ParticlesBgProps {
  particleColor: string;
  linkColor: string;
  enabled: boolean;
}

function Starfield({ particleColor, linkColor }: Omit<ParticlesBgProps, "enabled">) {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (): Promise<void> => {
    // Intentionally quiet: background decoration needs no logging.
  };

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        // Transparent so the themed page background shows through.
        color: { value: "transparent" },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          push: { quantity: 3 },
          repulse: { distance: 160, duration: 0.4 },
        },
      },
      particles: {
        color: { value: particleColor },
        links: {
          color: linkColor,
          distance: 150,
          enable: true,
          opacity: 0.45,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: { default: OutMode.out },
          random: false,
          speed: 1.6,
          straight: false,
        },
        number: {
          density: { enable: true },
          value: 60,
        },
        opacity: { value: 0.55 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3.5 } },
      },
      detectRetina: true,
    }),
    [particleColor, linkColor],
  );

  if (!init) {
    return <></>;
  }

  return <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />;
}

function ParticlesBg({ particleColor, linkColor, enabled }: ParticlesBgProps) {
  if (!enabled) {
    return null;
  }
  return (
    <div className="particles-bg" aria-hidden="true">
      <Starfield particleColor={particleColor} linkColor={linkColor} />
    </div>
  );
}

export default ParticlesBg;
