import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Upload,
  Scissors,
  RefreshCw,
  Package,
} from "lucide-react";
import { Button } from "../ui/button";
import { croppedLogoStyles } from "./CroppedSchoolLogos";

// Import the 9 M3 school logos
import gemsLogo from "../../../assets/5847ffa798b8c146c3c221156acaec26115d3fb5.png";
import millenniumLogo from "../../../assets/1f07f3d5c31bce9975933f7cbfed7f50a0f03a05.png";
import pictLogo from "../../../assets/e3d0f8f7b7290d061ede9f517b44121bf9846d95.png";
import psbbLogo from "../../../assets/958bf515bfbaa4b45ac954b2a92c874737508d15.png";
import sanskritiLogo from "../../../assets/d24d25bf1536ea98bae4b99e75b31ad817df55b7.png";
import shivNadarLogo from "../../../assets/1ff4f1851d120f35945f30bef59a7c31a7a13778.png";
import gearLogo from "../../../assets/4ace1a3eca57e491bdfbc4434550d4c95bd2b5a3.png";
import sriKumaranLogo from "../../../assets/5cf8e7c03368e1f1f780f5ba0e618e049183ff68.png";
import tvsLogo from "../../../assets/941fdc1771d7c7bcfb9bdaa4ea07189007cbde6c.png";

interface CroppedLogo {
  original: string;
  cropped: string;
  name: string;
}

