"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, query, orderByKey, limitToLast, get } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"

export default function DataPage() {
  const [weatherData, setWeatherData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      const dataRef = query(ref(database, "auto_weather_stat/id-03/data"), orderByKey(), limitToLast(15))

      const snapshot = await get(dataRef)
      if (snapshot.exists()) {
        const dataArray: any[] = []

        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val()
          const timeFormatted = new Date(data.timestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })

          dataArray.push({
            date: timeFormatted,
            temperature: data.temperature,
            humidity: data.humidity,
            pressure: data.pressure,
            dew: data.dew,
            volt: data.volt,
          })
        })

        // Reverse array to show newest data first
        setWeatherData(dataArray.reverse())
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

  useEffect(() => {
    loadWeatherData()

    // Refresh data every minute
    const interval = setInterval(loadWeatherData, 60000)

    return () => clearInterval(interval)
  }, [])

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
