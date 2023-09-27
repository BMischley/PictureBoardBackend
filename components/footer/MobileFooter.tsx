import React from "react";
import Link from "next/link";

const productLinks = [
  "Home",
  "Get Featured",
  "Dorm Essentials",
  "College Apparel",
].map((title) => (
  <li key={title}>
    <Link href="" className="flex text-[#838992]">
      {title}
    </Link>
  </li>
));
const supportLinks = ["FAQ", "Blog", "Check Queue Position", "Contact"].map(
  (title) => (
    <li key={title}>
      <Link href="" className="flex text-[#838992]">
        {title}
      </Link>
    </li>
  )
);
const legalLinks = ["Privacy Policy", "Terms Of Service", "Sitemap"].map(
  (title) => (
    <li key={title}>
      <Link href="" className="flex text-[#838992]">
        {title}
      </Link>
    </li>
  )
);

function MobileFooter() {
  return (
    <div>
      <div className="join join-vertical w-full">
        <div className="collapse collapse-arrow join-item border border-base-300 ">
          <input type="checkbox" name="footer" />
          <div className="collapse-title text-base font-medium">Product</div>
          <div className="collapse-content">
            <ul>{productLinks}</ul>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border border-base-300">
          <input type="checkbox" name="footer" />
          <div className="collapse-title text-base font-medium">Support</div>
          <div className="collapse-content">
            <div>
              {" "}
              <ul>{supportLinks}</ul>
            </div>
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border border-base-300">
          <input type="checkbox" name="footer" />
          <div className="collapse-title text-base font-medium">Legal</div>
          <div className="collapse-content">
            <ul>{legalLinks}</ul>
          </div>
        </div>
      </div>
      
      <p className=" my-auto py-[24px] pt-[12px] pb-[32px] text-[#5E6672] text-sm align-middle text-center">
        Copyright © 2023 PictureBoard.AI, LLC. All Rights Reserved.
      </p>
    </div>
  );
}

export default MobileFooter;
