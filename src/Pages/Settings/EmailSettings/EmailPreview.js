// src/components/EmailSettings/EmailPreview.jsx

import React from 'react';

const EmailPreview = ({ settings }) => {
  // Sample data for placeholders
  const sampleData = {
    firstName: 'Jan',
    lastName: 'Jansen',
    date: new Date(),
    time: '18:30',
    guests: 4,
    phone: '0123456789',
    email: 'jan.jansen@example.com',
    reservationId: '123456789',
  };

  // Function to format the date
  const formatDate = (date) => {
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="email-preview-container">
      {/* Inline styles to isolate from the rest of the code */}
      <style>
        {`
          /* CSS Reset to neutralize external styles */
          .email-preview-container, .email-preview-container * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif !important;
            color: inherit !important;
            text-align: left;
            text-decoration: none;
            list-style: none;
            border: none;
            background: none;
          }

          /* Container Styles */
          .email-preview-container-small {
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            padding: 20px;
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
          }

          /* Sender Info Styles */
          .sender-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start; /* Align items to the start (left) */
            margin-bottom: 20px;
            width: 100%;
          }

          .sender-info .info-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #cccccc;
            border-radius: 5px;
            padding: 10px 15px;
            color: #666666;
            margin-bottom: 10px;
            width: 100%;
            background-color: #f5f5f5;
          }

          .sender-info .info-box .label {
            font-weight: bold;
            color: #333333;
          }

          .sender-info .info-box .value {
            font-weight: normal;
            text-align: right;
          }

          /* Email Body Styles */
          .email-preview-container .email-body {
            color: #333333;
          }

          .email-preview-container .email-body h2 {
            color: #FB5B86;
            font-size: 24px;
            margin-bottom: 16px;
          }

          .email-preview-container .email-body p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 16px;
          }

          /* Reservation Table Styles */
          .email-preview-container .reservation-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 14px;
          }

          .email-preview-container .reservation-table td {
            padding: 8px 12px;
            border: 1px solid #dddddd;
          }

          .email-preview-container .reservation-table td.label {
            font-weight: 600;
            width: 150px;
            vertical-align: top;
            background-color: #f9f9f9;
          }

          /* Email Footer Styles */
          .email-preview-container .email-footer {
            text-align: center;
            font-size: 12px;
            color: gray;
            border-top: 1px solid #dddddd;
            padding-top: 10px;
            margin-top: 20px;
          }

          .email-preview-container .email-footer a {
            color: gray;
            text-decoration: none;
          }

          .email-preview-container .email-footer img {
            display: block;
            margin: 0 auto; /* Center the logo */
            vertical-align: middle;
          }
        `}
      </style>

      {/* Sender Info */}
      <div className="sender-info">
        <div className="info-box">
          <span className="label">Verzender:</span>
          <span className="value">{settings.groetNaam || 'Het Team'}</span>
        </div>
		<div className="info-box">
          <span className="label">Email:</span>
          <span className="value">bevestiging@reservaties.net</span>
        </div>
        <div className="info-box">
          <span className="label">Antwoord naar:</span>
          <span className="value">{settings.antwoordEmail || 'noreply@example.com'}</span>
        </div>
      </div>

<div className='email-preview-container-small'>
      <div className="email-body">
        {/* Start Greeting */}
		<h2>
		{settings.startGreeting || 'Beste'} {sampleData.firstName},
		</h2>

        <p>
          Uw reservatie is bevestigd voor{' '}
          <strong>{formatDate(sampleData.date)}</strong> om{' '}
          <strong>{sampleData.time}</strong>.
        </p>

        {/* Email Content */}
        <p>
          {settings.emailInhoud ||
            'Wij kijken ernaar uit om u te verwelkomen en hopen dat u een fijne tijd zult hebben.'}
        </p>

        {/* Reservation Edit Link */}
        {settings.reservatieBewerken === 'Reservatie Bewerken Toestaan' && (
          <p>
            U kunt uw reservatie bewerken via de volgende link:{' '}
            <a
              href={`https://edit.reservaties.net?reservationId=${sampleData.reservationId}`}
            >
              Reservatie Bewerken
            </a>
          </p>
        )}

		        {/* End Greeting */}
        <p>{settings.endGreeting || 'Met vriendelijke groeten,'}</p>
        <p>
          <strong>{settings.groetNaam || 'Het Team'}</strong>
        </p>
      </div>

        {/* Reservation Table */}
        {settings.toonTabel === 'Toon tabel' && (
          <>
            <p>
              <strong>Uw Informatie:</strong>
            </p>
            <table className="reservation-table">
              <tbody>
                <tr>
                  <td className="label">Naam:</td>
                  <td>
                    {sampleData.firstName} {sampleData.lastName}
                  </td>
                </tr>
                <tr>
                  <td className="label">Datum:</td>
                  <td>{formatDate(sampleData.date)}</td>
                </tr>
                <tr>
                  <td className="label">Tijd:</td>
                  <td>{sampleData.time}</td>
                </tr>
                <tr>
                  <td className="label">Aantal Personen:</td>
                  <td>{sampleData.guests}</td>
                </tr>
                <tr>
                  <td className="label">Telefoonnummer:</td>
                  <td>{sampleData.phone}</td>
                </tr>
                <tr>
                  <td className="label">E-mailadres:</td>
                  <td>{sampleData.email}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}



      {/* Email Footer */}
      <div className="email-footer">
        <p>
          <a href="https://mateza.be">
            <img
              src="https://static.reservaties.net/images/logo/logo.png"
              alt="Mateza Logo"
              style={{ width: '35px', height: '35px' }}
            />
          </a>
        </p>
      </div>
	  </div>
    </div>
  );
};

export default EmailPreview;
