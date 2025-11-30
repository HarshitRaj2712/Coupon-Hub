import React, { useState, useEffect } from "react";
import dummyCoupons from "../data/dummyCoupons";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SecondaryNav() {
  const navigate = useNavigate();

  const stores = Array.from(new Set(dummyCoupons.map((c) => c.store))).sort();
  const categories = Array.from(
    new Set(dummyCoupons.map((c) => c.category || "General"))
  ).sort();

  const [openStore, setOpenStore] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const [dealOfDay, setDealOfDay] = useState(null);

  useEffect(() => {
    const activeDeals = dummyCoupons.filter(
      (c) => c.verified && new Date(c.expiryDate) > new Date()
    );

    setDealOfDay(activeDeals[0] || dummyCoupons[0]);
  }, []);

  const applyFilter = (type, value) => {
    window.dispatchEvent(
      new CustomEvent("filters", {
        detail: { [type]: value },
      })
    );
    navigate("/");
  };

  return (
    <div className="bg-gray-100 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* STORE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setOpenStore(!openStore)}
              className="flex items-center gap-1 text-gray-700 font-medium hover:text-indigo-600"
            >
              Stores <ChevronDown size={16} />
            </button>

            {openStore && (
              <div className="absolute mt-2 w-40 bg-white shadow-lg border rounded z-20">
                {stores.map((store) => (
                  <div
                    key={store}
                    onClick={() => {
                      setOpenStore(false);
                      applyFilter("store", store);
                    }}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    {store}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CATEGORY DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setOpenCategory(!openCategory)}
              className="flex items-center gap-1 text-gray-700 font-medium hover:text-indigo-600"
            >
              Categories <ChevronDown size={16} />
            </button>

            {openCategory && (
              <div className="absolute mt-2 w-40 bg-white shadow-lg border rounded z-20">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setOpenCategory(false);
                      applyFilter("category", cat);
                    }}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* DEAL OF THE DAY */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("showDeal", {
                  detail: { couponId: dealOfDay?._id },
                })
              );
              navigate("/");
            }}
            className="text-orange-600 font-semibold hover:text-orange-700"
          >
            Deal of the Day
          </button>

          {/* ADD COUPON */}
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-1 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition"
          >
            + Add Coupon
          </button>
        </div>
      </div>
    </div>
  );
}
