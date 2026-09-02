import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-12 bg-muted/40">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">BATHYCAT</h3>
          <p className="text-sm text-muted-foreground">
            Survey | Innovate | Explore. Customizable survey boats for professionals.
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-4">Products</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/products">Bathycat Professional</Link></li>
            <li><Link href="/products">Bathycat Survey</Link></li>
            <li><Link href="/configurator">Configurator</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/downloads">Downloads</Link></li>
            <li><Link href="/warranty">Warranty</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Bathycat. All rights reserved.
      </div>
    </footer>
  );
}
