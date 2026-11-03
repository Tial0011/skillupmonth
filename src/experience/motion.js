import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(500, 33);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function reveal(element, vars = {}) {
  gsap.fromTo(element, { autoAlpha: 0, y: 26, ...vars.from }, {
    autoAlpha: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    clearProps: "visibility",
    ...vars.to,
    scrollTrigger: {
      trigger: vars.trigger || element,
      start: vars.start || "top 84%",
      once: true,
      ...vars.scrollTrigger
    }
  });
}

function setupSponsorMotion() {
  const track = document.querySelector("#sponsor-track");
  const inner = track?.querySelector(".sponsor-track-inner");
  const group = track?.querySelector(".sponsor-marquee-group:not([aria-hidden='true'])");
  const display = track?.closest(".sponsor-display");
  if (!track || !inner || !group || !display) return () => {};

  let marquee;
  let resumeCall;
  let pointerInside = false;
  let focusInside = false;
  let galleryVisible = false;
  let reduced = prefersReducedMotion();

  const start = () => {
    marquee?.kill();
    gsap.killTweensOf(inner);
    if (!galleryVisible || reduced) return;
    gsap.set(inner, { x: 0 });
    const distance = group.getBoundingClientRect().width;
    if (!distance) return;
    if (!reduced) {
      marquee = gsap.to(inner, {
        x: -distance,
        duration: Math.max(18, distance / 24),
        ease: "none",
        repeat: -1
      });
      if (pointerInside || focusInside) marquee.pause();
    }
  };
  const scheduleResume = () => {
    resumeCall?.kill();
    resumeCall = gsap.delayedCall(2.5, () => {
      if (galleryVisible && !pointerInside && !focusInside && !reduced) marquee?.play();
    });
  };
  const pause = () => {
    pointerInside = true;
    marquee?.pause();
  };
  const resume = () => {
    pointerInside = false;
    scheduleResume();
  };
  const focusIn = () => {
    focusInside = true;
    marquee?.pause();
  };
  const focusOut = event => {
    if (event.relatedTarget && track.closest(".sponsor-display")?.contains(event.relatedTarget)) return;
    focusInside = false;
    scheduleResume();
  };
  const onArrow = event => {
    const direction = event.currentTarget.classList.contains("sponsor-next") ? -1 : 1;
    marquee?.pause();
    const distance = group.getBoundingClientRect().width;
    const current = Number(gsap.getProperty(inner, "x")) || 0;
    const next = gsap.utils.wrap(-distance, 0, current + direction * distance / 4);
    gsap.to(inner, {
      x: next,
      duration: reduced ? 0 : 0.8,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => marquee?.progress(gsap.utils.clamp(0, 1, -next / distance))
    });
    scheduleResume();
  };
  const onKeyDown = event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? -1 : 1;
    marquee?.pause();
    const distance = group.getBoundingClientRect().width;
    const current = Number(gsap.getProperty(inner, "x")) || 0;
    const next = gsap.utils.wrap(-distance, 0, current + direction * distance / 4);
    gsap.to(inner, {
      x: next,
      duration: reduced ? 0 : 0.8,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => marquee?.progress(gsap.utils.clamp(0, 1, -next / distance))
    });
    scheduleResume();
  };
  const onMotionChange = event => {
    reduced = event.matches;
    if (reduced) {
      marquee?.kill();
      marquee = undefined;
      gsap.set(inner, { x: 0 });
    } else {
      start();
    }
  };

  const visibilityObserver = new IntersectionObserver(entries => {
    galleryVisible = entries.some(entry => entry.isIntersecting);
    if (galleryVisible) start();
    else {
      marquee?.pause();
      resumeCall?.kill();
    }
  }, { threshold: 0.05 });
  visibilityObserver.observe(display);
  track.addEventListener("pointerenter", pause);
  track.addEventListener("pointerleave", resume);
  track.addEventListener("focusin", focusIn);
  track.addEventListener("focusout", focusOut);
  track.addEventListener("keydown", onKeyDown);
  document.querySelectorAll(".sponsor-arrow").forEach(button => button.addEventListener("click", onArrow));
  window.addEventListener("resize", start, { passive: true });
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionQuery.addEventListener?.("change", onMotionChange);

  return () => {
    marquee?.kill();
    resumeCall?.kill();
    visibilityObserver.disconnect();
    track.removeEventListener("pointerenter", pause);
    track.removeEventListener("pointerleave", resume);
    track.removeEventListener("focusin", focusIn);
    track.removeEventListener("focusout", focusOut);
    track.removeEventListener("keydown", onKeyDown);
    document.querySelectorAll(".sponsor-arrow").forEach(button => button.removeEventListener("click", onArrow));
    window.removeEventListener("resize", start);
    motionQuery.removeEventListener?.("change", onMotionChange);
    gsap.set(inner, { clearProps: "transform" });
  };
}

