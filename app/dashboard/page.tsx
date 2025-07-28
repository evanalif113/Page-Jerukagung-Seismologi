"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Beranda</h2>
          <p className="text-muted-foreground">Ringkasan sistem monitoring cuaca dan hidrologi</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Placeholder</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Halaman dashboard ini belum menampilkan data dinamis.</p>
          <p>Silakan tambahkan integrasi data jika diperlukan.</p>
        </CardContent>
      </Card>
    </div>
  )
}