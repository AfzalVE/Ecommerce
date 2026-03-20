export default function Footer() {

  return (

    <footer className="bg-black text-gray-300 py-10">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        <div>

          <h3 className="text-white font-bold mb-3">
            ShopSphere
          </h3>

          <p className="text-sm">
            Premium ecommerce experience
            for modern shoppers.
          </p>

        </div>

        <div>

          <h4 className="text-white mb-3">Company</h4>

          <ul className="space-y-2 text-sm">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>

        </div>

        <div>

          <h4 className="text-white mb-3">Support</h4>

          <ul className="space-y-2 text-sm">
            <li>Help Center</li>
            <li>Returns</li>
            <li>Contact</li>
          </ul>

        </div>

        <div>

          <h4 className="text-white mb-3">Legal</h4>

          <ul className="space-y-2 text-sm">
            <li>Privacy</li>
            <li>Terms</li>
          </ul>

        </div>

      </div>

    </footer>

  );

}