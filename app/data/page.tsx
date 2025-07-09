"use client"

import { useState, useEffect } from "react"
// Remove local firebase imports
// import { database } from "@/lib/firebaseConfig"
// import { ref, query, orderByKey, limitToLast, get } from "firebase/database"
// Import fetchSensorData from the library
import { fetchSensorData, SensorData } from "@/lib/fetchSensorData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"

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
  // Update state type to match the desired table data structure
  const [weatherData, setWeatherData] = useState<WeatherEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      setError(null) // Clear previous errors

      // Use fetchSensorData from the library
      // Fetch the last 15 data points for sensor id-03
      const data: SensorData = await fetchSensorData("id-03", 15)

      if (data.timestamps.length > 0) {
        // Transform the fetched data into the desired table format
        const dataArray: WeatherEntry[] = data.timestamps.map((timestamp, index) => ({
          date: timestamp, // Use the formatted timestamp from fetchSensorData
          temperature: data.temperatures[index],
          humidity: data.humidity[index],
          pressure: data.pressure[index],
          dew: data.dew[index],
          volt: data.volt[index],
        }))

        // Reverse array to show newest data first, matching original logic
        setWeatherData(dataArray.reverse())
      } else {
        // Set empty array and error if no data
        setWeatherData([])
        setError("Tidak ada data yang tersedia.")
      }
    } catch (err) {
      console.error("Error fetching data: ", err)
      setError("Gagal mengambil data.")
      setWeatherData([]) // Clear data on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeatherData()

    // Refresh data every minute
    const interval = setInterval(loadWeatherData, 60000)

    return () => clearInterval(interval)
  }, []) // Empty dependency array means this effect runs once on mount

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-primary-700 dark:text-primary-300 mb-2">Data Cuaca</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Data pengamatan cuaca terkini dari stasiun pemantauan Jerukagung Meteorologi.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 border-b">
          <CardTitle className="text-xl">Data Cuaca Terkini</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300">
              <Download className="h-4 w-4 mr-1" /> Unduh CSV
            </Button>
            <Button variant="outline" size="icon" onClick={loadWeatherData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh data</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
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
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary-500" />
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Memuat data...</p>
                      </td>
                    </tr>
                  ) : weatherData.length === 0 ? (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
