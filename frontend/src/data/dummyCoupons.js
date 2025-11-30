const dummyCoupons = [
  {
    _id: "1",
    code: "SAVE20",
    title: "20% Off on Electronics",
    store: "Amazon",
    discountType: "percent",
    discountValue: 20,
    expiryDate: "2025-01-31",
    verified: true
  },
  {
    _id: "2",
    code: "FLAT150",
    title: "₹150 Off on Fashion",
    store: "Myntra",
    discountType: "flat",
    discountValue: 150,
    expiryDate: "2025-02-15",
    verified: false
  },
  {
    _id: "3",
    code: "TRAVEL50",
    title: "50% Off on Bus Tickets",
    store: "Redbus",
    discountType: "percent",
    discountValue: 50,
    expiryDate: "2025-03-01",
    verified: true
  },
  {
    _id: "4",
    code: "FOOD99",
    title: "Flat ₹99 Meal Combo",
    store: "Swiggy",
    discountType: "flat",
    discountValue: 99,
    expiryDate: "2025-02-25",
    verified: true
  },
  {
    _id: "5",
    code: "FREEDEL",
    title: "Free Delivery on All Orders",
    store: "Zomato",
    discountType: "free-shipping",
    discountValue: 0,
    expiryDate: "2025-01-20",
    verified: false
  }
];

export default dummyCoupons;
