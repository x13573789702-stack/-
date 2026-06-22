import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BorderGlow from "./BorderGlow";
import LightRays from "./LightRays";
import StarBorder from "./StarBorder";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const Icon = ({ name, size = 20 }) => (
  <span
    className={`icon icon-${name}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  />
);

const contact = {
  name: "邢添庆",
  phone: "13573789702",
  email: "x13573789702@163.com",
  location: "北京市昌平区",
  role: "销售工程师"
};

const metrics = [
  { value: "211", label: "北京林业大学硕士背景" },
  { value: "1st", label: "挑战杯国家级一等奖" },
  { value: "3+", label: "材料下游应用场景覆盖" },
  { value: "AI", label: "Codex / ccswitch 工作流熟练应用" }
];

const projects = [
  {
    title: "纳米纤维素水相改性技术",
    tag: "国家级一等奖项目",
    body: "主导生物降解薄膜性能升级，完成从实验室研发到落地可行性的全流程分析，并面向企业专家完成技术宣讲与价值表达。",
    meta: "技术研发 / 产品价值 / 市场竞争力",
    image: "/project-nano-materials.webp",
    imageClass: "projectImageOne"
  },
  {
    title: "国家自然科学基金面上项目",
    tag: "新材料应用研究",
    body: "围绕纳米纤维素、生物降解塑料在包装、农业、医疗等场景的适用性，沉淀产品选型与技术答疑能力。",
    meta: "应用场景 / 技术参数 / 客户转化",
    image: "/project-nano-applications.webp",
    imageClass: "projectImageTwo"
  },
  {
    title: "工程招投标与客户方案支持",
    tag: "中建一局安装工程",
    body: "解读客户招标需求与技术文件，参与技术及资信标书编制，对接项目相关公司资源信息，并用 Revit 辅助方案演示。",
    meta: "标书编制 / 技术文件 / 可视化演示",
    image: "/project-bidding-client-support.webp",
    imageClass: "projectImageThree"
  }
];

const strengths = [
  {
    icon: "target",
    title: "客户需求洞察",
    text: "能把技术文件、招标要求和客户痛点拆解成清晰的方案要点，推动需求从模糊到可执行。",
    image: "/strength-customer-insight.webp"
  },
  {
    icon: "deck",
    title: "技术价值表达",
    text: "擅长用 PPT、演示和结构化叙事讲清产品优势、应用场景与商业价值。",
    image: "/strength-value-expression.webp"
  },
  {
    icon: "file",
    title: "招投标全流程",
    text: "熟悉技术标、资信支持与标书编制，具备工程项目售前支持经验。",
    image: "/strength-bidding-process.webp"
  },
  {
    icon: "cpu",
    title: "新材料技术底座",
    text: "理解纳米纤维素、生物降解塑料、高分子薄膜等材料性能、工艺和下游应用。",
    image: "/strength-materials-foundation.webp"
  },
  {
    icon: "bot",
    title: "AI 工具熟练应用",
    text: "熟练使用 Codex 辅助资料整理、方案生成、页面搭建与代码迭代，并能用 ccswitch 高效切换模型和工作流。",
    image: "/strength-ai-tools.webp"
  },
  {
    icon: "users",
    title: "跨部门协同",
    text: "曾任学院办公室部长和技术部部长，具备事务统筹、团队分工和多任务推进能力。",
    image: "/strength-collaboration.webp"
  }
];

function App() {
  const heroVideoRef = useRef(null);
  const rootRef = useRef(null);
  const [isNavFloating, setIsNavFloating] = useState(false);

  useEffect(() => {
    heroVideoRef.current?.play().catch(() => {});
  }, []);

  useEffect(() => {
    const sentinel = rootRef.current?.querySelector(".navFloatSentinel");
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setIsNavFloating(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      root.classList.add("motion-ready");
      return;
    }

    const ctx = gsap.context(() => {
      root.classList.add("motion-ready");

      gsap.set(".openingPanel", { yPercent: 0 });
      gsap.set(".heroBackdrop", { scale: 1.16, filter: "saturate(0.62) sepia(0.22) brightness(0.48)" });
      gsap.set(".heroAtmosphere", { opacity: 0.96 });
      gsap.set(".heroTitle span", {
        yPercent: 118,
        scaleY: 0.52,
        transformOrigin: "50% 100%",
        rotateX: 18,
        opacity: 0
      });
      gsap.set(".heroArchitecture", {
        clipPath: "inset(100% 0 0 0)",
        y: 120,
        scale: 1.08,
        opacity: 0
      });
      gsap.set(".nav", { y: -42, opacity: 0 });
      gsap.set(".heroKicker span, .heroWelcome, .heroStats, .heroThumb, .mediaContact", {
        y: 46,
        opacity: 0
      });

      const opening = gsap.timeline({ defaults: { ease: "power4.out" } });
      opening
        .to(".openingPanel", {
          yPercent: -102,
          duration: 1.55,
          stagger: 0.12,
          ease: "expo.inOut"
        })
        .to(".openingMask", { autoAlpha: 0, duration: 0.01 })
        .to(".heroBackdrop", {
          scale: 1,
          filter: "saturate(0.84) sepia(0.18) brightness(0.72)",
          duration: 2.4,
          ease: "expo.out"
        }, "-=1.16")
        .to(".nav", { y: 0, opacity: 1, duration: 1.05 }, "-=1.75")
        .to(".heroTitle span", {
          yPercent: 0,
          scaleY: 1,
          rotateX: 0,
          opacity: 1,
          duration: 1.65,
          stagger: 0.18
        }, "-=1.55")
        .to(".heroArchitecture", {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.45,
          ease: "expo.out"
        }, "-=1.18")
        .to(".heroKicker span, .heroWelcome, .heroStats, .heroThumb, .mediaContact", {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.075
        }, "-=0.92");

      gsap.to(".heroBackdrop", {
        yPercent: 9,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".heroArchitecture", {
        yPercent: -13,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      const sections = gsap.utils.toArray(".motionSection");
      sections.forEach((section) => {
        const superTitle = section.querySelector(".motionSuperTitle");
        const eyebrow = section.querySelector(".sectionHeader .eyebrow, .introPanel .eyebrow, .contactInner .eyebrow");
        const heading = section.querySelector(".sectionHeader h2, .introPanel h2, .contactInner h2");
        const cards = section.querySelectorAll(".profileGlowCard, .projectCard, .strengthCard, .finalActions > *");
        const visuals = section.querySelectorAll(".projectVisual, .strengthVisual");
        const images = section.querySelectorAll(".projectVisual img, .strengthVisual img");

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 74%",
            once: true
          },
          defaults: { ease: "power4.out" }
        });

        if (superTitle) {
          timeline.fromTo(
            superTitle,
            { xPercent: -16, y: 70, scaleX: 1.28, opacity: 0, filter: "blur(6px)" },
            { xPercent: 0, y: 0, scaleX: 1, opacity: 1, filter: "blur(0px)", duration: 1.45 },
            0
          );
        }

        const titleElements = [eyebrow, heading].filter(Boolean);
        if (titleElements.length) {
          timeline.fromTo(
            titleElements,
            { y: 42, opacity: 0, clipPath: "inset(0 0 100% 0)" },
            { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 1.05, stagger: 0.1 },
            superTitle ? 0.34 : 0
          );
        }

        if (cards.length) {
          timeline.fromTo(
            cards,
            { y: 120, opacity: 0, scale: 0.96, filter: "blur(4px)" },
            { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.24, stagger: 0.14 },
            superTitle ? 0.62 : 0.22
          );
        }

        if (visuals.length) {
          timeline.fromTo(
            visuals,
            { clipPath: "inset(0 100% 0 0)", scale: 1.06 },
            { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.32, stagger: 0.12, ease: "expo.out" },
            superTitle ? 0.82 : 0.42
          );
        }

        if (images.length) {
          timeline.fromTo(
            images,
            { yPercent: 10, scale: 1.12 },
            { yPercent: 0, scale: 1, duration: 1.7, stagger: 0.1, ease: "expo.out" },
            superTitle ? 0.82 : 0.42
          );
        }
      });

      gsap.to(".projectVisual img", {
        yPercent: -8,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: "#projects",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8
        }
      });

      gsap.to(".strengthVisual img", {
        yPercent: -8,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: "#strengths",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef}>
      <div className="openingMask" aria-hidden="true">
        <div className="openingPanel" />
        <div className="openingPanel" />
        <div className="openingPanel" />
      </div>
      <section className="hero" id="home">
        <div className="heroShell">
          <video
            ref={heroVideoRef}
            className="heroBackdrop"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="heroAtmosphere" />
          <div className="navFloatSentinel" aria-hidden="true" />

          <nav className={`nav ${isNavFloating ? "navFloating" : ""}`}>
            <div className="navPills" aria-label="主导航">
              <a href="#experience">About</a>
              <a href="#projects">Projects</a>
              <a href="#strengths">Skills</a>
              <a href="#contact">Contact</a>
            </div>
            <a className="brand" href="#home">
              <span>XTQ</span>
              Technical Sales
            </a>
            <a className="searchLine" href={`mailto:${contact.email}`}>
              <Icon name="mail" size={15} />
              {contact.email}
            </a>
          </nav>

          <div className="heroStage">
            <p className="heroKicker">
              <span>{contact.location}</span>
              <span>2026 Portfolio</span>
            </p>

            <h1 className="heroTitle" aria-label="Sales Engineer">
              <span>SALES</span>
              <span>ENGINEER</span>
            </h1>

            <div className="heroArchitecture" aria-hidden="true">
              <div className="architecturePlane" />
              <div className="architecturePortal">
                <span />
              </div>
            </div>

            <div className="heroWelcome">
              <span>Welcome to</span>
              <strong>{contact.name}</strong>
              <p>材料与化工硕士背景，聚焦新材料产品价值表达、客户需求转化与工程售前支持。</p>
            </div>

            <div className="heroStats">
              <span>01 / Sales Intention</span>
              <strong>{contact.role}</strong>
              <p>把技术参数、应用场景和客户痛点翻译成可成交的解决方案。</p>
            </div>

            <div className="heroThumbs" aria-label="精选能力">
              <div className="heroThumb thumbOne">
                <span>Bid</span>
              </div>
              <div className="heroThumb thumbTwo">
                <span>Material</span>
              </div>
              <div className="heroThumb thumbThree">
                <span>AI</span>
              </div>
            </div>

            <a className="mediaContact" href="#projects">
              <span>View Projects</span>
              <Icon name="chevron" size={22} />
            </a>
          </div>
        </div>
      </section>

      <div className="belowHero">
        <LightRays
          raysOrigin="top-center"
          raysColor="#eef1ec"
          raysSpeed={0.78}
          lightSpread={0.86}
          rayLength={1.55}
          pulsating
          fadeDistance={1.15}
          saturation={0.42}
          followMouse
          mouseInfluence={0.12}
          noiseAmount={0.08}
          distortion={0.045}
          className="belowHeroRays"
        />

        <section className="experience section motionSection" id="experience">
          <div className="sectionInner split">
            <span className="motionSuperTitle">Profile</span>
            <BorderGlow
              className="portraitPanel profileGlowCard"
              edgeSensitivity={24}
              glowColor="72 18 88"
              backgroundColor="rgba(16, 19, 18, 0.72)"
              borderRadius={10}
              glowRadius={44}
              glowIntensity={1.35}
              coneSpread={28}
              animated
              colors={["#eef1ec", "#aab4ae", "#6f7a74"]}
              fillOpacity={0.38}
            >
              <div className="portrait">
                <div className="avatarInitials">
                  <img
                    src="/avatar.jpg"
                    alt="邢添庆头像"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="orbit orbitOne" />
                <div className="orbit orbitTwo" />
              </div>
              <div className="contactStack">
                <a href={`tel:${contact.phone}`}>
                  <Icon name="phone" size={18} />
                  {contact.phone}
                </a>
                <a href={`mailto:${contact.email}`}>
                  <Icon name="mail" size={18} />
                  {contact.email}
                </a>
                <span>
                  <Icon name="pin" size={18} />
                  {contact.location}
                </span>
              </div>
            </BorderGlow>

            <BorderGlow
              className="introPanel profileGlowCard"
              edgeSensitivity={24}
              glowColor="72 18 88"
              backgroundColor="rgba(16, 19, 18, 0.68)"
              borderRadius={10}
              glowRadius={44}
              glowIntensity={1.35}
              coneSpread={28}
              animated
              colors={["#eef1ec", "#aab4ae", "#6f7a74"]}
              fillOpacity={0.34}
            >
              <p className="eyebrow">Profile</p>
              <h2>技术转化为客户价值。</h2>
              <p>
                2025 年毕业于北京林业大学材料与化工专业，现任中建一局集团安装工程有限公司助理工程师。工作中参与客户招标需求解读、技术及资信标书编制，并通过 Revit 建模进行可视化方案演示。
              </p>
              <p>
                科研与项目经历聚焦纳米纤维素、生物降解塑料、高分子薄膜等新材料方向，能独立完成售前技术咨询、产品选型建议与技术答疑，尤其擅长把技术参数转译为应用场景和竞争优势。
              </p>
              <div className="metricGrid">
                {metrics.map((item) => (
                  <div className="metric" key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </BorderGlow>
          </div>
        </section>

        <section className="projects section motionSection" id="projects">
          <div className="sectionInner">
            <div className="sectionHeader">
              <span className="motionSuperTitle">Selected Work</span>
              <p className="eyebrow">Selected Work</p>
              <h2>精选项目</h2>
            </div>
            <div className="projectGrid">
              {projects.map((project, index) => (
                <StarBorder
                  as="article"
                  className="projectCard"
                  color="rgba(238, 241, 236, 0.95)"
                  speed={`${5 + index}s`}
                  thickness={1}
                  key={project.title}
                >
                  <div className={`projectVisual ${project.imageClass}`}>
                    <img
                      src={project.image}
                      alt={`${project.title}项目场景`}
                      loading="lazy"
                      decoding="async"
                    />
                    <span>{project.tag}</span>
                  </div>
                  <div className="projectContent">
                    <p>{project.meta}</p>
                    <h3>{project.title}</h3>
                    <span>{project.body}</span>
                  </div>
                </StarBorder>
              ))}
            </div>
          </div>
        </section>

        <section className="strengths section motionSection" id="strengths">
          <div className="sectionInner">
            <div className="sectionHeader">
              <span className="motionSuperTitle">Capabilities</span>
              <p className="eyebrow">Capabilities</p>
              <h2>个人优势</h2>
            </div>
            <div className="strengthGrid">
              {strengths.map(({ icon, title, text, image }) => (
                <article
                  className={`strengthCard ${image ? "strengthCardWithImage" : ""}`}
                  key={title}
                >
                  {image && (
                    <div className="strengthVisual">
                      <img
                        src={image}
                        alt={`${title}能力场景`}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="iconBox">
                    <Icon name={icon} size={24} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contactFinal motionSection" id="contact">
          <div className="contactInner">
            <span className="motionSuperTitle">Contact</span>
            <Icon name="spark" size={28} />
            <p className="eyebrow">Let's Build Value</p>
            <h2>期待把技术优势，变成下一次客户成交的理由。</h2>
            <div className="finalActions">
              <a href={`mailto:${contact.email}`}>
                <Icon name="mail" size={20} />
                {contact.email}
              </a>
              <a href={`tel:${contact.phone}`}>
                <Icon name="phone" size={20} />
                {contact.phone}
              </a>
              <span>
                <Icon name="briefcase" size={20} />
                {contact.role}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
