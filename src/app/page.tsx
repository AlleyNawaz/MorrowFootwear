import Image from "next/image";
import Link from "next/link";
import { ProductJourney } from "@/components/experience/product-journey";
import { products, formatMoney } from "@/lib/catalog";

export default function Home() {
  return (
    <main id="main-content">
      <ProductJourney />
      <section className="studio-editorial" aria-labelledby="editorial-heading">
        <Image
          src="/images/morrow-cinematic.png"
          alt="Sculptural footwear suspended between dark architectural planes"
          fill
          sizes="100vw"
        />
        <div className="editorial-frame">
          <span>06 / BETWEEN DESTINATIONS</span>
          <h2 id="editorial-heading">
            The long way
            <br />
            looks good.
          </h2>
          <p>
            Room for a detour. A different route home. The part of the day that
            belongs to you.
          </p>
          <Link href="/journal" className="studio-button mt-8">
            The Morrow journal <span>↗</span>
          </Link>
        </div>
      </section>
      <section className="studio-edit" aria-labelledby="edit-heading">
        <header>
          <div>
            <p>07 / THE CURRENT EDIT</p>
            <h2 id="edit-heading">Choose your direction.</h2>
          </div>
          <Link href="/new">All styles ↗</Link>
        </header>
        <div>
          {products.slice(0, 4).map((p, i) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="selection-item"
            >
              <span>0{i + 1}</span>
              <h3>{p.name}</h3>
              <p>
                {p.category} / {p.colors.length} colorways
              </p>
              <b>{formatMoney(p.price)} ↗</b>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs">
          Sample catalog and pricing. The interactive model is an original
          design study.
        </p>
      </section>
      <section className="studio-ending">
        <p>08 / YOUR NEXT DIRECTION</p>
        <h2>
          Take it
          <br />
          from here.
        </h2>
        <div>
          <Link href="/new" className="studio-button">
            Explore the collection <span>↗</span>
          </Link>
          <Link href="/finder" className="text-control">
            Find your fit →
          </Link>
        </div>
        <small>Demo store / No real purchases</small>
      </section>
    </main>
  );
}
