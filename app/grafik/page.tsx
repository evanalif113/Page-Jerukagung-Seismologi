"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { fetchSensorData } from "@/lib/fetchSensorData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

export default function GrafikPage() {
  // State for data
  const [timestamps, setTimestamps] = useState<string[]>([])
  const [temperatures, setTemperatures] = useState<number[]>([])
  const [humidity, setHumidity] = useState<number[]>([])
  const [pressure, setPressure] = useState<number[]>([])
  const [dew, setDew] = useState<number[]>([])
  const [volt, setVolt] = useState<number[]>([])

  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sensorId, setSensorId] = useState("id-03")
  const [dataPoints, setDataPoints] = useState(60) // Default to 1 hour (60 minutes)
  const [mounted, setMounted] = useState(false)

  // Fetch data from Firebase
  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await fetchSensorData(sensorId, dataPoints)

      if (data.timestamps.length > 0) {
        setTimestamps(data.timestamps)
        setTemperatures(data.temperatures)
        setHumidity(data.humidity)
        setPressure(data.pressure)
        setDew(data.dew)
        setVolt(data.volt)
        setError(null)
      } else {
        // Reset data jika tidak ada
        setTimestamps([])
        setTemperatures([])
        setHumidity([])
        setPressure([])
        setDew([])
        setVolt([])
        setError("Tidak ada data yang tersedia untuk periode ini.")
      }
    } catch (err) {
      console.error("Error fetching data: ", err)
      setError("Gagal mengambil data.")
    } finally {
      setLoading(false)
    }
  }

  // Initialize component
  useEffect(() => {
    setMounted(true)
    fetchData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [sensorId, dataPoints])

  // Don't render Plotly on server
  if (!mounted) return null

  // Common layout settings for charts
  const commonLayout = {
    autosize: true,
    margin: { l: 60, r: 40, t: 40, b: 60 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: {
      family: "Roboto, sans-serif",
      color: "#64748b",
    },
    xaxis: {
      gridcolor: "rgba(203, 213, 225, 0.2)",
      title: {
        text: "Waktu (HH:MM:SS)",
        font: { size: 14, color: "#475569" },
      },
    },
    yaxis: {
      gridcolor: "rgba(203, 213, 225, 0.2)",
      title: { font: { size: 14, color: "#475569" } },
    },
    legend: {
      orientation: "h",
      y: -0.3,
      yanchor: 'top',
      font: { size: 12 },
    },
    hovermode: "x unified", // Peningkatan UX
  }

  // Chart configurations
  const temperatureConfig = {
    data: [{
      x: timestamps,
      y: temperatures,
      type: "scatter",
      mode: "lines+markers",
      name: "Suhu Lingkungan (°C)",
      line: { color: "#ef4444" }, // Warna merah
    }],
    layout: {
      ...commonLayout,
      title: { text: "Suhu Lingkungan (°C)", font: { size: 16 } },
      yaxis: { ...commonLayout.yaxis, title: { ...commonLayout.yaxis.title, text: "Suhu (°C)" } },
    },
  }

  const humidityConfig = {
    data: [{
      x: timestamps,
      y: humidity,
      type: "scatter",
      mode: "lines+markers",
      name: "Kelembapan Relatif (%)",
      line: { color: "#3b82f6" }, // Warna biru
    }],
    layout: {
      ...commonLayout,
      title: { text: "Kelembapan Relatif (%)", font: { size: 16 } },
      yaxis: { ...commonLayout.yaxis, title: { ...commonLayout.yaxis.title, text: "Kelembapan (%)" } },
    },
  }

  const pressureConfig = {
    data: [{
      x: timestamps,
      y: pressure,
      type: "scatter",
      mode: "lines+markers",
      name: "Tekanan Udara (hPa)",
      line: { color: "#10b981" }, // Warna hijau
    }],
    layout: {
      ...commonLayout,
      title: { text: "Tekanan Udara (hPa)", font: { size: 16 } },
      yaxis: { ...commonLayout.yaxis, title: { ...commonLayout.yaxis.title, text: "Tekanan (hPa)" } },
    },
  }

  // Komponen pembungkus Card untuk grafik agar tidak repetitif
  const ChartCard = ({ config }: { config: { data: any[], layout: any }}) => (
    <Card>
      <CardContent className="pt-6">
        <Plot
          data={config.data}
          layout={config.layout}
          config={{ responsive: true, displayModeBar: false }} // displayModeBar: false untuk UI lebih bersih
          style={{ width: "100%", height: "400px" }}
        />
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-primary-700 dark:text-primary-300 mb-2">Grafik Data Cuaca</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Visualisasi data cuaca dari stasiun pemantauan Jerukagung Meteorologi.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800 border-b">
          <CardTitle className="text-xl">Pengaturan Grafik</CardTitle>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Select value={sensorId} onValueChange={setSensorId}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Pilih Sensor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id-01">Sensor 1</SelectItem>
                <SelectItem value="id-02">Sensor 2</SelectItem>
                <SelectItem value="id-03">Sensor 3</SelectItem>
                <SelectItem value="id-04">Sensor 4</SelectItem>
                <SelectItem value="id-05">Sensor 5</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dataPoints.toString()} onValueChange={(value) => setDataPoints(Number.parseInt(value))}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Interval Waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 menit terakhir</SelectItem>
                <SelectItem value="60">1 jam terakhir</SelectItem>
                <SelectItem value="120">2 jam terakhir</SelectItem>
                <SelectItem value="240">4 jam terakhir</SelectItem>
                <SelectItem value="720">12 jam terakhir</SelectItem>
                <SelectItem value="1440">24 jam terakhir</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh data</span>
            </Button>

            <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300">
              <Download className="h-4 w-4 mr-1" /> Unduh Data
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      {/* PERUBAHAN UTAMA: DARI TABS MENJADI STACKED LAYOUT */}
      {loading ? (
        // Tampilan loading terpusat
        <div className="flex justify-center items-center h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
          <p className="ml-4 text-gray-500">Memuat data...</p>
        </div>
      ) : error ? (
        // Tampilan error
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">{error}</div>
      ) : (
        // Layout bertumpuk untuk semua grafik
        <div className="space-y-6">
          <ChartCard config={temperatureConfig} />
          <ChartCard config={humidityConfig} />
          <ChartCard config={pressureConfig} />
          
          {/* Anda bisa menambahkan grafik lain di sini jika diperlukan, contoh: */}
          {/* <ChartCard config={dewConfig} /> */}
          {/* <ChartCard config={voltConfig} /> */}
        </div>
      )}
    </div>
  )
}