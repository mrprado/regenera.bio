import Link from "next/link";
import Image from "next/image";
import { STARS } from "@/lib/stars";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div id="stars" aria-hidden="true">
          {STARS.map((s, i) => (
            <div
              key={i}
              className="star"
              style={{
                width: s.size,
                height: s.size,
                left: `${s.left}%`,
                top: `${s.top}%`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.dur}s`
              }}
            />
          ))}
        </div>
        <svg id="orb" viewBox="0 0 760 760" aria-hidden="true">
          <circle cx="380" cy="380" r="80" fill="none" stroke="rgba(180,105,62,0.14)" strokeWidth="1" />
          <circle cx="380" cy="380" r="120" fill="none" stroke="rgba(90,134,168,0.12)" strokeWidth="1" />
          <circle cx="380" cy="380" r="160" fill="none" stroke="rgba(201,168,76,0.14)" strokeWidth="1" />
          <circle cx="380" cy="380" r="200" fill="none" stroke="rgba(111,148,89,0.11)" strokeWidth="1" />
          <circle cx="380" cy="380" r="240" fill="none" stroke="rgba(168,90,90,0.1)" strokeWidth="1" />
          <circle cx="380" cy="380" r="280" fill="none" stroke="rgba(125,136,148,0.09)" strokeWidth="1" />
          <circle cx="380" cy="380" r="320" fill="none" stroke="rgba(138,118,168,0.09)" strokeWidth="1" />
          <circle cx="380" cy="380" r="30" fill="rgba(201,168,76,0.1)" />
          <circle cx="380" cy="380" r="7" fill="#c9a84c" />
          <g className="orb-ring">
            <circle cx="380" cy="300" r="5" fill="#b4693e" />
            <circle cx="580" cy="380" r="5" fill="#6f9459" />
          </g>
          <g className="orb-ring r2">
            <circle cx="380" cy="260" r="5" fill="#5a86a8" />
            <circle cx="620" cy="380" r="5" fill="#a85a5a" />
          </g>
          <g className="orb-ring r3">
            <circle cx="380" cy="220" r="5" fill="#c9a84c" />
            <circle cx="660" cy="380" r="5" fill="#7d8894" />
            <circle cx="380" cy="60" r="5" fill="#8a76a8" />
          </g>
        </svg>
        <div className="hero-in">
          <div className="hol">
            <div className="ey-b"></div>
            <span>Regenerative Ecosystem Advisory</span>
          </div>
          <h1 className="hh">
            Finance aligned with <em>living systems.</em>
          </h1>
          <p className="hs">
            We connect infrastructure and real estate projects with institutional capital, and
            structure the land, energy, and communities they touch for their full potential.
            Solar, waste to energy, real estate, and regenerative development across 8+
            countries.
          </p>
          <div className="hcta">
            <Link href="/how-we-work" className="btn btn-gold">
              How We Work <span className="arr">&rarr;</span>
            </Link>
            <Link href="/philosophy" className="btn btn-line">
              Our Philosophy
            </Link>
          </div>
          <div className="doors" role="navigation" aria-label="Choose your path">
            <Link href="/contact?path=investor" className="door">
              <div className="dl">01</div>
              <div className="dt">For Investors</div>
              <div className="dd">
                Family offices, institutions, and impact investors seeking selectively sourced
                opportunities across energy, infrastructure, real estate, and natural assets.
              </div>
              <span className="da">
                Explore Opportunities <span className="arr">&rarr;</span>
              </span>
            </Link>
            <Link href="/contact?path=developer" className="door">
              <div className="dl">02</div>
              <div className="dt">For Developers</div>
              <div className="dd">
                Developers and project sponsors advancing solar, waste to energy, and
                infrastructure opportunities toward investment readiness, institutional capital,
                and delivery.
              </div>
              <span className="da">
                Advance a Project <span className="arr">&rarr;</span>
              </span>
            </Link>
            <Link href="/contact?path=realestate" className="door">
              <div className="dl">03</div>
              <div className="dt">For Real Estate and Land</div>
              <div className="dd">
                Landowners and developers seeking to unlock long term value through site
                strategy, infrastructure integration, regenerative planning, and capital
                structuring.
              </div>
              <span className="da">
                Structure an Asset <span className="arr">&rarr;</span>
              </span>
            </Link>
            <Link href="/contact?path=operator" className="door">
              <div className="dl">04</div>
              <div className="dt">For Places and Operators</div>
              <div className="dd">
                Municipalities, operators, and landholders developing resilient systems across
                energy, waste, water, food, and the built environment.
              </div>
              <span className="da">
                Explore a Partnership <span className="arr">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
        <div className="trust" role="complementary" aria-label="Regenera at a glance">
          <div className="trust-in">
            <div className="ti" style={{ display: "flex", alignItems: "center" }}>
              <div className="tk" style={{ marginTop: 0, fontSize: 10, color: "var(--gold-dim)" }}>Regenera at a Glance</div>
            </div>
            <div className="ti">
              <div className="tv">7</div>
              <div className="tk">Ecosystem Layers</div>
            </div>
            <div className="ti">
              <div className="tv">10 GW</div>
              <div className="tk">Energy Pipeline</div>
            </div>
            <div className="ti">
              <div className="tv">30+</div>
              <div className="tk">Projects and Mandates</div>
            </div>
            <div className="ti">
              <div className="tv">5+</div>
              <div className="tk">Countries Engaged</div>
            </div>
            <div className="ti">
              <div className="tv">Global</div>
              <div className="tk">Capital and Technical Network</div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PRACTICE AREAS */}
      <section className="sec">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey">
                <div className="ey-b"></div>
                <span>Regenerative Consulting</span>
              </div>
              <h2 className="h2">
                One practice, full stack.
                <br />
                <em>Three ways we deliver it.</em>
              </h2>
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 300, color: "var(--t-mid)", lineHeight: 1.82 }}>
              Regenerative Consulting is the discipline behind everything we do. Energy,
              infrastructure, and real estate. Project readiness. Capital introduction. Three
              practice areas, the same method applied to capital flows, physical land, and the
              readiness work that makes both investable.
            </p>
          </div>
          <div className="pillars plt r d1">
            <Link href="/how-we-work" className="pillar">
              <div className="pn">Practice I</div>
              <div className="pt">Energy, Infrastructure &amp; Real Estate</div>
              <div className="pb">
                Systemic diagnosis, intervention design, and capital alignment across solar,
                waste to energy, land, and the built environment. We find the leverage points
                where one well placed intervention regenerates multiple systems at once.
              </div>
              <span className="pl">
                Explore the method <span className="arr">&rarr;</span>
              </span>
            </Link>
            <Link href="/services?tab=readiness" className="pillar">
              <div className="pn">Practice II</div>
              <div className="pt">Project Readiness</div>
              <div className="pb">
                Preparing projects, portfolios, and places for institutional capital.
                Documentation, structure, diagnostics, and the Five Capitals assessment that
                shows what a project is really worth.
              </div>
              <span className="pl">
                Get ready <span className="arr">&rarr;</span>
              </span>
            </Link>
            <Link href="/services?tab=capital" className="pillar">
              <div className="pn">Practice III</div>
              <div className="pt">Capital Introduction</div>
              <div className="pb">
                Connecting infrastructure and real estate projects with institutional capital
                whose mandate matches their scale, geography, and purpose. Solar, waste to
                energy, land, and regenerative real estate.
              </div>
              <span className="pl">
                See the services <span className="arr">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM PREVIEW */}
      <section className="sec sec-n">
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey lt">
                <div className="ey-b"></div>
                <span>The Ecosystem</span>
              </div>
              <h2 className="h2" style={{ color: "var(--cream)" }}>
                Seven layers.
                <br />
                <em style={{ color: "var(--mist)" }}>One living system.</em>
              </h2>
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 300, color: "rgba(214,231,203,0.5)", lineHeight: 1.82 }}>
              Most firms work in one layer. Regenera works across the whole system, from soil to
              orbit, so that capital lands where it creates compounding value across several
              layers at once.
            </p>
          </div>
          <div className="eco-strip r d1" role="list">
            <Link href="/philosophy#land" className="eco-c" role="listitem">
              <div className="ed" style={{ background: "var(--terra)" }}></div>
              <div className="en">Land and Soil</div>
              <div className="ex">Regenerative land, soil health, agriculture</div>
            </Link>
            <Link href="/philosophy#water" className="eco-c" role="listitem">
              <div className="ed" style={{ background: "var(--water)" }}></div>
              <div className="en">Water</div>
              <div className="ex">Access, watersheds, resource security</div>
            </Link>
            <Link href="/philosophy#energy" className="eco-c" role="listitem">
              <div className="ed" style={{ background: "var(--gold)" }}></div>
              <div className="en">Energy and Waste</div>
              <div className="ex">Solar, storage, waste to energy</div>
            </Link>
            <Link href="/philosophy#food" className="eco-c" role="listitem">
              <div className="ed" style={{ background: "var(--food)" }}></div>
              <div className="en">Food Systems</div>
              <div className="ex">Agri-industrial zones, processing</div>
            </Link>
            <Link href="/philosophy#human" className="eco-c" role="listitem">
              <div className="ed" style={{ background: "var(--human)" }}></div>
              <div className="en">Community and Health</div>
              <div className="ex">Energy, water, and health outcomes</div>
            </Link>
            <Link href="/philosophy#urban" className="eco-c" role="listitem">
              <div className="ed" style={{ background: "var(--urban)" }}></div>
              <div className="en">Built Environment</div>
              <div className="ex">Smart building, energy integrated real estate</div>
            </Link>
            <Link href="/philosophy#orbital" className="eco-c" role="listitem">
              <div className="ed" style={{ background: "var(--orbit)" }}></div>
              <div className="en">Orbital Intelligence</div>
              <div className="ex">Earth observation &amp; verification</div>
            </Link>
          </div>
        </div>
      </section>

      {/* THE WORK, IN THE WORLD */}
      <section className="sec sec-d" style={{ padding: "80px 0" }}>
        <div className="w">
          <div className="split r">
            <div>
              <div className="ey lt">
                <div className="ey-b"></div>
                <span>The Work, In The World</span>
              </div>
              <h2 className="h2" style={{ color: "var(--cream)" }}>
                This is what regenerative
                <br />
                <em style={{ color: "var(--mist)" }}>infrastructure looks like.</em>
              </h2>
            </div>
            <p style={{ fontSize: 14.5, fontWeight: 300, color: "rgba(214,231,203,0.5)", lineHeight: 1.82 }}>
              Built proof that infrastructure can generate power, food, and public life from the
              same footprint. These are the reference standards our work is measured against.
            </p>
          </div>
          <div className="photo-strip r d1">
            <figure className="ph">
              <Image
                src="/images/utility-solar.jpg"
                alt="Aerial view of a utility scale solar farm bordered by forest and terraced farmland"
                width={1200}
                height={675}
                style={{ width: "100%", height: 280, objectFit: "cover" }}
              />
              <figcaption>
                <div className="cap-t">Utility scale solar</div>
                <div className="cap-s">
                  Generation sited with the landscape, not against it. Power built alongside
                  forest and working farmland, each strengthening the value of the other.
                </div>
              </figcaption>
            </figure>
            <figure className="ph">
              <Image
                src="/images/agrivoltaics.jpg"
                alt="A working farm growing vegetables and flowers between rows of elevated solar panels"
                width={1400}
                height={763}
                style={{ width: "100%", height: 280, objectFit: "cover" }}
              />
              <figcaption>
                <div className="cap-t">Agrivoltaics</div>
                <div className="cap-s">
                  Solar energy integrated with active farming. Stable income, healthier soil,
                  and clean power from the same land, without sacrificing the identity that
                  defines it.
                </div>
              </figcaption>
            </figure>
            <figure className="ph">
              <Image
                src="/images/copenhill.jpg"
                alt="Aerial view of a waste to energy plant with a green public park running along its roofline"
                width={1176}
                height={411}
                style={{ width: "100%", height: 280, objectFit: "cover" }}
              />
              <figcaption>
                <div className="cap-t">Waste to energy</div>
                <div className="cap-s">
                  CopenHill, Copenhagen. A plant that converts the city&apos;s waste into heat
                  and power for tens of thousands of homes, beneath a rooftop park the public
                  actually uses. Essential infrastructure designed to strengthen the city around
                  it.
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* SECTORS STRIP */}
      <section className="sec" style={{ padding: "64px 0" }}>
        <div className="w">
          <div className="ey r">
            <div className="ey-b"></div>
            <span>Where We Work</span>
          </div>
          <div className="mand r d1" aria-label="Sectors">
            <span>Utility Scale Solar</span>
            <span>Waste to Energy</span>
            <span>Regenerative Real Estate</span>
            <span>Land Structuring</span>
            <span>Regenerative Agriculture</span>
            <span>Agri Industrial Zones</span>
            <span>Water Infrastructure</span>
            <span>Net Zero Districts</span>
            <span>EV Charging Infrastructure</span>
            <span>Carbon and Environmental Markets</span>
            <span>Environmental Intelligence</span>
          </div>
        </div>
      </section>
    </>
  );
}
