// src/Pages/UploadPdf/index.js

import React, { useState, useRef } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js'; 
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import { QRCodeCanvas } from 'qrcode.react'; // Use QRCodeCanvas instead of QRCodeSVG
import './css/pdf.css';

const PdfUpload = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [qrColor, setQrColor] = useState('#000000');
  const [showColorEditor, setShowColorEditor] = useState(false);

  const placeholderUrl = 'https://example.com'; // Placeholder if no PDF uploaded

  // Ref for the QR Canvas
  const qrCanvasRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        triggerNotification('Alleen PDF bestanden zijn toegestaan.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
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

  const handleDownloadQR = () => {
    if (!qrCanvasRef.current) return;
    const canvas = qrCanvasRef.current.querySelector('canvas');
    if (!canvas) return;

    // Convert canvas to PNG data URL
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

  return (
    <div className="pdf-page">
      <NotificationComponent />
      <div className="pdf-page__container">
        {/* Left side: Upload Form */}
        <form className="pdf-page__form" onSubmit={handleSubmit}>
          <div className="pdf-page__form-group">
            <label>Kies een PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="pdf-page__input"
            />
          </div>
          <button type="submit" className="button-style-3" disabled={isUploading}>
            {isUploading ? 'Bezig met uploaden...' : 'Uploaden'}
          </button>
        </form>

        {/* Right side: QR Code and Buttons */}
        <div className="pdf-page__content">
          <div className="pdf-page__qr-section">
            <h3>QR Code</h3>
            <div className="pdf-page__qr-container" ref={qrCanvasRef}>
              <QRCodeCanvas
                value={pdfUrl || placeholderUrl}
                size={150}
                fgColor={qrColor}
                className="pdf-page__qr-code"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default withHeader(PdfUpload);