export const LogoCropper: React.FC = () => {
  const [logos, setLogos] = useState<CroppedLogo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessing(true);

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const croppedDataUrl = autoCropImage(img);
          setLogos((prev) => [
            ...prev,
            {
              original: e.target?.result as string,
              cropped: croppedDataUrl,
              name: file.name,
            },
          ]);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    setIsProcessing(false);
  };

  const autoCropImage = (img: HTMLImageElement): string => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // Draw image to canvas
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    const data = imageData.data;

    // Find bounds (detect non-transparent/non-white pixels)
    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;

    const threshold = 250; // Consider pixels with RGB values above this as "whitespace"

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Check if pixel is NOT transparent and NOT white
        const isContent =
          a > 10 &&
          (r < threshold || g < threshold || b < threshold);

        if (isContent) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Add small padding (5% of dimensions)
    const paddingX = Math.max(
      5,
      Math.floor((maxX - minX) * 0.05),
    );
    const paddingY = Math.max(
      5,
      Math.floor((maxY - minY) * 0.05),
    );

    minX = Math.max(0, minX - paddingX);
    minY = Math.max(0, minY - paddingY);
    maxX = Math.min(canvas.width, maxX + paddingX);
    maxY = Math.min(canvas.height, maxY + paddingY);

    // Create cropped canvas
    const croppedWidth = maxX - minX;
    const croppedHeight = maxY - minY;

    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = croppedWidth;
    croppedCanvas.height = croppedHeight;
    const croppedCtx = croppedCanvas.getContext("2d");

    if (croppedCtx) {
      croppedCtx.drawImage(
        canvas,
        minX,
        minY,
        croppedWidth,
        croppedHeight,
        0,
        0,
        croppedWidth,
        croppedHeight,
      );
    }

    return croppedCanvas.toDataURL("image/png");
  };

  const downloadLogo = (logo: CroppedLogo) => {
    const link = document.createElement("a");
    link.href = logo.cropped;
    link.download = `cropped-${logo.name}`;
    link.click();
  };

  const downloadAll = () => {
    logos.forEach((logo) => {
      setTimeout(() => downloadLogo(logo), 100);
    });
  };

  const clearAll = () => {
    setLogos([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // M3 Customer Logos batch export
  const downloadM3CustomerLogos = async () => {
    const m3Logos = [
      {
        src: gemsLogo,
        name: "gems-logo.png",
        style: croppedLogoStyles.gems,
      },
      {
        src: millenniumLogo,
        name: "millennium-logo.png",
        style: croppedLogoStyles.millennium,
      },
      {
        src: pictLogo,
        name: "pict-logo.png",
        style: croppedLogoStyles.pict,
      },
      {
        src: psbbLogo,
        name: "psbb-logo.png",
        style: croppedLogoStyles.psbb,
      },
      {
        src: sanskritiLogo,
        name: "sanskriti-logo.png",
        style: croppedLogoStyles.sanskriti,
      },
      {
        src: shivNadarLogo,
        name: "shiv-nadar-logo.png",
        style: croppedLogoStyles.shivNadar,
      },
      {
        src: gearLogo,
        name: "gear-logo.png",
        style: croppedLogoStyles.gear,
      },
      {
        src: sriKumaranLogo,
        name: "sri-kumaran-logo.png",
        style: croppedLogoStyles.sriKumaran,
      },
      {
        src: tvsLogo,
        name: "tvs-logo.png",
        style: croppedLogoStyles.tvs,
      },
    ];

    setIsProcessing(true);

    for (const logo of m3Logos) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Create canvas with scaled version (landscape 16:9 scaling)
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve();
            return;
          }

          // Container dimensions for export (2x resolution)
          const containerWidth = 640; // 320 * 2
          const containerHeight = 192; // 96 * 2

          canvas.width = containerWidth;
          canvas.height = containerHeight;

          // Fill with transparent background
          ctx.clearRect(0, 0, containerWidth, containerHeight);

          // Calculate scaled dimensions
          const scale = logo.style.scaleLandscape;
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          // Calculate aspect ratio fit
          const aspectRatio = scaledWidth / scaledHeight;
          const containerAspect =
            containerWidth / containerHeight;

          let drawWidth, drawHeight;
          if (aspectRatio > containerAspect) {
            // Logo is wider - fit to width
            drawWidth = containerWidth * 0.9; // 90% of container
            drawHeight = drawWidth / aspectRatio;
          } else {
            // Logo is taller - fit to height
            drawHeight = containerHeight * 0.9; // 90% of container
            drawWidth = drawHeight * aspectRatio;
          }

          // Center the logo
          const x = (containerWidth - drawWidth) / 2;
          const y = (containerHeight - drawHeight) / 2;

          ctx.drawImage(img, x, y, drawWidth, drawHeight);

          // Download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = logo.name;
              link.click();
              URL.revokeObjectURL(url);
            }
            resolve();
          }, "image/png");
        };
        img.onerror = () => resolve();
        img.src = logo.src;
      });

      // Small delay between downloads
      await new Promise((r) => setTimeout(r, 300));
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-white mb-3">
            Logo Cropper
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            Automatically remove whitespace from school logos
            for perfect fit in slides
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-white/30 rounded-xl p-12 cursor-pointer hover:bg-white/5 transition-all"
          >
            <Upload className="w-16 h-16 text-white mb-4" />
            <p className="text-white text-xl font-bold mb-2">
              Upload School Logos
            </p>
            <p className="text-gray-300 text-sm">
              PNG, JPG, or JPEG • Multiple files supported •
              Auto-crops whitespace
            </p>
          </label>

          {logos.length > 0 && (
            <div className="mt-6 flex gap-3">
              <Button
                onClick={downloadAll}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-6 py-3 hover:scale-105 transition-transform"
              >
                <Download className="w-5 h-5 mr-2" />
                Download All Cropped ({logos.length})
              </Button>
              <Button
                onClick={clearAll}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-6 py-3 hover:scale-105 transition-transform"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* M3 Customer Logos Quick Export */}
        <div className="bg-gradient-to-br from-crimson/20 to-blue/20 backdrop-blur-md rounded-2xl p-8 border-2 border-yellow/40 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-yellow rounded-2xl flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-900" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-white mb-2">
                M3 Customer Logos Package
              </h2>
              <p className="text-gray-200 mb-4">
                Download all 9 partner school logos with
                optimized scaling applied (16:9 landscape @ 2x
                resolution). Perfect for use in video slides and
                marketing collateral.
              </p>
              <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-300">
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  GEMS
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  Millennium
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  PICT
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  PSBB
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  Sanskriti
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  Shiv Nadar
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  GEAR
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  Sri Kumaran
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  TVS
                </span>
              </div>
              <Button
                onClick={downloadM3CustomerLogos}
                disabled={isProcessing}
                className="bg-gradient-to-r from-yellow to-yellow/80 text-gray-900 font-black px-8 py-4 text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package className="w-6 h-6 mr-3" />
                {isProcessing
                  ? "Exporting Logos..."
                  : "Download All M3 Customer Logos (9)"}
              </Button>
            </div>
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center py-8">
            <Scissors className="w-12 h-12 text-yellow animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-bold">
              Processing logos...
            </p>
          </div>
        )}

        {/* Results Grid */}
        {logos.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white">
              Cropped Results
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {logos.map((logo, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                >
                  <h3 className="text-white font-bold text-lg mb-4">
                    {logo.name}
                  </h3>

                  {/* Before/After Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-300 text-sm font-bold mb-2">
                        Original
                      </p>
                      <div className="bg-white rounded-lg p-4 h-32 flex items-center justify-center border-2 border-red-500">
                        <img
                          src={logo.original}
                          alt="Original"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm font-bold mb-2">
                        Cropped ✨
                      </p>
                      <div className="bg-white rounded-lg p-4 h-32 flex items-center justify-center border-2 border-green-500">
                        <img
                          src={logo.cropped}
                          alt="Cropped"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => downloadLogo(logo)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 hover:scale-105 transition-transform"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Cropped
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {logos.length === 0 && !isProcessing && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-black text-white mb-4">
              How It Works
            </h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-crimson rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white">
                  1
                </div>
                <p>
                  <span className="font-bold text-white">
                    Upload your school logos
                  </span>{" "}
                  - supports PNG, JPG, or JPEG files
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white">
                  2
                </div>
                <p>
                  <span className="font-bold text-white">
                    Auto-crop magic
                  </span>{" "}
                  - we automatically detect and remove excess
                  whitespace/padding
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white">
                  3
                </div>
                <p>
                  <span className="font-bold text-white">
                    Download cropped versions
                  </span>{" "}
                  - logos will fill their containers perfectly
                  in slides
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white">
                  4
                </div>
                <p>
                  <span className="font-bold text-white">
                    Re-import to Figma
                  </span>{" "}
                  - replace the original logos with cropped
                  versions, then re-import to Make
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoCropper;