import React from "react";

const evidenceModules = import.meta.glob("../assets/visual-evidence/*.{jpg,jpeg,png,webp,avif}", {
    eager: true,
    query: "?url",
    import: "default",
}) as Record<string, string>;

const evidenceImages = Object.values(evidenceModules);

function renderEvidenceImage(src: string) {
    return (
        <div key={src} className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 shadow-sm">
            <img
                src={src}
                alt="Visual evidence"
                className="h-64 w-full object-cover"
                loading="lazy"
            />
        </div>
    );
}

const VisualEvidenceSection: React.FC = () => {
    if (evidenceImages.length === 0) {
        return null;
    }

    return (
        <section id="visual-evidence" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-trust-blue sm:text-4xl">Visual Evidence</h2>
                    <div className="w-20 h-1.5 bg-trust-gold mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {evidenceImages.map(renderEvidenceImage)}
                </div>
            </div>
        </section>
    );
};

export default VisualEvidenceSection;
