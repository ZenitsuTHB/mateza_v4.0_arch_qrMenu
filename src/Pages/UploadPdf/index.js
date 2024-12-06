// src/Pages/UploadPdf/index.js

import React, { useState, useRef, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js'; 
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import { QRCodeCanvas } from 'qrcode.react';
import './css/pdf.css';

const PdfUpload = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();
  
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [qrColor, setQrColor] = useState('#000000');
  const [showColorEditor, setShowColorEditor] = useState(false);

  const qrCanvasRef = useRef(null);

  // On mount, load pdfUrl and imageUrl from localStorage if present
  useEffect(() => {
    const storedPdfUrl = localStorage.getItem('uploadedPdfUrl');
    if (storedPdfUrl) {
      setPdfUrl(storedPdfUrl);
    }
    const storedImageUrl = localStorage.getItem('uploadedLogoUrl');
    if (storedImageUrl) {
      setImageUrl(storedImageUrl);
    }
  }, []);

  const handlePdfFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        triggerNotification('Alleen PDF bestanden zijn toegestaan.', 'error');
      }
    }
  };

  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
      } else {
        triggerNotification('Alleen afbeeldingen zijn toegestaan.', 'error');
      }
    }
  };

  const handlePdfUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      triggerNotification('Selecteer eerst een PDF bestand.', 'error');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const response = await api.post(`${window.baseDomain}api/upload-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response && response.pdfUrl) {
        setPdfUrl(response.pdfUrl);
        localStorage.setItem('uploadedPdfUrl', response.pdfUrl); // Store in localStorage
        triggerNotification('PDF succesvol geüpload.', 'success');
      } else {
        triggerNotification('Fout bij het uploaden van de PDF.', 'error');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      triggerNotification('Fout bij het uploaden van de PDF.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      triggerNotification('Selecteer eerst een afbeelding.', 'error');
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await api.post(`${window.baseDomain}api/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response && response.imageUrl) {
        setImageUrl(response.imageUrl);
        localStorage.setItem('uploadedLogoUrl', response.imageUrl); // Store image URL
        triggerNotification('Afbeelding succesvol geüpload.', 'success');
      } else {
        triggerNotification('Fout bij het uploaden van de afbeelding.', 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      triggerNotification('Fout bij het uploaden van de afbeelding.', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCanvasRef.current) return;
    const canvas = qrCanvasRef.current.querySelector('canvas');
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleViewLink = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, '_blank');
  };

  // imageSettings for QRCodeCanvas to display the logo/image in the center
  const imageSettings = imageUrl
    ? {
        src: imageUrl,
        height: 40, // Adjust as needed
        width: 40,  // Adjust as needed
        excavate: false
      }
    : undefined;

  return (
    <div className="pdf-page">
      <NotificationComponent />
      <h1 className="pdf-page__title">PDF Beheer</h1>
      <div className="pdf-page__container">
        {/* Left side: Upload Form */}
        <form className="pdf-page__form" onSubmit={handlePdfUpload}>
          <div className="pdf-page__form-group">
            <label>Kies een PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfFileChange}
              className="pdf-page__input"
            />
          </div>
          <button type="submit" className="button-style-3" disabled={isUploading}>
            {isUploading ? 'Bezig met uploaden...' : 'Uploaden PDF'}
          </button>

          <div className="pdf-page__form-group" style={{ marginTop: '20px' }}>
            <label>Kies een Afbeelding (voor midden van QR)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="pdf-page__input"
            />
          </div>
          <button
            type="button"
            className="button-style-3"
            disabled={isUploadingImage}
            onClick={handleImageUpload}
          >
            {isUploadingImage ? 'Bezig met uploaden...' : 'Uploaden Afbeelding'}
          </button>
        </form>

        {/* Right side */}
        <div className="pdf-page__content">
          <div className="pdf-page__qr-section">
            <h3>QR Code</h3>
            {pdfUrl ? (
              <>
                <div className="pdf-page__qr-container" ref={qrCanvasRef}>
                  <QRCodeCanvas
                    value={pdfUrl}
                    size={150}
                    fgColor={qrColor}
                    className="pdf-page__qr-code"
                    imageSettings={imageSettings}
                  />
                </div>

                {/* Button Group */}
                <div className="pdf-page__button-group">
                  <button onClick={handleDownloadQR} className="pdf-page__download-button">
                    Download QR Code
                  </button>
                  <button
                    className="pdf-page__edit-color-button"
                    onClick={() => setShowColorEditor(!showColorEditor)}
                  >
                    Kleur Bewerken
                  </button>
                  <button
                    className="pdf-page__view-link-button"
                    onClick={handleViewLink}
                    disabled={!pdfUrl}
                  >
                    Bekijk Link
                  </button>

                  {showColorEditor && (
                    <div className="pdf-page__color-editor">
                      <h4>Pas QR Kleur aan</h4>
                      <input
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="pdf-page__input pdf-page__color-picker"
                      />
                      <button
                        className="pdf-page__close-color-editor"
                        onClick={() => setShowColorEditor(false)}
                      >
                        Sluiten
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="pdf-page__no-pdf">geen pdf gevonden</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withHeader(PdfUpload);
