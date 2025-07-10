"use client"

import { useState, useEffect } from "react"
// Import fetchSensorData from the library
import { fetchSensorData, SensorData } from "@/lib/fetchSensorData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select components
// Import icons from lucide-react, including those for charts
import { RefreshCw, Download, ThermometerSun, Droplets, Gauge } from "lucide-react"
// Import ChartComponent
import ChartComponent from "@/components/ChartComponent"

// Define the structure for table data
interface WeatherEntry {
  date: string
  temperature: number
  humidity: number
  pressure: number
  dew: number
  volt: number
}

export default function DataPage() {
  // State for table data
  const [weatherData, setWeatherData] = useState<WeatherEntry[]>([])

  // State for chart data (moved from grafik/page.tsx)
  const [timestamps, setTimestamps] = useState<string[]>([])
  const [temperatures, setTemperatures] = useState<number[]>([])
  const [humidity, setHumidity] = useState<number[]>([])
  const [pressure, setPressure] = useState<number[]>([])
  const [dew, setDew] = useState<number[]>([])
  const [volt, setVolt] = useState<number[]>([])

  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // State for tabs
  const [activeTab, setActiveTab] = useState<'table' | 'grafik'>('table') // 'table' or 'grafik'

  // State for sensor and data points (moved from grafik/page.tsx, now global)
  const [sensorId, setSensorId] = useState("id-03")
  const [dataPoints, setDataPoints] = useState(30) // Default for table, will be overridden by select for charts

  // Fetch data from Firebase (updated to populate both table and chart states)
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null) // Clear previous errors

      // Use fetchSensorData from the library
      // Fetch data based on current sensorId and dataPoints state
      const data: SensorData = await fetchSensorData(sensorId, dataPoints)

      if (data.timestamps.length > 0) {
        // Populate chart data states
        setTimestamps(data.timestamps)
        setTemperatures(data.temperatures)
        setHumidity(data.humidity)
        setPressure(data.pressure)
        setDew(data.dew)
        setVolt(data.volt)

        // Transform the fetched data into the desired table format
        const dataArray: WeatherEntry[] = data.timestamps.map((timestamp, index) => ({
          date: timestamp, // Use the formatted timestamp from fetchSensorData
          temperature: data.temperatures[index],
          humidity: data.humidity[index],
          pressure: data.pressure[index],
          dew: data.dew[index],
          volt: data.volt[index],
        }))

        // Reverse array to show newest data first for the table
        setWeatherData(dataArray.reverse())
        setError(null)
      } else {
        // Set empty arrays and error if no data
        setTimestamps([])
        setTemperatures([])
        setHumidity([])
        setPressure([])
        setDew([])
        setVolt([])
        setWeatherData([])
        setError("Tidak ada data yang tersedia untuk periode ini.")
      }
    } catch (err) {
      console.error("Error fetching data: ", err)
      setError("Gagal mengambil data.")
      setWeatherData([]) // Clear data on error
      setTimestamps([])
      setTemperatures([])
      setHumidity([])
      setPressure([])
      setDew([])
      setVolt([])
    } finally {
      setLoading(false)
    }
  }

  // Initialize component and refresh data
  useEffect(() => {
    fetchData()

    // Refresh data every minute
    const interval = setInterval(fetchData, 60000)

    return () => clearInterval(interval)
  }, [sensorId, dataPoints]) // Depend on sensorId and dataPoints

  // Common layout settings for charts (moved from grafik/page.tsx)
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
        font: { size: 14, color: "#475569" },
      },
      nticks: 10, // Adjust this number to control density
    },
    yaxis: {
      gridcolor: "rgba(203, 213, 225, 0.2)",
      title: { font: { size: 14, color: "#475569" } },
      nticks: 10, // Adjust this number to control density
    },
    legend: {
      orientation: "h",
      y: -0.3,
      yanchor: 'top',
      font: { size: 12 },
    },
    hovermode: "x unified", // Peningkatan UX
  }

  // Array of chart configurations (moved from grafik/page.tsx)
  const chartConfigs = [
    {
      icon: ThermometerSun,
      colorClass: "text-red-500", // Tailwind class for red
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
    },
    {
      icon: Droplets,
      colorClass: "text-blue-500", // Tailwind class for blue
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
    },
    {
      icon: Gauge,
      colorClass: "text-green-500", // Tailwind class for green
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
    },
    // Add other chart configs here if needed (Dew Point, Voltage)
    // {
    //   icon: ThermometerSun, // Or another appropriate icon
    //   colorClass: "text-yellow-500",
    //   data: [{ x: timestamps, y: dew, type: "scatter", mode: "lines+markers", name: "Titik Embun (°C)", line: { color: "#f59e0b" } }],
    //   layout: { ...commonLayout, title: { text: "Titik Embun (°C)", font: { size: 16 } }, yaxis: { ...commonLayout.yaxis, title: { ...commonLayout.yaxis.title, text: "Titik Embun (°C)" } } },
    // },
    // {
    //   icon: Gauge, // Or another appropriate icon like Battery
    //   colorClass: "text-indigo-500",
    //   data: [{ x: timestamps, y: volt, type: "scatter", mode: "lines+markers", name: "Tegangan Baterai (V)", line: { color: "#6366f1" } }],
    //   layout: { ...commonLayout, title: { text: "Tegangan Baterai (V)", font: { size: 16 } }, yaxis: { ...commonLayout.yaxis, title: { ...commonLayout.yaxis.title, text: "Tegangan (V)" } } },
    // },
  ];


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-primary-700 dark:text-primary-300 mb-2">Data Cuaca</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Data pengamatan cuaca terkini dari stasiun pemantauan Jerukagung Meteorologi.
        </p>
      </div>

      {/* Global Controls Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800 border-b">
          <CardTitle className="text-xl">Pengaturan Data & Grafik</CardTitle>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
             {/* Sensor Select */}
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

            {/* Data Points Select */}
            <Select value={dataPoints.toString()} onValueChange={(value) => setDataPoints(Number.parseInt(value))}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Jumlah Data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 data terakhir</SelectItem> {/* Default for table */}
                <SelectItem value="30">30 data terakhir</SelectItem>
                <SelectItem value="60">60 data terakhir (1 jam)</SelectItem>
                <SelectItem value="120">120 data terakhir (2 jam)</SelectItem>
                <SelectItem value="240">240 data terakhir (4 jam)</SelectItem>
                <SelectItem value="720">720 data terakhir (12 jam)</SelectItem>
                <SelectItem value="1440">1440 data terakhir (24 jam)</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh data</span>
            </Button>

            {/* Download Button */}
            <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300">
              <Download className="h-4 w-4 mr-1" /> Unduh Data
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'table'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('table')}
        >
          Data Tabel
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'grafik'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('grafik')}
        >
          Grafik
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        // Centralized loading display
        <div className="flex justify-center items-center h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
          <p className="ml-4 text-gray-500">Memuat data...</p>
        </div>
      ) : error ? (
        // Error display
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">{error}</div>
      ) : (
        <>
          {/* Data Table Content */}
          {activeTab === 'table' && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 border-b">Waktu</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 border-b">Suhu (°C)</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 border-b">Kelembapan (%)</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 border-b">Tekanan (hPa)</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 border-b">Titik Embun (°C)</th>
                        <th className="p-4 font-medium text-gray-600 dark:text-gray-300 border-b">Tegangan (V)</th>
                      </tr>
                    </thead>
                    <tbody id="datalogger">
                      {weatherData.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-600 dark:text-gray-300">
                            Tidak ada data yang tersedia.
                          </td>
                        </tr>
                      ) : (
                        // Use the transformed weatherData array
                        weatherData.map((entry, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
                          >
                            <td className="p-4 border-t">{entry.date}</td>
                            <td className="p-4 border-t">{entry.temperature}</td>
                            <td className="p-4 border-t">{entry.humidity}</td>
                            <td className="p-4 border-t">{entry.pressure}</td>
                            <td className="p-4 border-t">{entry.dew}</td>
                            <td className="p-4 border-t">{entry.volt}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grafik Content (moved from grafik/page.tsx) */}
          {activeTab === 'grafik' && (
             <div className="space-y-6">
              {chartConfigs.map((config, index) => {
                const IconComponent = config.icon; // Get the icon component
                return (
                  <Card key={index}>
                    {/* Add CardHeader for each chart */}
                    <CardHeader className="flex flex-row items-center gap-3 bg-gray-50 dark:bg-gray-800 border-b py-3 px-6">
                      {/* Add the icon with dynamic color class */}
                      {IconComponent && <IconComponent className={`h-5 w-5 ${config.colorClass}`} />}
                      {/* Use the title from the layout */}
                      <CardTitle className="text-lg">{config.layout.title.text}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ChartComponent data={config.data} layout={config.layout} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
