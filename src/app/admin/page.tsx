import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-white/60">Manage your portfolio content.</p>
        </header>

        <AdminDashboard />
      </div>
    </div>
  );
}
