"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { database } from "@/lib/firebase"
import { ref, query, orderByKey, limitToLast, get } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
      const dataRef = query(ref(database, `auto_weather_stat/${sensorId}/data`), orderByKey(), limitToLast(dataPoints))

      const snapshot = await get(dataRef)
      if (snapshot.exists()) {
        const newTimestamps: string[] = []
        const newTemperatures: number[] = []
        const newHumidity: number[] = []
        const newPressure: number[] = []
        const newDew: number[] = []
        const newVolt: number[] = []

        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val()
          const timeFormatted = new Date(data.timestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })

          newTimestamps.push(timeFormatted)
          newTemperatures.push(data.temperature)
          newHumidity.push(data.humidity)
          newPressure.push(data.pressure)
          newDew.push(data.dew)
          newVolt.push(data.volt)
        })

        setTimestamps(newTimestamps)
        setTemperatures(newTemperatures)
        setHumidity(newHumidity)
        setPressure(newPressure)
        setDew(newDew)
        setVolt(newVolt)
        setError(null)
      } else {
        setError("Tidak ada data yang tersedia.")
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
        font: {
          size: 14,
          color: "#475569",
        },
      },
    },
    yaxis: {
      gridcolor: "rgba(203, 213, 225, 0.2)",
      title: {
        font: {
          size: 14,
          color: "#475569",
        },
      },
    },
    legend: {
      orientation: "h",
      y: -0.2,
      font: {
        size: 12,
      },
    },
    hovermode: "closest",
  }

  // Chart configurations
  const temperatureConfig = {
    data: [
      {
        x: timestamps,
        y: temperatures,
        type: "scatter",
        mode: "lines+markers",
        name: "Suhu Lingkungan (°C)",
        line: { color: "#00a0e1" },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Suhu Lingkungan (°C)",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Suhu Lingkungan (°C)",
        },
      },
    },
  }

  const humidityConfig = {
    data: [
      {
        x: timestamps,
        y: humidity,
        type: "scatter",
        mode: "lines+markers",
        name: "Kelembapan Relatif (%)",
        line: { color: "#00548c" },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Kelembapan Relatif (%)",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Kelembapan Relatif (%)",
        },
      },
    },
  }

  const dewConfig = {
    data: [
      {
        x: timestamps,
        y: dew,
        type: "scatter",
        mode: "lines+markers",
        name: "Titik Embun (°C)",
        line: { color: "#0077b6" },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Titik Embun (°C)",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Titik Embun (°C)",
        },
      },
    },
  }

  const pressureConfig = {
    data: [
      {
        x: timestamps,
        y: pressure,
        type: "scatter",
        mode: "lines+markers",
        name: "Tekanan Udara (hPa)",
        line: { color: "#00548c" },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Tekanan Udara (hPa)",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Tekanan Udara (hPa)",
        },
      },
    },
  }

  const voltConfig = {
    data: [
      {
        x: timestamps,
        y: volt,
        type: "scatter",
        mode: "lines+markers",
        name: "Tegangan (V)",
        line: { color: "#00a0e1" },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Tegangan (V)",
        font: {
          size: 16,
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Tegangan (V)",
        },
      },
    },
  }

  const stackedConfig = {
    data: [
      {
        x: timestamps,
        y: temperatures,
        type: "scatter",
        mode: "markers",
        name: "Suhu",
        marker: { color: "#00a0e1" },
      },
      {
        x: timestamps,
        y: dew,
        type: "scatter",
        mode: "markers",
        name: "Titik Embun",
        marker: { color: "#0077b6" },
      },
    ],
    layout: {
      ...commonLayout,
      title: {
        text: "Scatter Suhu dan Titik Embun",
        font: {
          size: 16,
        },
      },
      xaxis: {
        ...commonLayout.xaxis,
        title: {
          ...commonLayout.xaxis.title,
          text: "Waktu",
        },
      },
      yaxis: {
        ...commonLayout.yaxis,
        title: {
          ...commonLayout.yaxis.title,
          text: "Suhu (°C)",
        },
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-primary-700 dark:text-primary-300 mb-2">Grafik Data Cuaca</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Visualisasi data cuaca dari stasiun pemantauan Jerukagung Meteorologi.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 border-b">
          <CardTitle className="text-xl">Pengaturan Grafik</CardTitle>
          <div className="flex items-center gap-4">
            <Select value={sensorId} onValueChange={setSensorId}>
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
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

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">{error}</div>
      ) : (
        <Tabs defaultValue="temperature" className="w-full">
          <TabsList className="mb-4 flex flex-wrap bg-gray-50 dark:bg-gray-800 p-1 rounded-md">
            <TabsTrigger value="temperature">Suhu</TabsTrigger>
            <TabsTrigger value="humidity">Kelembapan</TabsTrigger>
            <TabsTrigger value="pressure">Tekanan</TabsTrigger>
            <TabsTrigger value="dew">Titik Embun</TabsTrigger>
            <TabsTrigger value="volt">Tegangan</TabsTrigger>
            <TabsTrigger value="stacked">Suhu & Embun</TabsTrigger>
          </TabsList>

          <TabsContent value="temperature">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-[400px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : (
                  <Plot
                    data={temperatureConfig.data}
                    layout={temperatureConfig.layout}
                    config={{ responsive: true }}
                    style={{ width: "100%", height: "400px" }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="humidity">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-[400px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : (
                  <Plot
                    data={humidityConfig.data}
                    layout={humidityConfig.layout}
                    config={{ responsive: true }}
                    style={{ width: "100%", height: "400px" }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pressure">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-[400px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : (
                  <Plot
                    data={pressureConfig.data}
                    layout={pressureConfig.layout}
                    config={{ responsive: true }}
                    style={{ width: "100%", height: "400px" }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dew">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-[400px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : (
                  <Plot
                    data={dewConfig.data}
                    layout={dewConfig.layout}
                    config={{ responsive: true }}
                    style={{ width: "100%", height: "400px" }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volt">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-[400px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : (
                  <Plot
                    data={voltConfig.data}
                    layout={voltConfig.layout}
                    config={{ responsive: true }}
                    style={{ width: "100%", height: "400px" }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stacked">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-[400px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
                  </div>
                ) : (
                  <Plot
                    data={stackedConfig.data}
                    layout={stackedConfig.layout}
                    config={{ responsive: true }}
                    style={{ width: "100%", height: "400px" }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
