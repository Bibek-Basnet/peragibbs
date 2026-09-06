import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

/**
 * Chrome for the public marketing site. The admin panel sits outside this
 * group so it does not inherit the site header and footer.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
