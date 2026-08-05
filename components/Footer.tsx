import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div className="reg">
        <div className="w">
          <p>
            <strong>Important Notice.</strong> Regenera Advisory provides project development,
            strategic consulting, capital alignment, and introductory services. Regenera is not
            registered as a broker dealer, investment adviser, underwriter, or placement agent
            and does not hold or manage client or investor funds. For general informational
            purposes only and does not constitute investment, legal, or tax advice, an offer to
            sell, or a solicitation to purchase any security. Any investment opportunity
            referenced is offered solely by the relevant issuer or registered intermediary and
            remains subject to applicable law, independent due diligence, and definitive
            documentation. Project descriptions and figures do not represent investment
            performance, committed capital, or guaranteed results.
          </p>
        </div>
      </div>
      <footer>
        <div className="w fw">
          <div>
            <div className="flogo">REGENERA</div>
            <p className="fleg">
              Finance aligned with living systems. Project development advisory, infrastructure
              strategy, capital alignment, and real estate structuring for regenerative
              development. &copy; 2026 Regenera Advisory. All rights reserved.
            </p>
          </div>
          <div className="flinks">
            <Link href="/notice">Important Notice</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/contact?path=general">Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
