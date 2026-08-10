import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
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
import "./App.css";

const App = () => {
  interface SensorData {
    temperatura: number;
    humedad_aire: number;
    humedad_suelo: number;
  }

  // ✅ Declaración correcta de los estados (Lógica funcional preservada)
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

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

  const kpis = [
    {
      label: "TEMPERATURA",
      icon: "🌡",
      value: data[0]?.temperatura ?? "N/A",
      unit: "°C",
      sub: "Ambiente",
      color: "#fb923c",
    },
    {
      label: "HUMEDAD DEL AIRE",
      icon: "💧",
      value: data[0]?.humedad_aire ?? "N/A",
      unit: "%",
      sub: "Atmosférica",
      color: "#22d3ee",
    },
    {
      label: "HUMEDAD DEL SUELO",
      icon: "🌱",
      value: data[0]?.humedad_suelo ?? "N/A",
      unit: "ADC",
      sub: "Lectura analógica RAW",
      color: "#34d399",
    },
  ];

  return (
    <Container maxWidth={false} disableGutters>
      {/* 🔹 Header Principal del Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: "18px",
            borderBottom: "1px solid #263449",
            paddingBottom: "12px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: "6px",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "1.5px",
                color: "#38bdf8",
                textTransform: "uppercase",
              }}
            >
              IOT TELEMETRY
            </Typography>
            <Box
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: "20px",
                bgcolor: "rgba(56, 189, 248, 0.08)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                color: "#38bdf8",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              MVP IoT
            </Box>
          </Box>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{ fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.5px" }}
          >
            GeoEnergy Environmental Monitor
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", marginTop: "4px" }}>
            Monitoreo ambiental IoT en tiempo real
          </Typography>
        </Box>
      </motion.div>

      {loading ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "240px" }}
        >
          <CircularProgress sx={{ color: "#38bdf8" }} />
        </Grid>
      ) : data.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ color: "#fb923c", marginTop: "40px" }}>
          No hay datos disponibles.
        </Typography>
      ) : (
        <>
          {/* 🔹 Tarjetas KPI Técnicas */}
          <Grid container spacing={2.5} justifyContent="center">
            {kpis.map((sensor, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <Card className="kpi-card-surface">
                    <CardContent sx={{ p: "0 !important" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#94a3b8",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {sensor.icon} {sensor.label}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: isMobile ? "2rem" : "2.25rem",
                            fontWeight: 700,
                            color: "#f8fafc",
                            lineHeight: 1.1,
                          }}
                        >
                          {sensor.value}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: sensor.color,
                            marginLeft: "8px",
                          }}
                        >
                          {sensor.unit}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        {sensor.sub}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* 🔹 Gráfico Histórico Técnico */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="chart-card-surface">
              <Box sx={{ marginBottom: "12px" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                  📈 Historial de Sensores
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                  Telemetría de lecturas recientes
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={isMobile ? 240 : 310}>
                <LineChart
                  data={data}
                  margin={{ top: 10, right: isMobile ? 5 : 15, left: isMobile ? -20 : -5, bottom: 0 }}
                >
                  <CartesianGrid stroke="#263449" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={{ stroke: "#263449" }}
                    tickLine={false}
                    hide={isMobile}
                  />
                  <YAxis
                    yAxisId="environment"
                    orientation="left"
                    domain={[0, 100]}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={{ stroke: "#263449" }}
                    tickLine={false}
                    tickCount={5}
                    label={{
                      value: "°C / %",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                      fontSize: 11,
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <YAxis
                    yAxisId="soil"
                    orientation="right"
                    domain={[0, 4095]}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={{ stroke: "#263449" }}
                    tickLine={false}
                    tickCount={5}
                    label={{
                      value: "ADC",
                      angle: 90,
                      position: "insideRight",
                      fill: "#94a3b8",
                      fontSize: 11,
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#263449",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                    }}
                    itemStyle={{ color: "#f8fafc" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "16px", color: "#94a3b8", fontSize: "13px" }} />
                  <Line
                    yAxisId="environment"
                    type="monotone"
                    dataKey="temperatura"
                    stroke="#fb923c"
                    strokeWidth={2.5}
                    name="Temperatura (°C)"
                    dot={{ r: 3, fill: "#fb923c" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="environment"
                    type="monotone"
                    dataKey="humedad_aire"
                    stroke="#22d3ee"
                    strokeWidth={2.5}
                    name="Humedad del Aire (%)"
                    dot={{ r: 3, fill: "#22d3ee" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="soil"
                    type="monotone"
                    dataKey="humedad_suelo"
                    stroke="#34d399"
                    strokeWidth={2.5}
                    name="Humedad del Suelo (ADC)"
                    dot={{ r: 3, fill: "#34d399" }}
                    activeDot={{ r: 6 }}
                  />
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
