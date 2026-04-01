export function BusinessConsultation() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-12">
      <hr className="mb-12 border-t border-[#242629]" />

      <div className="rounded-lg border border-[#242629] bg-transparent p-8">
        <h3 className="text-xl font-medium text-white">
          Business consultation
        </h3>

        <p className="mt-3 max-w-[800px] text-sm leading-relaxed text-white/50">
          If our standard resource packages don&apos;t meet your needs, or if
          you require customized solutions or bulk purchases, please complete the
          questionnaire. Our team will promptly contact you to provide
          assistance.
        </p>

        <button className="mt-4 h-[30px] rounded-[15px] border border-white/50 px-4 text-sm text-white transition-colors hover:bg-white/10">
          Apply now
        </button>
      </div>
    </section>
  );
}
