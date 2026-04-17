import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-[#1A1A1A] bg-[#1A1A1A] text-[#F8F6F0]" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="font-['Cormorant_Garamond'] text-3xl font-bold italic text-[#E9C46A]" data-testid="footer-brand">
              Experimental Elaichi
            </h3>
            <p className="font-['Manrope'] text-sm text-[#F8F6F0]/70 leading-relaxed max-w-xs">
              A curated journal of experimental Indian recipes where tradition dances with bold creativity.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-['Outfit'] text-sm font-bold uppercase tracking-[0.2em] text-[#E76F51]">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="font-['Manrope'] text-sm text-[#F8F6F0]/70 hover:text-[#E9C46A] transition-colors" data-testid="footer-link-recipes">
                  All Recipes
                </a>
              </li>
              <li>
                <a href="/#recipes" className="font-['Manrope'] text-sm text-[#F8F6F0]/70 hover:text-[#E9C46A] transition-colors" data-testid="footer-link-browse">
                  Browse by Category
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-['Outfit'] text-sm font-bold uppercase tracking-[0.2em] text-[#E76F51]">
              About
            </h4>
            <p className="font-['Manrope'] text-sm text-[#F8F6F0]/70 leading-relaxed">
              Every recipe here is an experiment &mdash; a blend of familiar Indian flavors with unexpected techniques and ingredients. Some work beautifully, all taste amazing.
            </p>
          </div>
        </div>

        <div className="border-t border-[#F8F6F0]/20 mt-12 pt-8 text-center">
          <p className="font-['Manrope'] text-xs text-[#F8F6F0]/50" data-testid="footer-copyright">
            Experimental Elaichi &mdash; Where every dish tells a story of flavors reimagined.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
