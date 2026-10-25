"use client";
import "./Ws.css";
import { whatsAppNumber, whatsappMessage1 } from "../../data/siteInfo";
import { WhatsAppIcon } from "../../utils/icons";




const WhatsAppLogo = () => { 

  return (
    <a href={`https://wa.me/${whatsAppNumber}/?text=${whatsappMessage1}`} target="_blank" rel="noopener noreferrer">
      <div className="whatsapp-container">
        <WhatsAppIcon size={24} className="whatsapp-icon" /> 
        <span className="notification-badge">1</span>
      </div>
    </a>
  );
};

export default WhatsAppLogo;