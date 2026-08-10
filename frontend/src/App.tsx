import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const App = () => {

  interface SensorData {
    temperatura: number;
    humedad_aire: number;
    humedad_suelo: number;
  }
   // ✅ Declaración correcta de los estados
   const [data, setData] = useState<SensorData[]>([]); // 🔹 SE DEJA SOLO UNA VEZ
   const [loading, setLoading] = useState(true);
   const isMobile = useMediaQuery("(max-width:600px)"); // 📱 Detecta si es móvil

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<SensorData[]>("/api/get-sensor-data");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px", padding: isMobile ? "10px" : "20px" }}>
      {/* Título con animación de entrada */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          📊 Dashboard de Sensores
        </Typography>
      </motion.div>

      {loading ? (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "200px" }}>
        <CircularProgress />
      </Grid>
      ) : data.length === 0 ? (
      <Typography variant="h6" align="center" color="error">
        No hay datos disponibles.
      </Typography>
      ) : (
        <>
          {/* 🔹 Tarjetas de Datos Responsivas con Animación */}
          <Grid container spacing={2} justifyContent="center">
            {[
              { label: "🌡 Temperatura", value: data[0]?.temperatura ?? "N/A", color: "error", bg: "#ffe5e5" },
              { label: "💧 Humedad del Aire", value: data[0]?.humedad_aire ?? "N/A", color: "primary", bg: "#e0f7fa" },
              { label: "🌱 Humedad del Suelo", value: data[0]?.humedad_suelo ?? "N/A", color: "success", bg: "#e8f5e9" },
            ].map((sensor, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card sx={{ bgcolor: sensor.bg, textAlign: "center", padding: "10px" }}>
                    <CardContent>
                      <Typography variant="h6" color={sensor.color}>
                        {sensor.label}
                      </Typography>
                      <Typography variant={isMobile ? "h5" : "h4"}>
                        {sensor.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* 🔹 Gráfico con Transiciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card sx={{ marginTop: "20px", padding: "20px", boxShadow: 3 }}>
              <Typography variant="h6" align="center" gutterBottom>
                📈 Historial de Sensores
              </Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={{ fill: "gray" }} hide={isMobile} />
                  <YAxis tick={{ fill: "gray" }} />
                  <Tooltip contentStyle={{ backgroundColor: "black", borderRadius: "10px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="temperatura" stroke="#FF0000" name="Temperatura (°C)" />
                  <Line type="monotone" dataKey="humedad_aire" stroke="#0000FF" name="Humedad del Aire (%)" />
                  <Line type="monotone" dataKey="humedad_suelo" stroke="#00FF00" name="Humedad del Suelo" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </>
      )}
    </Container>
  );
};

export default App;
