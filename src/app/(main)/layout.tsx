import Header from "@/components/generic/Header";
import Footer from "@/components/generic/Footer";
import { getImageWithLabelByUID } from "@/cms/image-with-label";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {
  const headerLogo = await getImageWithLabelByUID("header-logo");

  return (
    <>
      <Header logo={headerLogo} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;

