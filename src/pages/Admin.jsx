import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const sizes = ["S", "M", "L", "XL", "XXL"];

const Admin = () => {
  const { refreshProducts } = useContext(ShopContext);
  const [adminEmail, setAdminEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState(["M"]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
    const response = await fetch("/api/admin/products");
    const result = await response.json();

    if (response.status === 401) {
      navigate("/admin/login", { replace: true });
      return false;
    }
    if (!response.ok) {
      throw new Error(result.error || "មិនអាចទាញយកបញ្ជីទំនិញបានទេ។");
    }

    setProducts(result);
    return true;
  }, [navigate]);

  useEffect(() => {
    const loadAdminPage = async () => {
      try {
        const response = await fetch("/api/admin/session");
        if (response.status === 401) {
          navigate("/admin/login", { replace: true });
          return;
        }
        if (!response.ok) {
          throw new Error("មិនអាចផ្ទៀងផ្ទាត់គណនី Admin បានទេ។");
        }

        const session = await response.json();
        setAdminEmail(session.email);
        await loadProducts();
      } catch (loadError) {
        setError(loadError.message || "មិនអាចភ្ជាប់ទៅកាន់ server បានទេ។");
      } finally {
        setLoading(false);
      }
    };

    loadAdminPage();
  }, [loadProducts, navigate]);

  const toggleSize = (size) => {
    setSelectedSizes((current) => current.includes(size)
      ? current.filter((item) => item !== size)
      : [...current, size]);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    formData.set("sizes", JSON.stringify(selectedSizes));

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.status === 401) {
        navigate("/admin/login", { replace: true });
        return;
      }
      if (!response.ok) {
        throw new Error(result.error || "មិនអាចបន្ថែមទំនិញបានទេ។");
      }

      form.reset();
      setSelectedSizes(["M"]);
      toast.success("បានបន្ថែមទំនិញ និងរក្សាទុកក្នុង SQL រួចរាល់");
      await Promise.all([loadProducts(), refreshProducts()]);
    } catch (submitError) {
      setError(submitError.message || "មិនអាចភ្ជាប់ទៅកាន់ server បានទេ។");
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("មិនអាចចាកចេញពីគណនីបានទេ។");
      }
      navigate("/admin/login", { replace: true });
    } catch (logoutError) {
      toast.error(logoutError.message || "មិនអាចភ្ជាប់ទៅកាន់ server បានទេ។");
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-gray-500">កំពុងផ្ទុក...</p>;
  }

  return (
    <main className="border-t py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">គ្រប់គ្រងទំនិញ</h1>
          <p className="mt-1 text-sm text-gray-500">{adminEmail}</p>
        </div>
        <button onClick={logout} className="border rounded-full px-5 py-2 text-sm hover:bg-gray-50">
          ចាកចេញ
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        onSubmit={onSubmit}
        className="max-w-3xl rounded-2xl border bg-white p-6 sm:p-8 space-y-5"
      >
        <h2 className="text-lg font-semibold">បន្ថែមសម្លៀកបំពាក់ថ្មី</h2>

        <label className="block text-sm font-medium">
          ឈ្មោះទំនិញ
          <input
            name="name"
            maxLength="120"
            required
            className="mt-2 w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
          />
        </label>

        <label className="block text-sm font-medium">
          ព័ត៌មានលម្អិត
          <textarea
            name="description"
            maxLength="1000"
            required
            rows="3"
            className="mt-2 w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            តម្លៃ ($)
            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              required
              className="mt-2 w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </label>
          <label className="block text-sm font-medium">
            រូបភាព (JPG, PNG, WebP; អតិបរមា 5MB)
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="mt-2 w-full border rounded-lg px-3 py-2.5 text-sm"
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            ប្រភេទអ្នកពាក់
            <select
              name="category"
              defaultValue="Women"
              className="mt-2 w-full border rounded-lg px-4 py-3 bg-white"
            >
              <option value="Men">បុរស (Men)</option>
              <option value="Women">ស្ត្រី (Women)</option>
              <option value="Kids">កុមារ (Kids)</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            ប្រភេទសម្លៀកបំពាក់
            <select
              name="subCategory"
              defaultValue="Topwear"
              className="mt-2 w-full border rounded-lg px-4 py-3 bg-white"
            >
              <option value="Topwear">អាវ (Topwear)</option>
              <option value="Bottomwear">ខោ (Bottomwear)</option>
              <option value="Winterwear">សម្លៀកបំពាក់រដូវរងា (Winterwear)</option>
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium mb-2">ទំហំ</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <label key={size} className={`cursor-pointer rounded-lg border px-4 py-2 text-sm ${selectedSizes.includes(size) ? "border-black bg-black text-white" : ""}`}>
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => toggleSize(size)}
                  className="sr-only"
                />
                {size}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="bestseller" value="true" />
          ដាក់ជាទំនិញលក់ដាច់ (Best seller)
        </label>

        <button
          disabled={submitting || selectedSizes.length === 0}
          className="rounded-full bg-black px-7 py-3 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "កំពុងរក្សាទុក..." : "រក្សាទុកទំនិញ"}
        </button>
      </form>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-5">ទំនិញដែល Admin បានបន្ថែម ({products.length})</h2>
        {products.length === 0 ? (
          <p className="text-sm text-gray-500">មិនទាន់មានទំនិញបន្ថែមទេ។</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product._id} className="overflow-hidden rounded-xl border">
                <img src={product.image[0]} alt={product.name} className="aspect-[3/4] w-full object-cover" />
                <div className="p-3">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.category} · {product.subCategory} · ${product.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Admin;
