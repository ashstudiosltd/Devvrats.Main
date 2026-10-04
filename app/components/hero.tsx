import GradientWordmark from "@/components/GradientWordmark";

export default function Hero() {
  return (
    <section
      id="hero"
      className="
        relative h-dvh min-h-[480px]
        overflow-hidden
        bg-black
        px-[clamp(16px,2.3vw,32px)]
        text-white
      "
    >
      <GradientWordmark text="DEVVRATS." />

      <h1
        className="
          absolute
          left-[56%]
          top-[26%]
          z-10
          w-[40%]
          text-balance
          text-[clamp(28px,2.7vw,52px)]
          font-medium
          leading-[1.05]
          tracking-[-0.045em]
          text-white

          max-[820px]:left-6
          max-[820px]:top-1/2
          max-[820px]:-translate-y-1/2
          max-[820px]:w-[min(calc(100%-48px),14em)]
          max-[820px]:text-left
          max-[820px]:text-[clamp(30px,8.5vw,52px)]

          max-[820px]:landscape:text-[clamp(22px,4vw,34px)]
        "
      >
        <span className="text-[#a78bfa]">
          A community
        </span>{" "}
        where developers don’t just learn to build,
        they build together.{" "}
        <span className="text-[#a78bfa]">
          Devvrats
        </span>{" "}
        is a home for curious minds, bold ideas, and
        people who believe the best things are created
        when we share what we know, help each other
        grow, and turn ideas into reality.
      </h1>
    </section>
  );
}