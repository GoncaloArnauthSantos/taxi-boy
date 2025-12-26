
import BannerCarousel from "./banner/BannerCarousel";
import type { BannerEvent } from "@/cms/types";
import DefaultBanner from "./banner/DefaultBanner";

type Props = {
  events?: BannerEvent[];
};

const Banner = ({ events = [] }: Props) => {
  if (events.length > 0) {
    return <BannerCarousel events={events} />;
  }

  return <DefaultBanner />;
};

export default Banner;
