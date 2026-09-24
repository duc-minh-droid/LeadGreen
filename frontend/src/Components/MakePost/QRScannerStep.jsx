import React, { useState } from "react";
import { Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion } from "framer-motion";
import { ArrowForward, Cancel, QrCode2 } from "@mui/icons-material";
import { toastError, toastInfo, toastSuccess } from "../utils/toastCustom";
import axiosInstance from "../../Context/axiosInstance";
import { DEMO_MODE } from "../../config";
import { QR_CODES } from "../../demo/demoData";

const QRScannerStep = ({ qrValue, setQrValue, nextStep }) => {
  const [isScanning, setIsScanning] = useState(qrValue === "");
  const [isValidating, setIsValidating] = useState(false);
  
  // Validate QR code with the server
  const validateQRCode = async (scannedCode) => {
    try {
      const response = await axiosInstance.get("qrcodes/", {
        params: { qr_code: scannedCode }
      });
      return response.data.exists;
    } catch (error) {
      console.error('Error validating QR code:', error);
      return false;
    }
  };

  // Handle when a QR code is detected
  const handleScan = async (detectedCodes) => {
    // Ignore if already validating or no codes detected
    if (isValidating || !detectedCodes || detectedCodes.length === 0) {
      return;
    }
    const code = detectedCodes[0].rawValue;
    
    // Start validation
    setIsValidating(true);
    toastInfo('🔃 Validating QR code...');
    
    try {
      // Validate the QR code
      const isValid = await validateQRCode(code);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, DEMO_MODE ? 700 : 1600));
      
      if (isValid) {
        setQrValue(code);
        setIsScanning(false);
        toastSuccess(`✅ QR Code Verified: ${code}`);
      } else {
        toastError(`❌ QR Code Invalid: "${code}". Please scan again.`);
      }
    } catch (error) {
      toastError('Error during validation. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  // Handle scanner errors
  const handleError = (error) => {
    console.error('Scanner error:', error);
    toastError('Error accessing camera. Please check permissions.');
  };

  // Reset the scanner
  const handleReset = () => {
    setQrValue("");
    setIsScanning(true);
    toastInfo("QR Code Reset!");
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 3,
        borderRadius: "12px",
        border: "2px solid #ccc",
        backgroundColor: "#FFF",
        width: { xs: "90%", sm: "80%", md: "100%" },
        mx: "auto",
      }}
    >
      <Typography
        variant="body1"
        fontWeight="bold"
        mb={2}
        color="black"
        sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
      >
        Step 1: Scan QR Code
      </Typography>

      {/* Scanner or success view */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {isScanning ? (
          <Box
            sx={{
              width: { xs: "250px", sm: "300px", md: "320px" },
              height: DEMO_MODE ? "190px" : { xs: "250px", sm: "300px", md: "320px" },
              mx: "auto",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {DEMO_MODE ? (
              // No camera in demo mode: an animated viewfinder stands in for the scanner
              <Box sx={{ position: "absolute", inset: 0, bgcolor: "#0f2e1a", display: "grid", placeItems: "center", overflow: "hidden" }}>
                <QrCode2 sx={{ fontSize: 110, color: "rgba(255,255,255,0.15)" }} />
                <motion.div
                  style={{ position: "absolute", left: "10%", right: "10%", height: 3, borderRadius: 2, background: "#4ade80", boxShadow: "0 0 18px #4ade80" }}
                  animate={{ top: ["12%", "86%", "12%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                {["0 auto auto 0", "0 0 auto auto", "auto auto 0 0", "auto 0 0 auto"].map((inset, i) => (
                  <Box key={i} sx={{ position: "absolute", inset, m: 2, width: 36, height: 36,
                    borderColor: "#4ade80", borderStyle: "solid", borderWidth: 0,
                    ...(i === 0 && { borderTopWidth: 4, borderLeftWidth: 4 }),
                    ...(i === 1 && { borderTopWidth: 4, borderRightWidth: 4 }),
                    ...(i === 2 && { borderBottomWidth: 4, borderLeftWidth: 4 }),
                    ...(i === 3 && { borderBottomWidth: 4, borderRightWidth: 4 }),
                  }} />
                ))}
              </Box>
            ) : (
              <Scanner
                onScan={handleScan}
                onError={handleError}
                scanDelay={500}
                paused={isValidating}
              />
            )}
            
            {/* Overlay during validation */}
            {isValidating && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <CircularProgress color="inherit" size={60} />
                <Typography sx={{ mt: 2 }}>Validating...</Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              width: { xs: "250px", sm: "300px", md: "320px" },
              height: { xs: "250px", sm: "300px", md: "320px" },
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              border: "1px solid #eaeaea",
              p: 2,
            }}
          >
            {/* Centered QR code icon */}
            <Box
              sx={{
                width: "100px",
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
              }}
            >
              <QrCode2 
                sx={{ 
                  color: "#4CAF50", 
                  fontSize: 80,
                }} 
              />
            </Box>
            
            {/* Success checkmark and message */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: "#4CAF50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1,
                }}
              >
                <Typography sx={{ color: "white", fontWeight: "bold", fontSize: 16, lineHeight: 1 }}>
                  ✓
                </Typography>
              </Box>
              <Typography
                variant="body1"
                fontWeight="bold"
                color="#333"
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
              >
                Verified QR Code:
              </Typography>
            </Box>
            
            {/* QR Code value in a styled container */}
            <Box
              sx={{
                width: "100%",
                p: 1.5,
                backgroundColor: "#f1f1f1",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="body2"
                align="center"
                sx={{ 
                  fontFamily: "monospace",
                  color: "#333",
                  fontWeight: "medium",
                  wordBreak: "break-all"
                }}
              >
                {qrValue}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Demo mode: no camera needed, pretend to scan one of the campus codes */}
      {DEMO_MODE && isScanning && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: "#555", display: "block", mb: 1 }}>
            Demo mode: tap a campus code to simulate a scan
          </Typography>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1}>
            {QR_CODES.map((q) => (
              <Button
                key={q.code}
                size="small"
                variant="outlined"
                disabled={isValidating}
                onClick={() => handleScan([{ rawValue: q.code }])}
                sx={{ borderColor: "#1B6630", color: "#1B6630", textTransform: "none", borderRadius: 999, fontSize: 12, py: 0.25 }}
              >
                {q.location} · {q.points} pts
              </Button>
            ))}
          </Stack>
        </Box>
      )}

      {/* Action buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={3} width="100%">
        {qrValue && (
          <Button
            variant="contained"
            sx={{
              flex: 1,
              bgcolor: "red",
              "&:hover": { bgcolor: "#ff4d4d", transform: "scale(1.05)" },
              transition: "all 0.3s ease-in-out",
            }}
            onClick={handleReset}
            disabled={isValidating}
            startIcon={<Cancel />}
          >
            RESET
          </Button>
        )}

        <Button
          variant="contained"
          sx={{
            flex: 1,
            bgcolor: "#1B6630",
            "&:hover": { bgcolor: "#155724", transform: "scale(1.05)" },
            transition: "all 0.3s ease-in-out",
          }}
          onClick={qrValue ? nextStep : handleReset}
          disabled={isValidating || !qrValue}
          endIcon={<ArrowForward />}
        >
          {isValidating ? "VALIDATING..." : (qrValue ? "NEXT" : "SCAN QR CODE")}
        </Button>
      </Stack>
    </Box>
  );
};

export default QRScannerStep;