const LoadingSpinner = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
    <div className="w-16 h-16 border-8 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-4 text-gray-700 text-2xl">Memuat Halaman...</p>
  </div>
);

export default function Loading() {
  // Tampilkan spinner Anda sebagai fallback saat halaman memuat.
  // Anda bisa membuat UI yang lebih kompleks seperti skeleton layout di sini.
  return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
          <LoadingSpinner />
      </div>
  );
}