export const ORDER_STATUSES = ["Pending", "Processing", "Completed", "Cancelled"];
export const orders = [
  { id: "ORD-1001", customer: "Ali Khan", products: 3, total: 249.5, status: "Completed", date: "2026-09-20" },
  { id: "ORD-1002", customer: "Sara Ahmed", products: 1, total: 59.99, status: "Pending", date: "2026-09-22" },
  { id: "ORD-1003", customer: "Usman Raza", products: 2, total: 120, status: "Processing", date: "2026-09-24" },
  { id: "ORD-1004", customer: "Hina Malik", products: 5, total: 410.25, status: "Cancelled", date: "2026-09-25" },
  { id: "ORD-1005", customer: "Bilal Sheikh", products: 1, total: 35, status: "Completed", date: "2026-09-27" },
];
export const users = [
  { id: 1, name: "Ali Khan", email: "ali@example.com", role: "Customer", status: "Active" },
  { id: 2, name: "Sara Ahmed", email: "sara@example.com", role: "Customer", status: "Active" },
  { id: 3, name: "Usman Raza", email: "usman@example.com", role: "Manager", status: "Inactive" },
  { id: 4, name: "Hina Malik", email: "hina@example.com", role: "Customer", status: "Active" },
  { id: 5, name: "Admin", email: "admin@example.com", role: "Administrator", status: "Active" },
];


export function resizeImage(file, maxSize = 600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
