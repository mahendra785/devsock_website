"use client";
import Page1 from "./screens/page1";
import Page2 from "./screens/page2";
import Page3 from "./screens/page3";
const Page = () => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden scroll-smooth">
      <Page1 />
      <Page2 />
      <Page3 />
    </div>
  );
};

export default Page;
