import Image from "next/image"

export function FeaturedImage({ image, title }) {
    return (
        <section className="container px-4 md:px-6 mb-12">
        <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
        </div>
        </section>
    )
}
