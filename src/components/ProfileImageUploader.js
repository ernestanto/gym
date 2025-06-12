import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";
import { auth } from './firebase';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css"; // Make sure to import Cropper's styles

const ProfileImageUploader = forwardRef(({ onImageChange }, ref) => {
  const [preview, setPreview] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null); // State for cropped image
  const webcamRef = useRef(null);
  const cropperRef = useRef(null); // Reference for cropper
  const fileInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    resetImageState() {
      setPreview(null);
      setCapturing(false);
      setCroppedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // 🔥 reset actual file input
      }
    },
  }));

  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: "user", // use front camera
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
  
      // Reset camera-related states
      setCapturing(false);
      setCroppedImage(null);
  
      // Set preview and notify parent
      setPreview(imageUrl);
      onImageChange(file, imageUrl);
    }
  };
  
  
  
  const startCamera = () => {
    setCapturing(true);
    setPreview(null);
    setCroppedImage(null);
  
    // 🔥 Reset the file input so previous file name is removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturing(false);
    setPreview(imageSrc);         // Show captured image in cropper
    setCroppedImage(null);        // Reset cropped image
  };

  
  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImageUrl = croppedCanvas.toDataURL();
        setCroppedImage(croppedImageUrl);
        const file = dataURLtoFile(croppedImageUrl, "cropped.png");
        onImageChange(file, croppedImageUrl);
      }
    }
  };
  
  
  
  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div style={styles.container}>
      {/* File input and camera button */}
      <div style={styles.actions}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={styles.fileInput}
          onClick={(e) => e.stopPropagation()}
        />
        <button type="button" onClick={startCamera}>Capture from Camera</button>

      </div>
  
      {/* Webcam section when capturing */}
      {/* Show webcam only if capturing */}
{capturing && (
  <div style={styles.cameraContainer}>
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/png"
      videoConstraints={videoConstraints}
      style={styles.webcam}
    />
    <button onClick={captureImage} style={styles.captureButton}>
      Take Picture
    </button>
  </div>
)}

{/* Show cropper only if preview image is available */}
{preview && !capturing && !croppedImage && (
  <div style={styles.previewFrame}>
    <Cropper
      src={preview}
      style={styles.previewImage}
      initialAspectRatio={1}
      aspectRatio={1}
      guides={false}
      cropBoxResizable={false}
      viewMode={1}
      background={false}
      responsive={true}
      autoCropArea={1}
      checkOrientation={false}
      onInitialized={(instance) => {
        cropperRef.current = instance;
      }}
    />
    <button onClick={handleCrop} style={styles.button}>
      Crop Image
    </button>
  </div>
)}

{/* Show final cropped image */}
{croppedImage && (
  <div style={styles.previewFrame}>
    <img
      src={croppedImage}
      alt="Cropped Preview"
      style={styles.previewImage}
    />
  </div>
)}

    </div>
  );
});

const styles = {
  container: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "20px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    width: "100%",
    maxWidth: "400px",
  },
  fileInput: {
    padding: "10px",
    width: "200px",
    marginRight: "15px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  cameraContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "300px",
    height: "300px",
    justifyContent: "center",
    marginTop: "10px",
  },
  webcam: {
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
    border: "2px solid #ccc",
  },
  captureButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  previewFrame: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    overflow: "hidden",
    marginTop: "20px",
    border: "2px solid #ccc",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
};

export default ProfileImageUploader;