function setupSkillTilt() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!finePointer.matches || prefersReducedMotion()) return () => {};

  const cleanups = [];
  document.querySelectorAll(".skill-item").forEach(card => {
    const artwork = card.querySelector(".skill-art");
    const onMove = event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      gsap.to(artwork, {
        "--tilt-x": `${-y * 9}deg`,
        "--tilt-y": `${x * 11}deg`,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto"
      });
    };
    const onLeave = () => gsap.to(artwork, {
      "--tilt-x": "0deg",
      "--tilt-y": "0deg",
      duration: 0.5,
      ease: "power3.out"
    });
    card.addEventListener("pointermove", onMove, { passive: true });
    card.addEventListener("pointerleave", onLeave, { passive: true });
    cleanups.push(() => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    });
  });
  return () => cleanups.forEach(cleanup => cleanup());
}

function setupCursor() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!finePointer.matches || prefersReducedMotion()) return () => {};

  const cursor = document.createElement("div");
  cursor.className = "cursor-orb";
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);
  document.documentElement.classList.add("has-custom-cursor");

  const moveX = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3.out" });
  const moveY = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3.out" });
  const onMove = event => {
    moveX(event.clientX);
    moveY(event.clientY);
    cursor.classList.add("is-visible");
  };
  const onEnter = event => {
    if (event.target.closest("a, button, [data-cursor-hover]")) cursor.classList.add("is-hovering");
  };
  const onLeave = event => {
    if (event.target.closest("a, button, [data-cursor-hover]")) cursor.classList.remove("is-hovering");
  };
  const onDown = () => cursor.classList.add("is-pressed");
  const onUp = () => cursor.classList.remove("is-pressed");
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerover", onEnter, { passive: true });
  document.addEventListener("pointerout", onLeave, { passive: true });
  document.addEventListener("pointerdown", onDown, { passive: true });
  document.addEventListener("pointerup", onUp, { passive: true });

  return () => {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerover", onEnter);
    document.removeEventListener("pointerout", onLeave);
    document.removeEventListener("pointerdown", onDown);
    document.removeEventListener("pointerup", onUp);
    document.documentElement.classList.remove("has-custom-cursor");
    cursor.remove();
  };
}

export function initMotion(heroScene) {
  if (prefersReducedMotion()) {
    document.querySelectorAll("[data-reveal]").forEach(element => element.classList.add("is-visible"));
    return setupSponsorMotion();
  }

  const context = gsap.context(() => {
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".site-header", { yPercent: -100, duration: 0.75 })
      .from(".hero-copy > *", { autoAlpha: 0, y: 22, duration: 0.75, stagger: 0.085 }, "-=0.28")
      .from(".hero-visual-label, .hero-index, .scroll-cue", { autoAlpha: 0, duration: 0.6, stagger: 0.08 }, "-=0.42");

    gsap.to({ progress: 0 }, {
      progress: 1,
      ease: "none",
      onUpdate() {
        heroScene?.setStoryProgress(this.targets()[0].progress);
      },
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    document.querySelectorAll(".about-content, .section-heading, .sponsors-heading, .programme-list, .sponsor-display, .cta-inner").forEach(element => {
      reveal(element, { start: "top 86%" });
    });

    gsap.set(".skill-item", { autoAlpha: 0, y: 24, rotateX: -4, transformPerspective: 900 });
    ScrollTrigger.batch(".skill-item", {
      start: "top 88%",
      once: true,
      onEnter: batch => gsap.fromTo(batch, { autoAlpha: 0, y: 24, rotateX: -4 }, {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 0.75,
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "visibility,transform"
      })
    });

    gsap.from(".weekend-panel", {
      autoAlpha: 0,
      y: 22,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ".programme-list", start: "top 82%", once: true }
    });

    gsap.from(".footer-main > *", {
      autoAlpha: 0,
      y: 16,
      duration: 0.65,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: { trigger: ".site-footer", start: "top 90%", once: true }
    });
  });

  const cleanup = [setupSponsorMotion(), setupSkillTilt(), setupCursor()];
  ScrollTrigger.refresh();
  return () => {
    cleanup.forEach(dispose => dispose());
    context.revert();
  };
}
