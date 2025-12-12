import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function Footer() {
  useGSAP(() => {
    gsap.from("footer", {
      x: 50,
      opacity: 0,
      duration: 2,
      ease: "power3.out",
    });
  });

  return (
    <footer>
      <div className="bg-gray-800">
        <div className="max-w-2xl mx-auto text-white py-10">
          <div className="text-center">
            <h3 className="text-3xl">Ventor</h3>
            <p className="font-sans">
              Your online shopping destination for everything you need.
            </p>
          </div>
          <div className="mt-12 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
            <p className="order-2 md:order-1 mt-8 md:mt-0">
              &copy; Ventor, 2025. All rights reserved.
            </p>
            <div className="order-1 md:order-2">
              <span className="px-2">About us</span>
              <span className="px-2 border-l">Contact us</span>
              <span className="px-2 border-l">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
