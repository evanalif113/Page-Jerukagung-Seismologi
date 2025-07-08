import { database, ref, query, orderByKey, limitToLast, get } from "./firebaseConfig"

export interface SensorData {
  timestamps: string[]
  temperatures: number[]
  humidity: number[]
  pressure: number[]
  dew: number[]
  volt: number[]
}

export const fetchSensorData = async (sensorId: string, dataPoints: number): Promise<SensorData> => {
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
      const timeFormatted = new Date(data.timestamp * 1000).toLocaleTimeString("id-ID", {
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

    return {
      timestamps: newTimestamps,
      temperatures: newTemperatures,
      humidity: newHumidity,
      pressure: newPressure,
      dew: newDew,
      volt: newVolt,
    }
  } else {
    // Return empty arrays if no data is found
    return {
      timestamps: [],
      temperatures: [],
      humidity: [],
      pressure: [],
      dew: [],
      volt: [],
    }
  }
}
